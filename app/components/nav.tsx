'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NAV_LINKS } from '../lib/constants'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: `1px solid ${scrolled ? 'rgba(14,165,233,0.2)' : 'transparent'}`,
        background: scrolled ? 'rgba(10,15,30,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        transition: 'all .3s ease',
      }}
    >
      <div style={{
        maxWidth: 1120, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: 14, fontWeight: 700, color: 'var(--bg)',
            letterSpacing: '-0.5px',
          }}>
            PG
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15, fontWeight: 600, color: 'var(--text)',
          }}>
            pgstudio<span style={{ color: 'var(--cyan-l)' }}>.tech</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}
          className="desktop-nav">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contacto"
            style={{
              fontSize: 14, fontWeight: 600,
              padding: '8px 18px', borderRadius: 10,
              background: 'var(--cyan)', color: 'var(--bg)',
              textDecoration: 'none', transition: 'background .2s',
              fontFamily: 'var(--font-display)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--cyan-l)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--cyan)')}
          >
            Empezar
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
          style={{
            display: 'none', background: 'none',
            border: 'none', cursor: 'pointer', padding: 4,
          }}
          className="hamburger-btn"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 2,
              background: 'var(--text)', borderRadius: 2,
              marginTop: i === 0 ? 0 : 5,
              transition: '.25s',
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)',
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ fontSize: 15, color: 'var(--muted)', textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contacto"
            onClick={() => setOpen(false)}
            style={{
              fontSize: 15, fontWeight: 600,
              padding: '10px 18px', borderRadius: 10,
              background: 'var(--cyan)', color: 'var(--bg)',
              textDecoration: 'none', textAlign: 'center',
              fontFamily: 'var(--font-display)',
            }}
          >
            Empezar
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; flex-direction: column; }
        }
      `}</style>
    </nav>
  )
}