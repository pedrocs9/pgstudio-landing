export const ADMIN_SESSION_COOKIE = 'pgstudio_admin_session'
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12

export type AdminSession = {
  type: 'admin'
  sub: 'pgstudio-admin'
  iat: number
  exp: number
}

const encoder = new TextEncoder()

function base64UrlEncode(value: Uint8Array | string) {
  const bytes = typeof value === 'string' ? encoder.encode(value) : value
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

async function getSigningKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET
}

export function hasAdminAuthConfig() {
  return Boolean(process.env.ADMIN_PASSWORD && getSessionSecret())
}

export function getAdminCookieOptions(maxAge = ADMIN_SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export async function isValidAdminPassword(candidate: unknown) {
  const expected = process.env.ADMIN_PASSWORD

  if (!expected || typeof candidate !== 'string' || candidate.length === 0) {
    return false
  }

  const [candidateHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(candidate)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ])

  const candidateBytes = new Uint8Array(candidateHash)
  const expectedBytes = new Uint8Array(expectedHash)
  let diff = candidateBytes.length ^ expectedBytes.length
  const length = Math.max(candidateBytes.length, expectedBytes.length)

  for (let index = 0; index < length; index += 1) {
    diff |= (candidateBytes[index] ?? 0) ^ (expectedBytes[index] ?? 0)
  }

  return diff === 0
}

export async function createAdminSessionToken(now = Math.floor(Date.now() / 1000)) {
  const secret = getSessionSecret()

  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured')
  }

  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload: AdminSession = {
    type: 'admin',
    sub: 'pgstudio-admin',
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE_SECONDS,
  }
  const body = base64UrlEncode(JSON.stringify(payload))
  const signingInput = `${header}.${body}`
  const key = await getSigningKey(secret)
  const signature = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput))
  )

  return `${signingInput}.${base64UrlEncode(signature)}`
}

export async function verifyAdminSessionToken(token: string | undefined) {
  const secret = getSessionSecret()

  if (!secret || !token) {
    return null
  }

  const parts = token.split('.')

  if (parts.length !== 3) {
    return null
  }

  const [header, body, signature] = parts
  const signingInput = `${header}.${body}`
  const key = await getSigningKey(secret)
  const validSignature = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlDecode(signature),
    encoder.encode(signingInput)
  )

  if (!validSignature) {
    return null
  }

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(body))) as AdminSession
    const now = Math.floor(Date.now() / 1000)

    if (
      payload.type !== 'admin' ||
      payload.sub !== 'pgstudio-admin' ||
      typeof payload.iat !== 'number' ||
      typeof payload.exp !== 'number' ||
      payload.exp <= now
    ) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
