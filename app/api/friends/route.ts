import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { rows } = await pool.query(
    `SELECT u.id, u.name, u.email,
       (SELECT COUNT(*) FROM habit WHERE "userId" = u.id) AS "habitCount",
       (SELECT COUNT(*) FROM habit_log hl
        JOIN habit h ON h.id = hl."habitId"
        WHERE h."userId" = u.id AND hl.date >= CURRENT_DATE - INTERVAL '6 days') AS "weekLogs",
       (SELECT COUNT(*) * 7 FROM habit WHERE "userId" = u.id) AS "weekPossible"
     FROM friendship f
     JOIN "user" u ON u.id = f."friendId"
     WHERE f."userId" = $1
     ORDER BY u.name ASC`,
    [session.user.id]
  );

  return NextResponse.json(
    rows.map((r) => ({
      ...r,
      weekPct: r.weekpossible > 0
        ? Math.round((parseInt(r.weeklogs) / parseInt(r.weekpossible)) * 100)
        : 0,
    }))
  );
}
