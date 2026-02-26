"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useSession } from "@/lib/auth-client";
import { CalendarDays, Flame, Target, TrendingUp, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";

interface DayData {
  date: string;
  completed: number;
  total: number;
  pct: number;
}

function computeStreak(days: DayData[]): number {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].total > 0 && days[i].pct === 100) streak++;
    else break;
  }
  return streak;
}

function computeBestStreak(days: DayData[]): number {
  let best = 0, cur = 0;
  for (const d of days) {
    if (d.total > 0 && d.pct === 100) { cur++; best = Math.max(best, cur); }
    else cur = 0;
  }
  return best;
}

function computeWeekPct(days: DayData[]): number {
  const last7 = days.slice(-7);
  if (!last7.length) return 0;
  const avg = last7.reduce((s, d) => s + d.pct, 0) / last7.length;
  return Math.round(avg);
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [days, setDays] = useState<DayData[]>([]);
  const [habitCount, setHabitCount] = useState(0);

  useEffect(() => {
    if (!isPending && !session) router.push("/");
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/habits/stats")
      .then((r) => r.json())
      .then((data: DayData[]) => {
        setDays(data);
        setHabitCount(data[data.length - 1]?.total ?? 0);
      });
  }, [session]);

  if (isPending || !session) return null;

  const streak = computeStreak(days);
  const bestStreak = computeBestStreak(days);
  const weekPct = computeWeekPct(days);
  const initial = (session.user.name || session.user.email || "?")[0].toUpperCase();
  const joinDate = new Date(session.user.createdAt ?? Date.now()).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const STATS = [
    { icon: Target,       label: "Habitudes actives",   value: habitCount },
    { icon: TrendingUp,   label: "Score cette semaine",  value: `${weekPct}%` },
    { icon: Flame,        label: "Série en cours",       value: `${streak}j` },
    { icon: CalendarDays, label: "Meilleure série",      value: `${bestStreak}j` },
  ];

  return (
    <>
      <style>{`
        .profile-page {
          min-height: 100vh;
          background: #06060f;
          font-family: 'DM Sans', sans-serif;
          color: #f0f0f0;
          padding-top: 80px;
        }
        .profile-inner {
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* ── Card ── */
        .profile-card {
          background: #0c0c1c;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 36px;
          margin-bottom: 20px;
        }

        /* ── Avatar row ── */
        .profile-avatar-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .profile-avatar {
          width: 72px; height: 72px; border-radius: 999px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; font-weight: 700; color: #fff;
          flex-shrink: 0;
        }
        .profile-meta { flex: 1; min-width: 0; }
        .profile-name {
          font-size: 22px; font-weight: 700; color: #f0f0f0;
          letter-spacing: -0.02em; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .profile-email {
          font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 6px;
        }
        .profile-since {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.2);
        }
        .profile-since span { color: #3b82f6; }

        /* ── Stats grid ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (max-width: 600px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        .stat-card {
          background: #0c0c1c;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px 16px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .stat-card-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #3b82f6;
        }
        .stat-card-value {
          font-size: 26px; font-weight: 700; color: #f0f0f0;
          letter-spacing: -0.03em; line-height: 1;
        }
        .stat-card-label {
          font-size: 11px; color: rgba(255,255,255,0.35); line-height: 1.4;
        }

        /* ── Activity grid ── */
        .activity-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
          margin-bottom: 14px;
        }
        .activity-grid {
          display: flex; gap: 4px; flex-wrap: wrap;
        }
        .activity-cell {
          width: 18px; height: 18px; border-radius: 4px;
          flex-shrink: 0;
        }
        .activity-legend {
          display: flex; align-items: center; gap: 6px;
          margin-top: 10px;
          font-size: 10px; color: rgba(255,255,255,0.25);
        }
        .activity-legend-cell { width: 12px; height: 12px; border-radius: 3px; }

        /* ── Signout ── */
        .profile-signout-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; background: none;
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 999px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: #f87171; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          margin-top: 8px;
        }
        .profile-signout-btn:hover { background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.4); }
      `}</style>

      <Header />
      <div className="profile-page">
        <div className="profile-inner">

          {/* ── Identity card ── */}
          <div className="profile-card">
            <div className="profile-avatar-row">
              <div className="profile-avatar">{initial}</div>
              <div className="profile-meta">
                <div className="profile-name">{session.user.name || "Utilisateur"}</div>
                <div className="profile-email">{session.user.email}</div>
                <div className="profile-since">
                  Membre depuis <span>{joinDate}</span>
                </div>
              </div>
            </div>
            <button className="profile-signout-btn" onClick={() => { signOut(); router.push("/"); }}>
              <LogOut size={14} /> Déconnexion
            </button>
          </div>

          {/* ── Stats ── */}
          <div className="stats-grid">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div className="stat-card" key={label}>
                <div className="stat-card-icon"><Icon size={16} /></div>
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-label">{label}</div>
              </div>
            ))}
          </div>

          {/* ── 30-day activity ── */}
          <div className="profile-card">
            <div className="activity-label">Activité — 30 derniers jours</div>
            <div className="activity-grid">
              {days.map((d) => {
                const bg =
                  d.total === 0  ? "rgba(255,255,255,0.04)"
                  : d.pct === 100 ? "rgba(59,130,246,0.8)"
                  : d.pct >= 60   ? "rgba(59,130,246,0.45)"
                  : d.pct >= 30   ? "rgba(59,130,246,0.22)"
                  :                  "rgba(59,130,246,0.08)";
                return (
                  <div
                    key={d.date}
                    className="activity-cell"
                    title={`${d.date} — ${d.pct}%`}
                    style={{ background: bg }}
                  />
                );
              })}
            </div>
            <div className="activity-legend">
              <span>Moins</span>
              {["rgba(59,130,246,0.08)","rgba(59,130,246,0.22)","rgba(59,130,246,0.45)","rgba(59,130,246,0.8)"].map((c, i) => (
                <div key={i} className="activity-legend-cell" style={{ background: c }} />
              ))}
              <span>Plus</span>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
