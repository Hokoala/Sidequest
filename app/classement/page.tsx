"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useSession } from "@/lib/auth-client";
import { Trophy, Medal, Award } from "lucide-react";

interface Player {
  rank: number;
  id: string;
  name: string;
  habitCount: number;
  weekPct: number;
  weekLogs: number;
  isMe: boolean;
}

const MEDAL_ICONS = [
  <Trophy size={20} style={{ color: "#facc15" }} />,
  <Medal  size={20} style={{ color: "#94a3b8" }} />,
  <Award  size={20} style={{ color: "#c2885a" }} />,
];

export default function ClassementPage() {
  const { data: session } = useSession();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/classement")
        .then((r) => r.json())
        .then((d) => { setPlayers(d); setLoading(false); });
    }
  }, [session]);

  const me = players.find((p) => p.isMe);

  return (
    <>
      <style>{`
        .cl-page {
          min-height: 100vh;
          background: #06060f;
          font-family: 'DM Sans', sans-serif;
          padding: 80px 24px 60px;
        }
        .cl-container { max-width: 760px; margin: 0 auto; }

        .cl-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: #3b82f6; margin-bottom: 10px;
        }
        .cl-title {
          font-size: clamp(28px,5vw,48px); font-weight: 700;
          color: #f0f0f0; letter-spacing: -0.03em; margin-bottom: 8px;
        }
        .cl-sub {
          font-size: 15px; color: rgba(255,255,255,0.35);
          margin-bottom: 48px; line-height: 1.6;
        }

        /* My rank card */
        .cl-my-card {
          background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(29,78,216,0.06));
          border: 1px solid rgba(59,130,246,0.25);
          border-radius: 20px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }
        .cl-my-rank {
          font-size: 40px; font-weight: 700; color: #3b82f6;
          letter-spacing: -0.04em; line-height: 1; width: 60px; text-align: center;
        }
        .cl-my-rank-label { font-size: 10px; color: rgba(255,255,255,0.3); text-align: center; }
        .cl-my-sep {
          width: 1px; height: 40px; background: rgba(255,255,255,0.08); flex-shrink: 0;
        }
        .cl-my-info { flex: 1; }
        .cl-my-name { font-size: 18px; font-weight: 700; color: #f0f0f0; }
        .cl-my-detail { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 3px; }
        .cl-my-pct {
          font-size: 36px; font-weight: 700; color: #3b82f6;
          letter-spacing: -0.03em;
        }
        .cl-my-pct-label { font-size: 10px; color: rgba(255,255,255,0.3); text-align: right; }

        /* Podium */
        .cl-podium {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          padding: 0 24px;
        }
        .podium-slot {
          flex: 1;
          max-width: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .podium-avatar {
          width: 48px; height: 48px; border-radius: 999px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 700; color: #fff;
        }
        .podium-name {
          font-size: 13px; font-weight: 600; color: #f0f0f0;
          text-align: center; max-width: 120px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .podium-pct {
          font-size: 20px; font-weight: 700; color: #3b82f6; letter-spacing: -0.02em;
        }
        .podium-bar {
          width: 100%;
          border-radius: 12px 12px 0 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }
        .podium-bar-1 { height: 100px; background: linear-gradient(to top, #1d4ed8, #3b82f6); }
        .podium-bar-2 { height: 72px; background: rgba(59,130,246,0.35); }
        .podium-bar-3 { height: 52px; background: rgba(59,130,246,0.2); }
        .podium-base {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 0 0 4px 4px;
        }

        /* Table */
        .cl-table-header {
          display: grid;
          grid-template-columns: 48px 1fr 80px 80px;
          gap: 8px;
          padding: 8px 16px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          margin-bottom: 6px;
        }
        .cl-row {
          display: grid;
          grid-template-columns: 48px 1fr 80px 80px;
          gap: 8px;
          align-items: center;
          padding: 14px 16px;
          background: #0c0c18;
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 14px;
          margin-bottom: 6px;
          transition: border-color 0.2s;
        }
        .cl-row:hover { border-color: rgba(59,130,246,0.2); }
        .cl-row.me {
          border-color: rgba(59,130,246,0.3);
          background: rgba(59,130,246,0.05);
        }
        .cl-rank {
          font-size: 14px; font-weight: 700;
          color: rgba(255,255,255,0.3); text-align: center;
        }
        .cl-row.me .cl-rank { color: #3b82f6; }
        .cl-player {
          display: flex; align-items: center; gap: 10px; min-width: 0;
        }
        .cl-player-avatar {
          width: 32px; height: 32px; border-radius: 999px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .cl-player-name {
          font-size: 14px; font-weight: 500; color: #e0e0e0;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .cl-player-name .you-badge {
          font-size: 9px; font-weight: 600; color: #3b82f6;
          background: rgba(59,130,246,0.12); border-radius: 4px;
          padding: 1px 5px; margin-left: 6px; letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .cl-habits {
          font-size: 13px; color: rgba(255,255,255,0.3); text-align: center;
        }
        .cl-pct {
          text-align: right;
        }
        .cl-pct-val {
          font-size: 16px; font-weight: 700; color: #3b82f6;
        }
        .cl-pct-bar {
          height: 3px; background: rgba(255,255,255,0.06);
          border-radius: 999px; margin-top: 3px; overflow: hidden;
        }
        .cl-pct-fill {
          height: 100%; background: #3b82f6; border-radius: 999px;
        }

        .cl-empty {
          text-align: center; padding: 60px 24px;
          color: rgba(255,255,255,0.2); font-size: 14px; line-height: 1.7;
        }
        .cl-no-session {
          text-align: center; padding: 80px 24px;
          color: rgba(255,255,255,0.3); font-size: 14px;
        }
        .cl-loading {
          display: flex; justify-content: center; padding: 60px;
          color: rgba(255,255,255,0.2); font-size: 14px;
        }
      `}</style>

      <Header />
      <div className="cl-page">
        <div className="cl-container">
          <div className="cl-eyebrow">Classement</div>
          <h1 className="cl-title">Top de la semaine</h1>
          <p className="cl-sub">
            Classement basé sur le taux de complétion des 7 derniers jours.
            Seuls les utilisateurs avec au moins une habitude apparaissent.
          </p>

          {!session ? (
            <div className="cl-no-session">Connecte-toi pour voir le classement.</div>
          ) : loading ? (
            <div className="cl-loading">Chargement…</div>
          ) : players.length === 0 ? (
            <div className="cl-empty">
              Aucun utilisateur dans le classement pour l&apos;instant.<br />
              Ajoute des habitudes pour apparaître ici !
            </div>
          ) : (
            <>
              {/* Ma position */}
              {me && (
                <div className="cl-my-card">
                  <div>
                    <div className="cl-my-rank">#{me.rank}</div>
                    <div className="cl-my-rank-label">Ta position</div>
                  </div>
                  <div className="cl-my-sep" />
                  <div className="cl-my-info">
                    <div className="cl-my-name">{me.name}</div>
                    <div className="cl-my-detail">
                      {me.habitCount} habitude{me.habitCount !== 1 ? "s" : ""} · {me.weekLogs} coches cette semaine
                    </div>
                  </div>
                  <div>
                    <div className="cl-my-pct">{me.weekPct}%</div>
                    <div className="cl-my-pct-label">cette semaine</div>
                  </div>
                </div>
              )}

              {/* Podium top 3 */}
              {players.length >= 3 && (
                <div className="cl-podium">
                  {/* 2nd */}
                  <div className="podium-slot">
                    <div className="podium-medal"><Medal size={22} style={{ color: "#94a3b8" }} /></div>
                    <div className="podium-avatar" style={{ background: "rgba(59,130,246,0.3)" }}>
                      {players[1].name[0].toUpperCase()}
                    </div>
                    <div className="podium-name">{players[1].name}</div>
                    <div className="podium-pct">{players[1].weekPct}%</div>
                    <div className="podium-bar podium-bar-2" />
                    <div className="podium-base" />
                  </div>
                  {/* 1st */}
                  <div className="podium-slot">
                    <div className="podium-medal"><Trophy size={28} style={{ color: "#facc15" }} /></div>
                    <div className="podium-avatar" style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)" }}>
                      {players[0].name[0].toUpperCase()}
                    </div>
                    <div className="podium-name" style={{ color: "#fff", fontWeight: 700 }}>{players[0].name}</div>
                    <div className="podium-pct" style={{ fontSize: 26 }}>{players[0].weekPct}%</div>
                    <div className="podium-bar podium-bar-1" />
                    <div className="podium-base" />
                  </div>
                  {/* 3rd */}
                  <div className="podium-slot">
                    <div className="podium-medal"><Award size={22} style={{ color: "#c2885a" }} /></div>
                    <div className="podium-avatar" style={{ background: "rgba(59,130,246,0.15)" }}>
                      {players[2].name[0].toUpperCase()}
                    </div>
                    <div className="podium-name">{players[2].name}</div>
                    <div className="podium-pct">{players[2].weekPct}%</div>
                    <div className="podium-bar podium-bar-3" />
                    <div className="podium-base" />
                  </div>
                </div>
              )}

              {/* Full table */}
              <div className="cl-table-header">
                <span style={{ textAlign: "center" }}>#</span>
                <span>Joueur</span>
                <span style={{ textAlign: "center" }}>Habitudes</span>
                <span style={{ textAlign: "right" }}>Score</span>
              </div>
              {players.map((p) => (
                <div key={p.id} className={`cl-row ${p.isMe ? "me" : ""}`}>
                  <div className="cl-rank">
                    {p.rank <= 3 ? MEDAL_ICONS[p.rank - 1] : p.rank}
                  </div>
                  <div className="cl-player">
                    <div className="cl-player-avatar">{p.name[0].toUpperCase()}</div>
                    <span className="cl-player-name">
                      {p.name}
                      {p.isMe && <span className="you-badge">Toi</span>}
                    </span>
                  </div>
                  <div className="cl-habits">{p.habitCount}</div>
                  <div className="cl-pct">
                    <div className="cl-pct-val">{p.weekPct}%</div>
                    <div className="cl-pct-bar">
                      <div className="cl-pct-fill" style={{ width: `${p.weekPct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
