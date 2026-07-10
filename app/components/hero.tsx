'use client'

import { useState, useEffect } from 'react'
import { TYPING_WORDS, STATS } from '../lib/constants'

export default function Hero() {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = TYPING_WORDS[wordIndex]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1))
        if (text.length + 1 === word.length) setDeleting(true)
      } else {
        setText(word.slice(0, text.length - 1))
        if (text.length - 1 === 0) {
          setDeleting(false)
          setWordIndex((wordIndex + 1) % TYPING_WORDS.length)
        }
      }
    }, deleting ? 60 : 90)
    return () => clearTimeout(timeout)
  }, [text, deleting, wordIndex])

  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      padding: '160px 0 120px', textAlign: 'center',
    }}>

      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.18) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
      }} />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 12, fontWeight: 500, letterSpacing: '.12em',
          color: 'var(--cyan)', textTransform: 'uppercase',
          border: '1px solid var(--border-h)',
          padding: '6px 14px', borderRadius: 100, marginBottom: 28,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--cyan)', display: 'inline-block',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          Software hecho en Chile, para negocios reales
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(38px, 6vw, 72px)',
          fontWeight: 700, letterSpacing: '-2px',
          color: 'var(--text)', lineHeight: 1.1,
          maxWidth: 820, margin: '0 auto 20px',
        }}>
          Software que hace crecer tu{' '}
          <span style={{ color: 'var(--cyan)', whiteSpace: 'nowrap' }}>
            {text}
            <span style={{
              display: 'inline-block', width: 3, height: '0.85em',
              background: 'var(--cyan)', marginLeft: 2,
              verticalAlign: 'middle',
              animation: 'blink .8s step-end infinite',
            }} />
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 19px)',
          color: 'var(--muted)', maxWidth: 560,
          margin: '0 auto 44px', lineHeight: 1.65,
        }}>
          Soluciones SaaS modernas para negocios chilenos. Gestiona ventas,
          agendamientos y tu tienda online desde una sola plataforma.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#productos" className="btn-primary">Ver productos →</a>
          <a href="#contacto" className="btn-secondary">Habla con nosotros</a>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: 48, marginTop: 72, flexWrap: 'wrap',
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28, fontWeight: 700, color: 'var(--text)',
              }}>
                {s.num.replace(/[+%/]/g, '')}
                <span style={{ color: 'var(--cyan)' }}>
                  {s.num.match(/[+%/].*/)?.[0] ?? ''}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .5; transform: scale(1.3); }
        }
        @keyframes blink { 50% { opacity: 0; } }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 10px;
          background: var(--cyan); color: var(--bg);
          font-family: var(--font-display);
          font-size: 15px; font-weight: 600;
          text-decoration: none;
          transition: background .2s, transform .15s;
        }
        .btn-primary:hover {
          background: var(--cyan-l);
          transform: translateY(-2px);
        }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 10px;
          border: 1px solid var(--border-h); color: var(--text);
          font-family: var(--font-display);
          font-size: 15px; font-weight: 500;
          text-decoration: none;
          transition: border-color .2s, background .2s, transform .15s;
        }
        .btn-secondary:hover {
          border-color: var(--cyan);
          background: rgba(14,165,233,0.06);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  )
}