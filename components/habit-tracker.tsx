"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";

interface Habit {
  id: string;
  name: string;
  emoji: string;
  completedToday: boolean;
  totalLogs: number;
}

interface ChartDay {
  date: string;
  label: string;
  completed: number;
  total: number;
  pct: number;
}

const EMOJIS = ["🎯", "🏃", "💪", "📚", "🧘", "💧", "🥗", "😴", "✍️", "🎸", "🧠", "🌅", "🚀", "🏋️", "🎨"];

export default function HabitTracker() {
  const { data: session } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [chart, setChart] = useState<ChartDay[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎯");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [today] = useState(() => new Date().toLocaleDateString("en-CA"));

  const load = useCallback(async () => {
    const [hRes, sRes] = await Promise.all([
      fetch(`/api/habits?date=${today}`),
      fetch("/api/habits/stats"),
    ]);
    setHabits(await hRes.json());
    setChart(await sRes.json());
  }, [today]);

  useEffect(() => {
    if (session) load();
  }, [session, load]);

  const toggle = async (id: string) => {
    setHabits((p) => p.map((h) => h.id === id ? { ...h, completedToday: !h.completedToday } : h));
    await fetch(`/api/habits/${id}/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today }),
    });
    load();
  };

  const addHabit = async () => {
    if (!newName.trim()) return;
    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), emoji: newEmoji }),
    });
    setNewName("");
    load();
  };

  const deleteHabit = async (id: string) => {
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
    load();
  };

  const completed = habits.filter((h) => h.completedToday).length;
  const total = habits.length;
  const todayPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference - (circumference * todayPct) / 100;

  // Chart — last 14 days
  const chartSlice = chart.slice(-14);

  // Monthly calendar
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // First day of month: 0=Sun → adjust to Mon-first
  const firstDow = new Date(year, month, 1).getDay();
  const startOffset = (firstDow + 6) % 7; // Mon=0 … Sun=6

  const monthCells: { day: number | null; pct: number; dateStr: string }[] = [];
  for (let i = 0; i < startOffset; i++) monthCells.push({ day: null, pct: 0, dateStr: "" });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const found = chart.find((c) => c.date === dateStr);
    monthCells.push({ day: d, pct: found?.pct ?? 0, dateStr });
  }

  const FR_DOW = ["L", "M", "M", "J", "V", "S", "D"];

  if (!session) {
    return (
      <div className="ht-gate">
        <p>Connectez-vous pour accéder à votre tracker</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .ht-page {
          min-height: 100vh;
          background: #06060f;
          padding: 72px 24px 48px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Bento grid ── */
        .bento {
          max-width: 1600px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 400px 360px;
          grid-template-rows: auto auto;
          gap: 16px;
        }

        .bento-cell {
          background: #0c0c18;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px;
          padding: 32px;
          overflow: hidden;
        }

        .cell-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 16px;
        }

        /* ── TOP: chart ── */
        .bento-top {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .chart-title {
          font-size: 20px;
          font-weight: 700;
          color: #f0f0f0;
          letter-spacing: -0.01em;
        }
        .chart-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          margin-top: 3px;
        }
        .chart-today-badge {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ring-wrap {
          position: relative;
          width: 68px;
          height: 68px;
          flex-shrink: 0;
        }
        .ring-svg { transform: rotate(-90deg); }
        .ring-bg { fill: none; stroke: rgba(59,130,246,0.1); }
        .ring-fill {
          fill: none;
          stroke: #3b82f6;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.6s cubic-bezier(0.23,1,0.32,1);
        }
        .ring-label {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #f0f0f0;
        }
        .chart-bars {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 140px;
          padding-bottom: 28px;
          position: relative;
        }
        .chart-bars::after {
          content: '';
          position: absolute;
          bottom: 24px; left: 0; right: 0;
          height: 1px;
          background: rgba(255,255,255,0.04);
        }
        .bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
          position: relative;
          cursor: pointer;
        }
        .bar-fill {
          width: 100%;
          border-radius: 5px 5px 0 0;
          min-height: 3px;
          transition: opacity 0.15s;
        }
        .bar-fill:hover { opacity: 0.8; }
        .bar-day {
          font-size: 9px;
          color: rgba(255,255,255,0.2);
          font-weight: 500;
          position: absolute;
          bottom: -18px;
          white-space: nowrap;
        }
        .bar-tip {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a2e;
          border: 1px solid rgba(59,130,246,0.3);
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 10px;
          color: #e0e0e0;
          white-space: nowrap;
          z-index: 10;
          pointer-events: none;
        }

        /* ── LEFT: habits ── */
        .habits-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .habits-date {
          font-size: 12px;
          color: #3b82f6;
          font-weight: 500;
        }
        .habits-progress {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
        }
        .habits-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
          max-height: 480px;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .habits-list::-webkit-scrollbar { display: none; }

        .habit-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 14px;
          transition: border-color 0.2s, background 0.2s;
          cursor: pointer;
        }
        .habit-row:hover { border-color: rgba(59,130,246,0.2); }
        .habit-row.done {
          background: rgba(59,130,246,0.06);
          border-color: rgba(59,130,246,0.2);
        }

        .habit-check {
          width: 26px; height: 26px;
          border-radius: 999px;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.2s, background 0.2s;
        }
        .habit-row.done .habit-check {
          border-color: #3b82f6;
          background: #3b82f6;
        }
        .check-icon { display: none; }
        .habit-row.done .check-icon { display: block; }

        .habit-emoji { font-size: 20px; flex-shrink: 0; }
        .habit-name {
          flex: 1;
          font-size: 15px;
          font-weight: 500;
          color: #d0d0d0;
          transition: color 0.2s;
        }
        .habit-row.done .habit-name {
          color: rgba(255,255,255,0.3);
          text-decoration: line-through;
          text-decoration-color: rgba(255,255,255,0.15);
        }
        .habit-del {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.15); font-size: 14px;
          width: 22px; height: 22px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .habit-del:hover { background: rgba(248,113,113,0.12); color: #f87171; }

        .habits-empty {
          text-align: center;
          padding: 32px 0;
          font-size: 13px;
          color: rgba(255,255,255,0.15);
        }

        /* ── MIDDLE: add ── */
        .add-title {
          font-size: 20px;
          font-weight: 700;
          color: #f0f0f0;
          letter-spacing: -0.01em;
          margin-bottom: 4px;
        }
        .add-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 20px;
        }
        .add-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          color: #f0f0f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 14px;
        }
        .add-input::placeholder { color: rgba(255,255,255,0.2); }
        .add-input:focus { border-color: #3b82f6; }

        .emoji-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 10px;
        }
        .emoji-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }
        .emoji-btn {
          aspect-ratio: 1;
          border-radius: 12px;
          border: 1.5px solid transparent;
          background: rgba(255,255,255,0.04);
          font-size: 22px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .emoji-btn:hover { background: rgba(59,130,246,0.1); }
        .emoji-btn.sel { border-color: #3b82f6; background: rgba(59,130,246,0.15); }

        .add-btn-submit {
          width: 100%;
          padding: 12px;
          background: #3b82f6;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
        }
        .add-btn-submit:hover { background: #2563eb; }
        .add-btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        .add-stats {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-around;
        }
        .add-stat {
          text-align: center;
        }
        .add-stat-val {
          font-size: 28px;
          font-weight: 700;
          color: #3b82f6;
          letter-spacing: -0.02em;
        }
        .add-stat-lbl {
          font-size: 10px;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 2px;
        }

        /* ── RIGHT: monthly history ── */
        .month-title {
          font-size: 20px;
          font-weight: 700;
          color: #f0f0f0;
          letter-spacing: -0.01em;
          margin-bottom: 16px;
          text-transform: capitalize;
        }
        .month-dow {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 6px;
        }
        .month-dow span {
          text-align: center;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.2);
        }
        .month-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }
        .month-day {
          aspect-ratio: 1;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 500;
          position: relative;
          transition: transform 0.15s;
        }
        .month-day:hover { transform: scale(1.15); }
        .month-day.empty { background: transparent; }
        .month-day.future {
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.15);
        }
        .month-day.past-zero {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.2);
        }
        .month-day.past-low {
          background: rgba(59,130,246,0.15);
          color: rgba(255,255,255,0.5);
        }
        .month-day.past-mid {
          background: rgba(59,130,246,0.35);
          color: rgba(255,255,255,0.8);
        }
        .month-day.past-high {
          background: rgba(59,130,246,0.65);
          color: #fff;
        }
        .month-day.past-full {
          background: #3b82f6;
          color: #fff;
          font-weight: 700;
        }
        .month-day.is-today {
          outline: 2px solid #3b82f6;
          outline-offset: 1px;
        }

        .month-legend {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 14px;
          justify-content: flex-end;
        }
        .legend-label { font-size: 9px; color: rgba(255,255,255,0.2); }
        .legend-dot {
          width: 10px; height: 10px; border-radius: 3px;
        }

        /* ── Gate ── */
        .ht-gate {
          min-height: 100vh;
          background: #06060f;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
        }
      `}</style>

      <div className="ht-page">
        <div className="bento">

          {/* ── TOP: Graphique ─────────────────────────────── */}
          <div className="bento-cell bento-top">
            <div className="chart-header">
              <div>
                <div className="chart-title">Progression des 14 derniers jours</div>
                <div className="chart-sub">
                  {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
              <div className="chart-today-badge">
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f0f0" }}>
                    {completed}/{total} aujourd&apos;hui
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                    {todayPct}% complété
                  </div>
                </div>
                <div className="ring-wrap">
                  <svg className="ring-svg" width="68" height="68" viewBox="0 0 68 68">
                    <circle className="ring-bg" cx="34" cy="34" r="28" strokeWidth="5" />
                    <circle
                      className="ring-fill"
                      cx="34" cy="34" r="28"
                      strokeWidth="5"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                    />
                  </svg>
                  <div className="ring-label">{todayPct}%</div>
                </div>
              </div>
            </div>

            <div className="chart-bars">
              {chartSlice.map((day, i) => {
                const isToday = day.date === today;
                const bg = day.pct === 100
                  ? "#3b82f6"
                  : day.pct > 60 ? "rgba(59,130,246,0.55)"
                  : day.pct > 30 ? "rgba(59,130,246,0.3)"
                  : day.pct > 0  ? "rgba(59,130,246,0.15)"
                  : "rgba(255,255,255,0.04)";
                return (
                  <div
                    key={day.date}
                    className="bar-col"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === i && day.total > 0 && (
                      <div className="bar-tip">{day.completed}/{day.total} • {day.pct}%</div>
                    )}
                    <div
                      className="bar-fill"
                      style={{
                        height: `${Math.max(day.pct, 4)}%`,
                        background: bg,
                        outline: isToday ? "2px solid #3b82f6" : "none",
                        outlineOffset: 2,
                      }}
                    />
                    {(i % 2 === 0 || isToday) && (
                      <span className="bar-day" style={{ color: isToday ? "#3b82f6" : undefined }}>
                        {isToday ? "auj." : day.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── LEFT: Habitudes à cocher ──────────────────── */}
          <div className="bento-cell">
            <div className="cell-label">Habitudes du jour</div>
            <div className="habits-header">
              <span className="habits-date">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" })}
              </span>
              <span className="habits-progress">{completed}/{total}</span>
            </div>

            <div className="habits-list">
              {habits.length === 0 && (
                <div className="habits-empty">Aucune habitude pour l&apos;instant</div>
              )}
              {habits.map((h) => (
                <div
                  key={h.id}
                  className={`habit-row ${h.completedToday ? "done" : ""}`}
                  onClick={() => toggle(h.id)}
                >
                  <button className="habit-check" onClick={(e) => { e.stopPropagation(); toggle(h.id); }}>
                    <svg className="check-icon" width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <span className="habit-emoji">{h.emoji}</span>
                  <span className="habit-name">{h.name}</span>
                  <button
                    className="habit-del"
                    onClick={(e) => { e.stopPropagation(); deleteHabit(h.id); }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── MIDDLE: Ajouter ───────────────────────────── */}
          <div className="bento-cell">
            <div className="add-title">Nouvelle habitude</div>
            <div className="add-sub">Ajoute une habitude quotidienne</div>

            <input
              className="add-input"
              placeholder="Ex: Méditer 10 min…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
            />

            <div className="emoji-label">Icône</div>
            <div className="emoji-grid">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  className={`emoji-btn ${newEmoji === em ? "sel" : ""}`}
                  onClick={() => setNewEmoji(em)}
                >
                  {em}
                </button>
              ))}
            </div>

            <button
              className="add-btn-submit"
              onClick={addHabit}
              disabled={!newName.trim()}
            >
              Ajouter
            </button>

            <div className="add-stats">
              <div className="add-stat">
                <div className="add-stat-val">{total}</div>
                <div className="add-stat-lbl">Habitudes</div>
              </div>
              <div className="add-stat">
                <div className="add-stat-val">{todayPct}%</div>
                <div className="add-stat-lbl">Aujourd&apos;hui</div>
              </div>
              <div className="add-stat">
                <div className="add-stat-val">
                  {chart.filter((d) => d.pct === 100).length}
                </div>
                <div className="add-stat-lbl">Jours parfaits</div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Historique du mois ─────────────────── */}
          <div className="bento-cell">
            <div className="cell-label">Historique du mois</div>
            <div className="month-title">{monthName}</div>

            <div className="month-dow">
              {FR_DOW.map((d, i) => <span key={i}>{d}</span>)}
            </div>

            <div className="month-grid">
              {monthCells.map((cell, i) => {
                if (!cell.day) return <div key={i} className="month-day empty" />;

                const dateStr = cell.dateStr;
                const isToday = dateStr === today;
                const isFuture = dateStr > today;

                let cls = "month-day ";
                if (isFuture) cls += "future";
                else if (cell.pct === 0 && total === 0) cls += "future";
                else if (cell.pct === 0) cls += "past-zero";
                else if (cell.pct <= 25) cls += "past-low";
                else if (cell.pct <= 60) cls += "past-mid";
                else if (cell.pct <= 99) cls += "past-high";
                else cls += "past-full";

                if (isToday) cls += " is-today";

                return (
                  <div key={i} className={cls} title={isFuture ? "" : `${cell.pct}%`}>
                    {cell.day}
                  </div>
                );
              })}
            </div>

            <div className="month-legend">
              <span className="legend-label">0%</span>
              {["rgba(255,255,255,0.04)", "rgba(59,130,246,0.15)", "rgba(59,130,246,0.35)", "rgba(59,130,246,0.65)", "#3b82f6"].map((c, i) => (
                <div key={i} className="legend-dot" style={{ background: c }} />
              ))}
              <span className="legend-label">100%</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
