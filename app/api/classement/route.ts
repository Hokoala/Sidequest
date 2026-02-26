import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { rows } = await pool.query(
    `SELECT
       u.id,
       u.name,
       COUNT(DISTINCT h.id)  AS "habitCount",
       COUNT(DISTINCT hl.id) AS "weekLogs",
       GREATEST(COUNT(DISTINCT h.id)::int * 7, 1) AS "weekPossible",
       ROUND(
         COUNT(DISTINCT hl.id)::numeric /
         GREATEST(COUNT(DISTINCT h.id) * 7, 1) * 100
       ) AS "weekPct"
     FROM "user" u
     LEFT JOIN habit h ON h."userId" = u.id
     LEFT JOIN habit_log hl
       ON hl."habitId" = h.id
       AND hl.date >= CURRENT_DATE - INTERVAL '6 days'
     GROUP BY u.id, u.name
     HAVING COUNT(DISTINCT h.id) > 0
     ORDER BY "weekPct" DESC, "weekLogs" DESC
     LIMIT 50`
  );

  const currentUserId = session.user.id;

  return NextResponse.json(
    rows.map((r, i) => ({
      rank: i + 1,
      id: r.id,
      name: r.name || "Anonyme",
      habitCount: parseInt(r.habitCount),
      weekPct: parseInt(r.weekPct),
      weekLogs: parseInt(r.weekLogs),
      isMe: r.id === currentUserId,
    }))
  );
}
