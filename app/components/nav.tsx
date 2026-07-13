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
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        background: scrolled ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.46)',
        backdropFilter: 'blur(18px)',
        boxShadow: scrolled ? '0 10px 34px rgba(15,23,42,0.06)' : 'none',
        transition: 'background var(--duration) var(--ease), border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease)',
      }}
    >
      <div className="section-shell nav-shell" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--ink), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: 14, fontWeight: 700, color: '#fff',
            letterSpacing: '-0.5px',
          }}>
            PG
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15, fontWeight: 700, color: 'var(--text)',
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
              style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none', transition: 'color .2s ease' }}
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
              padding: '9px 18px', borderRadius: 999,
              background: 'var(--text)', color: '#fff',
              textDecoration: 'none', transition: 'background var(--duration) var(--ease), transform var(--duration) var(--ease)',
              fontFamily: 'var(--font-display)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--cyan)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--text)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
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
            border: '1px solid var(--border)', cursor: 'pointer', padding: 8,
            borderRadius: 10,
          }}
          className="hamburger-btn"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 2,
              background: 'var(--text)', borderRadius: 2,
              marginTop: i === 0 ? 0 : 5,
              transition: 'transform var(--duration) var(--ease), opacity var(--duration) var(--ease)',
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'rgba(255,255,255,0.96)',
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
              background: 'var(--text)', color: '#fff',
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
        @media (max-width: 420px) {
          .nav-shell { height: 60px !important; }
        }
      `}</style>
    </nav>
  )
}
