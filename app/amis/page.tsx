"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useSession } from "@/lib/auth-client";
import { CheckCircle2 } from "lucide-react";

interface Friend {
  id: string;
  name: string;
  email: string;
  habitCount: number;
  weekPct: number;
  weekLogs: number;
}

export default function AmisPage() {
  const { data: session } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinMsg, setJoinMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetch("/api/friends").then((r) => r.json()).then(setFriends);
    }
  }, [session]);

  const generateInvite = async () => {
    const res = await fetch("/api/friends/invite", { method: "POST" });
    const data = await res.json();
    setInviteCode(data.code);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/amis/rejoindre/${inviteCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const acceptInvite = async () => {
    if (!joinCode.trim()) return;
    setLoading(true);
    setJoinMsg("");
    const res = await fetch("/api/friends/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      setJoinMsg("ok");
      setJoinCode("");
      fetch("/api/friends").then((r) => r.json()).then(setFriends);
    } else {
      setJoinMsg(data.error || "Erreur");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .amis-page {
          min-height: 100vh;
          background: #06060f;
          font-family: 'DM Sans', sans-serif;
          padding: 80px 24px 60px;
        }
        .amis-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .amis-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: #3b82f6; margin-bottom: 10px;
        }
        .amis-title {
          font-size: clamp(28px,5vw,48px); font-weight: 700;
          color: #f0f0f0; letter-spacing: -0.03em; margin-bottom: 8px;
        }
        .amis-sub {
          font-size: 15px; color: rgba(255,255,255,0.35);
          margin-bottom: 48px; line-height: 1.6;
        }

        .amis-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 48px;
        }
        .amis-card {
          background: #0c0c18;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 28px;
        }
        .amis-card-title {
          font-size: 16px; font-weight: 700; color: #f0f0f0;
          margin-bottom: 6px; letter-spacing: -0.01em;
        }
        .amis-card-sub {
          font-size: 12px; color: rgba(255,255,255,0.3);
          margin-bottom: 20px; line-height: 1.5;
        }

        .invite-link-box {
          display: flex;
          gap: 8px;
          align-items: center;
          background: rgba(59,130,246,0.06);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 12px;
          overflow: hidden;
        }
        .invite-link-text {
          flex: 1; font-size: 12px; color: rgba(255,255,255,0.5);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          font-family: monospace;
        }
        .btn-copy {
          padding: 6px 14px; background: #3b82f6; color: #fff; border: none;
          border-radius: 8px; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: background 0.2s; white-space: nowrap; flex-shrink: 0;
        }
        .btn-copy:hover { background: #2563eb; }

        .btn-generate {
          width: 100%; padding: 12px; background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.25); border-radius: 12px;
          color: #3b82f6; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: background 0.2s;
        }
        .btn-generate:hover { background: rgba(59,130,246,0.18); }

        .join-input {
          width: 100%; padding: 12px 14px;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.07);
          border-radius: 12px; color: #f0f0f0;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          outline: none; margin-bottom: 10px;
          transition: border-color 0.2s;
        }
        .join-input::placeholder { color: rgba(255,255,255,0.2); }
        .join-input:focus { border-color: #3b82f6; }

        .btn-join {
          width: 100%; padding: 12px; background: #3b82f6;
          border: none; border-radius: 12px; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; cursor: pointer; transition: background 0.2s;
        }
        .btn-join:hover { background: #2563eb; }
        .btn-join:disabled { opacity: 0.5; cursor: not-allowed; }

        .join-msg {
          margin-top: 10px; font-size: 13px;
          color: ${"`"}${"`"};
        }
        .join-msg.ok { color: #34d399; }
        .join-msg.err { color: #f87171; }

        /* Friends list */
        .friends-section-title {
          font-size: 13px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
          margin-bottom: 16px;
        }
        .friends-list {
          display: flex; flex-direction: column; gap: 10px;
        }
        .friend-row {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 20px;
          background: #0c0c18;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          transition: border-color 0.2s;
        }
        .friend-row:hover { border-color: rgba(59,130,246,0.2); }
        .friend-avatar {
          width: 40px; height: 40px; border-radius: 999px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .friend-info { flex: 1; min-width: 0; }
        .friend-name { font-size: 15px; font-weight: 600; color: #f0f0f0; }
        .friend-habits { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .friend-pct {
          font-size: 22px; font-weight: 700;
          color: #3b82f6; letter-spacing: -0.02em;
        }
        .friend-pct-label { font-size: 10px; color: rgba(255,255,255,0.25); text-align: right; }

        .friend-bar-wrap {
          width: 80px;
        }
        .friend-bar-bg {
          height: 4px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden;
        }
        .friend-bar-fill {
          height: 100%; background: #3b82f6; border-radius: 999px;
          transition: width 0.6s cubic-bezier(0.23,1,0.32,1);
        }

        .friends-empty {
          text-align: center; padding: 48px 24px;
          background: #0c0c18;
          border: 1px dashed rgba(255,255,255,0.07);
          border-radius: 20px;
          color: rgba(255,255,255,0.2); font-size: 14px; line-height: 1.7;
        }

        .no-session {
          text-align: center; padding: 80px 24px;
          color: rgba(255,255,255,0.3); font-size: 14px;
        }
      `}</style>

      <Header />
      <div className="amis-page">
        <div className="amis-container">
          <div className="amis-eyebrow">Communauté</div>
          <h1 className="amis-title">Partage avec tes amis</h1>
          <p className="amis-sub">
            Invite tes amis sur SQUEST et motivez-vous mutuellement.<br />
            Rejoins leur réseau en entrant un code d&apos;invitation.
          </p>

          {!session ? (
            <div className="no-session">Connecte-toi pour gérer tes amis.</div>
          ) : (
            <>
              <div className="amis-grid">
                {/* Invite */}
                <div className="amis-card">
                  <div className="amis-card-title">Inviter un ami</div>
                  <div className="amis-card-sub">
                    Génère un lien unique et envoie-le à un ami. Il peut l&apos;utiliser une seule fois.
                  </div>
                  {inviteCode ? (
                    <>
                      <div className="invite-link-box">
                        <span className="invite-link-text">
                          {typeof window !== "undefined" ? `${window.location.origin}/amis/rejoindre/${inviteCode}` : `…/amis/rejoindre/${inviteCode}`}
                        </span>
                        <button className="btn-copy" onClick={copyLink}>
                          {copied ? "Copié !" : "Copier"}
                        </button>
                      </div>
                      <button className="btn-generate" onClick={generateInvite}>
                        Générer un nouveau lien
                      </button>
                    </>
                  ) : (
                    <button className="btn-generate" onClick={generateInvite}>
                      Générer mon lien d&apos;invitation
                    </button>
                  )}
                </div>

                {/* Join */}
                <div className="amis-card">
                  <div className="amis-card-title">Rejoindre un ami</div>
                  <div className="amis-card-sub">
                    Tu as reçu un code d&apos;invitation ? Entre-le ici pour ajouter ton ami.
                  </div>
                  <input
                    className="join-input"
                    placeholder="Code d'invitation (ex: a1b2c3d4e5f6)"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && acceptInvite()}
                  />
                  <button className="btn-join" onClick={acceptInvite} disabled={loading || !joinCode.trim()}>
                    {loading ? "Ajout en cours…" : "Ajouter cet ami"}
                  </button>
                  {joinMsg && (
                    <div className={`join-msg ${joinMsg === "ok" ? "ok" : "err"}`}>
                      {joinMsg === "ok"
                        ? <><CheckCircle2 size={14} style={{ display:"inline", marginRight:6, verticalAlign:"middle" }} />Ami ajouté !</>
                        : joinMsg}
                    </div>
                  )}
                </div>
              </div>

              {/* Friends list */}
              <div className="friends-section-title">Mes amis ({friends.length})</div>
              <div className="friends-list">
                {friends.length === 0 ? (
                  <div className="friends-empty">
                    Tu n&apos;as pas encore d&apos;amis sur SQUEST.<br />
                    Génère un lien d&apos;invitation et envoie-le à quelqu&apos;un !
                  </div>
                ) : (
                  friends.map((f) => (
                    <div className="friend-row" key={f.id}>
                      <div className="friend-avatar">
                        {(f.name || f.email || "?")[0].toUpperCase()}
                      </div>
                      <div className="friend-info">
                        <div className="friend-name">{f.name || "Utilisateur"}</div>
                        <div className="friend-habits">{f.habitCount} habitude{f.habitCount !== 1 ? "s" : ""}</div>
                      </div>
                      <div className="friend-bar-wrap">
                        <div className="friend-bar-bg">
                          <div className="friend-bar-fill" style={{ width: `${f.weekPct}%` }} />
                        </div>
                        <div style={{ marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>7 jours</span>
                          <span style={{ fontSize: 10, color: "#3b82f6", fontWeight: 600 }}>{f.weekPct}%</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
