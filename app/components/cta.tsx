"use client";

import { useState } from "react";

export default function Cta() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setSent(true);
      setEmail("");
      setTimeout(() => setSent(false), 4000);
    }

    setLoading(false);
  }

  return (
    <section
      id="contacto"
      style={{ padding: "100px 0", background: "var(--bg)" }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "72px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow fondo */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: -80,
              left: "50%",
              transform: "translateX(-50%)",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: ".12em",
                color: "var(--cyan)",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Empieza hoy
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-1px",
                color: "var(--text)",
                marginBottom: 16,
              }}
            >
              ¿Listo para hacer crecer
              <br />
              tu negocio?
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "var(--muted)",
                maxWidth: 460,
                margin: "0 auto 40px",
                lineHeight: 1.65,
              }}
            >
              Déjanos tu email y en menos de 24 horas te contactamos para
              mostrarte cómo funciona.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                gap: 10,
                maxWidth: 440,
                margin: "0 auto",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--text)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  outline: "none",
                  transition: "border-color .2s",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--cyan)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              />
              <button
                type="submit"
                disabled={loading || sent}
                style={{
                  padding: "12px 22px",
                  background: sent ? "#10b981" : "var(--cyan)",
                  color: "var(--bg)",
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  fontWeight: 600,
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "wait" : "pointer",
                  transition: "background .2s, transform .15s",
                  whiteSpace: "nowrap",
                }}
              >
                {loading
                  ? "Enviando..."
                  : sent
                    ? "¡Enviado! ✓"
                    : "Quiero una demo"}
              </button>
            </form>

            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 14 }}>
              {sent
                ? "✓ Perfecto, te contactamos pronto."
                : "Sin spam. Te respondemos en menos de 24 horas."}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          form { flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}
