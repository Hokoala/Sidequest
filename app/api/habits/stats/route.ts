import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id;

  // Total habits
  const { rows: habitRows } = await pool.query(
    `SELECT id FROM habit WHERE "userId" = $1`,
    [userId]
  );
  const total = habitRows.length;

  // Completions per day for last 30 days
  const { rows: logRows } = await pool.query(
    `SELECT date::text, COUNT(DISTINCT "habitId") AS completed
     FROM habit_log
     WHERE "userId" = $1 AND date >= CURRENT_DATE - INTERVAL '29 days'
     GROUP BY date
     ORDER BY date ASC`,
    [userId]
  );

  // Build last 30 days array
  const days = [];
  const FR_DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const log = logRows.find((r) => r.date === dateStr);
    const completed = log ? parseInt(log.completed) : 0;
    days.push({
      date: dateStr,
      label: FR_DAYS[d.getDay()],
      completed,
      total,
      pct: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  }

  return NextResponse.json(days);
}
