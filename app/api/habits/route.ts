import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const date = req.nextUrl.searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  const { rows } = await pool.query(
    `SELECT
       h.id, h.name, h.emoji,
       EXISTS(
         SELECT 1 FROM habit_log hl
         WHERE hl."habitId" = h.id AND hl.date = $2
       ) AS "completedToday",
       (SELECT COUNT(*) FROM habit_log hl2 WHERE hl2."habitId" = h.id) AS "totalLogs"
     FROM habit h
     WHERE h."userId" = $1
     ORDER BY h."createdAt" ASC`,
    [session.user.id, date]
  );

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { name, emoji } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Nom requis" }, { status: 400 });

  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO habit (id, "userId", name, emoji) VALUES ($1, $2, $3, $4)`,
    [id, session.user.id, name.trim(), emoji || "🎯"]
  );

  return NextResponse.json({ id, name, emoji: emoji || "🎯" }, { status: 201 });
}
