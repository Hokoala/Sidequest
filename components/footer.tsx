"use client"

import { Github, Twitter, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer style={{
      background: "#06060f",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "40px 24px",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg className="logo-icon" viewBox="0 0 38 38" fill="none">
                {[0, 45, 90, 135].map((angle) => {
                    const r = (angle * Math.PI) / 180;
                    return (
                        <g key={angle}>
                            <line
                                x1={19 + 5 * Math.cos(r)} y1={19 + 5 * Math.sin(r)}
                                x2={19 + 16 * Math.cos(r)} y2={19 + 16 * Math.sin(r)}
                                stroke="#3b82f6" strokeWidth="3.2" strokeLinecap="round"
                            />
                            <line
                                x1={19 + 5 * Math.cos(r + Math.PI)} y1={19 + 5 * Math.sin(r + Math.PI)}
                                x2={19 + 16 * Math.cos(r + Math.PI)} y2={19 + 16 * Math.sin(r + Math.PI)}
                                stroke="#3b82f6" strokeWidth="3.2" strokeLinecap="round"
                            />
                        </g>
                    );
                })}
                <circle cx="19" cy="19" r="4" fill="#3b82f6" />
            </svg>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#f0f0f0", letterSpacing: "-0.01em" }}>
            SQUEST
          </span>
        </div>

        {/* Links */}
        <nav style={{ display: "flex", gap: 24 }}>
          {[
            { label: "Accueil", href: "/" },
            { label: "Pourquoi SQUEST", href: "/pourquoi" },
            { label: "Classement", href: "/classement" },
            { label: "FAQ", href: "/faq" },
          ].map((l) => (
            <a key={l.href} href={l.href} style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 4 }}>
            Fait avec HOKOALA en 2026
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { Icon: Github, href: "#" },
              { Icon: Twitter, href: "#" },
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href} style={{
                width: 32, height: 32, borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.3)",
                transition: "color 0.15s, border-color 0.15s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#f0f0f0"
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.3)"
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
                }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
