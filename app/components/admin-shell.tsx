'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navGroups = [
  {
    label: 'Inicio',
    items: [{ href: '/admin', label: 'Dashboard', desc: 'Vista operativa' }],
  },
  {
    label: 'Comercial',
    items: [
      { href: '/admin#leads', label: 'Leads', desc: 'Solicitudes entrantes' },
      { href: '/admin/cotizaciones', label: 'Cotizaciones', desc: 'Presupuestos' },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      { href: '/admin/proyectos', label: 'Proyectos', desc: 'Entregas y soporte' },
      { href: '/admin/vexor', label: 'Clientes Vexor', desc: 'Implementaciones' },
      { href: '/admin/dashboard', label: 'Finanzas', desc: 'MRR y cobros' },
    ],
  },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const title = getPageTitle(pathname)
  const today = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Navegacion administrativa">
        <AdminBrand />
        <AdminNav pathname={pathname} />
        <div className="admin-sidebar-footer">
          <span>Sesion administrativa</span>
          <strong>Administrador</strong>
          <Link href="/" target="_blank">Ver sitio publico</Link>
          <a href="/api/admin/logout">Cerrar sesion</a>
        </div>
      </aside>

      {open && <button className="admin-overlay" aria-label="Cerrar menu" onClick={() => setOpen(false)} />}

      <div className="admin-content">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-button"
            aria-label="Abrir navegacion administrativa"
            aria-expanded={open}
            aria-controls="admin-mobile-nav"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <div>
            <p>{today}</p>
            <h1>{title}</h1>
          </div>
          <div className="admin-topbar-actions">
            <Link href="/" target="_blank">Sitio publico</Link>
            <a href="/api/admin/logout">Salir</a>
          </div>
        </header>

        <div id="admin-mobile-nav" className={`admin-mobile-drawer ${open ? 'open' : ''}`}>
          <AdminBrand />
          <AdminNav pathname={pathname} />
          <div className="admin-sidebar-footer">
            <strong>Administrador</strong>
            <Link href="/" target="_blank">Ver sitio publico</Link>
            <a href="/api/admin/logout">Cerrar sesion</a>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}

function AdminBrand() {
  return (
    <Link href="/admin" className="admin-brand">
      <span>PG</span>
      <div>
        <strong>PG Studio</strong>
        <small>Admin</small>
      </div>
    </Link>
  )
}

function AdminNav({ pathname }: { pathname: string }) {
  return (
    <nav className="admin-nav">
      {navGroups.map(group => (
        <div key={group.label}>
          <p>{group.label}</p>
          {group.items.map(item => {
            const baseHref = item.href.split('#')[0]
            const active = baseHref === '/admin'
              ? pathname === '/admin'
              : pathname === baseHref || pathname.startsWith(`${baseHref}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'active' : ''}
                aria-current={active ? 'page' : undefined}
              >
                <span>{item.label}</span>
                <small>{item.desc}</small>
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith('/admin/cotizaciones')) return 'Cotizaciones'
  if (pathname.startsWith('/admin/proyectos')) return 'Proyectos'
  if (pathname.startsWith('/admin/vexor')) return 'Clientes Vexor'
  if (pathname.startsWith('/admin/dashboard')) return 'Finanzas'
  return 'Panel de PG Studio'
}
