"use client";

import { useState, useEffect } from "react";
import { signIn, signUp, signOut, useSession } from "@/lib/auth-client";
import { Menu, X } from "lucide-react";

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Pourquoi SQUEST", href: "/pourquoi" },
  { label: "Classement", href: "/classement" },
  { label: "Amis", href: "/amis" },
  { label: "FAQ", href: "/faq" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    const close = () => { setProfileOpen(false); setMobileOpen(false); };
    window.addEventListener("scroll", close);
    return () => window.removeEventListener("scroll", close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = authModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [authModal]);

  const handleModalClose = () => {
    setAuthModal(null); setError("");
    setLoginEmail(""); setLoginPassword("");
    setSignupName(""); setSignupEmail(""); setSignupPassword("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await signIn.email({ email: loginEmail, password: loginPassword });
      if (res.error) setError(res.error.message || "Erreur de connexion.");
      else handleModalClose();
    } catch { setError("Une erreur est survenue."); }
    finally { setLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await signUp.email({ email: signupEmail, password: signupPassword, name: signupName });
      if (res.error) setError(res.error.message || "Erreur lors de l'inscription.");
      else handleModalClose();
    } catch { setError("Une erreur est survenue."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #06060f; }

        /* ── Pill ── */
        .squest-header {
          position: fixed; top: 10px; left: 50%; transform: translateX(-50%);
          width: calc(100% - 32px); max-width: 1320px; z-index: 1000;
          background: rgba(12,12,22,0.92); backdrop-filter: blur(16px);
          border-radius: 999px; border: 1px solid rgba(255,255,255,0.06);
          padding: 0 8px 0 18px; height: 48px;
          display: flex; align-items: center;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }

        /* ── Logo ── */
        .logo-wrap {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; flex-shrink: 0; margin-right: 24px;
        }
        .logo-icon { width: 28px; height: 28px; flex-shrink: 0; }
        .logo-text { display: flex; flex-direction: column; line-height: 1.15; }
        .logo-eyebrow { font-size: 7.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.35); }
        .logo-name { font-size: 15px; font-weight: 700; color: #f0f0f0; letter-spacing: -0.01em; }

        /* ── Desktop nav ── */
        .nav-links { display: flex; align-items: center; gap: 1px; flex: 1; }
        .nav-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.6); padding: 6px 12px; border-radius: 999px;
          display: flex; align-items: center; gap: 4px;
          transition: background 0.15s, color 0.15s; white-space: nowrap; text-decoration: none;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.07); color: #f0f0f0; }

        /* ── Actions ── */
        .header-actions { display: flex; align-items: center; gap: 4px; margin-left: 8px; }

        .btn-connect {
          padding: 7px 18px; background: #3b82f6; color: #fff; border: none;
          border-radius: 999px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-connect:hover { background: #2563eb; transform: scale(1.02); }

        /* ── Profile ── */
        .profile-wrap { position: relative; }
        .profile-btn {
          width: 32px; height: 32px; border-radius: 999px;
          background: #3b82f6; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff;
          transition: background 0.2s, transform 0.15s;
        }
        .profile-btn:hover { background: #2563eb; transform: scale(1.05); }
        .profile-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: #0e0e1c; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 8px; min-width: 180px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          opacity: 0; transform: translateY(-6px) scale(0.98); pointer-events: none;
          transition: opacity 0.18s, transform 0.18s;
        }
        .profile-dropdown.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
        .profile-info { padding: 8px 12px 10px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 6px; }
        .profile-info-name { font-size: 13px; font-weight: 600; color: #f0f0f0; }
        .profile-info-email { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 2px; }
        .profile-link {
          display: block; padding: 8px 12px; font-size: 13px; font-weight: 400;
          color: rgba(255,255,255,0.7); text-decoration: none; border-radius: 8px;
          transition: background 0.12s, color 0.12s;
        }
        .profile-link:hover { background: rgba(59,130,246,0.1); color: #f0f0f0; }
        .profile-signout {
          width: 100%; text-align: left; padding: 8px 12px;
          background: none; border: none; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: #f87171; cursor: pointer; transition: background 0.12s;
        }
        .profile-signout:hover { background: rgba(248,113,113,0.1); }

        /* ── Hamburger button ── */
        .mobile-menu-btn {
          display: none; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 999px;
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.6); transition: background 0.15s, color 0.15s;
        }
        .mobile-menu-btn:hover { background: rgba(255,255,255,0.07); color: #f0f0f0; }

        /* ── Mobile dropdown menu ── */
        .mobile-nav {
          position: fixed; top: 68px; left: 16px; right: 16px; z-index: 999;
          background: rgba(12,12,22,0.97); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.07); border-radius: 20px;
          padding: 8px; box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          opacity: 0; transform: translateY(-8px) scale(0.98);
          pointer-events: none; transition: opacity 0.2s, transform 0.2s;
        }
        .mobile-nav.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
        .mobile-nav a {
          display: block; padding: 12px 16px; font-size: 15px; font-weight: 500;
          color: rgba(255,255,255,0.7); text-decoration: none; border-radius: 12px;
          transition: background 0.12s, color 0.12s;
        }
        .mobile-nav a:hover { background: rgba(59,130,246,0.1); color: #f0f0f0; }
        .mobile-nav-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 6px 0; }

        /* ── Responsive breakpoint ── */
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .header-actions { margin-left: auto; }
          .mobile-menu-btn { display: flex; }
          .logo-wrap { margin-right: 0; }
          .squest-header { padding: 0 8px 0 14px; }
        }

        /* ── Auth modal ── */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center; padding: 16px;
          animation: bfadeIn 0.2s ease;
        }
        @keyframes bfadeIn { from { opacity:0 } to { opacity:1 } }
        .modal {
          background: #0e0e1c; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 40px 36px;
          width: 100%; max-width: 400px; position: relative;
          box-shadow: 0 32px 64px rgba(0,0,0,0.5);
          animation: bslideUp 0.3s cubic-bezier(0.23,1,0.32,1);
        }
        @keyframes bslideUp { from { opacity:0; transform: translateY(20px) } to { opacity:1; transform: translateY(0) } }
        @media (max-width: 480px) { .modal { padding: 32px 24px; border-radius: 20px; } }
        .modal-close {
          position: absolute; top: 14px; right: 16px;
          background: rgba(255,255,255,0.06); border: none;
          width: 28px; height: 28px; border-radius: 999px;
          font-size: 13px; cursor: pointer; color: rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .modal-close:hover { background: rgba(255,255,255,0.1); }
        .modal h2 { font-size: 24px; font-weight: 700; color: #f0f0f0; margin-bottom: 4px; letter-spacing: -0.02em; }
        .modal-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 28px; }
        .mfield { margin-bottom: 14px; }
        .mfield label { display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 6px; }
        .mfield input {
          width: 100%; padding: 10px 14px;
          background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 10px; outline: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #f0f0f0;
          transition: border-color 0.2s;
        }
        .mfield input::placeholder { color: rgba(255,255,255,0.2); }
        .mfield input:focus { border-color: #3b82f6; }
        .modal-error { font-size: 12px; color: #f87171; margin-top: 8px; text-align: center; }
        .modal-submit {
          width: 100%; margin-top: 20px; padding: 12px;
          background: #3b82f6; color: #fff; border: none; border-radius: 999px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background 0.2s;
        }
        .modal-submit:hover:not(:disabled) { background: #2563eb; }
        .modal-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .modal-tabs {
          display: flex; gap: 4px; background: rgba(255,255,255,0.05);
          border-radius: 999px; padding: 4px; margin-bottom: 24px;
        }
        .modal-tab {
          flex: 1; padding: 7px 0; border: none; border-radius: 999px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .modal-tab.active { background: #3b82f6; color: #fff; }
        .modal-tab:not(.active) { background: transparent; color: rgba(255,255,255,0.4); }
      `}</style>

      {/* ── Pill header ── */}
      <header className="squest-header">
        <a href="/" className="logo-wrap">
          <svg className="logo-icon" viewBox="0 0 38 38" fill="none">
            {[0, 45, 90, 135].map((angle) => {
              const r = (angle * Math.PI) / 180;
              return (
                <g key={angle}>
                  <line x1={19 + 5 * Math.cos(r)} y1={19 + 5 * Math.sin(r)} x2={19 + 16 * Math.cos(r)} y2={19 + 16 * Math.sin(r)} stroke="#3b82f6" strokeWidth="3.2" strokeLinecap="round" />
                  <line x1={19 + 5 * Math.cos(r + Math.PI)} y1={19 + 5 * Math.sin(r + Math.PI)} x2={19 + 16 * Math.cos(r + Math.PI)} y2={19 + 16 * Math.sin(r + Math.PI)} stroke="#3b82f6" strokeWidth="3.2" strokeLinecap="round" />
                </g>
              );
            })}
            <circle cx="19" cy="19" r="4" fill="#3b82f6" />
          </svg>
          <div className="logo-text">
            <span className="logo-eyebrow">Plateforme</span>
            <span className="logo-name">SQUEST</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="nav-links">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="nav-btn">{item.label}</a>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {session ? (
            <div className="profile-wrap">
              <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                {(session.user.name || session.user.email || "?")[0].toUpperCase()}
              </button>
              <div className={`profile-dropdown ${profileOpen ? "open" : ""}`}>
                <div className="profile-info">
                  <div className="profile-info-name">{session.user.name || "Utilisateur"}</div>
                  <div className="profile-info-email">{session.user.email}</div>
                </div>
                <a href="/profile" className="profile-link" onClick={() => setProfileOpen(false)}>
                  Mon profil
                </a>
                <button className="profile-signout" onClick={() => { signOut(); setProfileOpen(false); }}>
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-connect" onClick={() => setAuthModal("login")}>
              Se connecter
            </button>
          )}

          {/* Hamburger — mobile only */}
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* ── Mobile nav dropdown ── */}
      <div className={`mobile-nav ${mobileOpen ? "open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
            {item.label}
          </a>
        ))}
        {!session && (
          <>
            <div className="mobile-nav-divider" />
            <a href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(false); setAuthModal("login"); }}>
              Se connecter
            </a>
          </>
        )}
      </div>

      {/* ── Auth Modal ── */}
      {authModal && (
        <div className="modal-backdrop" onClick={handleModalClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleModalClose}>✕</button>
            <h2>Bienvenue</h2>
            <p className="modal-sub">Accédez à votre espace SQUEST</p>
            <div className="modal-tabs">
              <button className={`modal-tab ${authModal === "login" ? "active" : ""}`} onClick={() => { setError(""); setAuthModal("login"); }}>Connexion</button>
              <button className={`modal-tab ${authModal === "signup" ? "active" : ""}`} onClick={() => { setError(""); setAuthModal("signup"); }}>Inscription</button>
            </div>
            {authModal === "login" ? (
              <form onSubmit={handleLogin}>
                <div className="mfield"><label>Adresse email</label><input type="email" placeholder="vous@exemple.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required /></div>
                <div className="mfield"><label>Mot de passe</label><input type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required /></div>
                {error && <p className="modal-error">{error}</p>}
                <button className="modal-submit" type="submit" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
              </form>
            ) : (
              <form onSubmit={handleSignup}>
                <div className="mfield"><label>Nom complet</label><input type="text" placeholder="Jean Dupont" value={signupName} onChange={(e) => setSignupName(e.target.value)} required /></div>
                <div className="mfield"><label>Adresse email</label><input type="email" placeholder="vous@exemple.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required /></div>
                <div className="mfield"><label>Mot de passe</label><input type="password" placeholder="••••••••" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required /></div>
                {error && <p className="modal-error">{error}</p>}
                <button className="modal-submit" type="submit" disabled={loading}>{loading ? "Création..." : "Créer mon compte"}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
