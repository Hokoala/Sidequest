import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { headers } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const { date } = await req.json();
  const targetDate = date ?? new Date().toISOString().split("T")[0];

  // Check if already logged
  const { rows } = await pool.query(
    `SELECT id FROM habit_log WHERE "habitId" = $1 AND date = $2`,
    [id, targetDate]
  );

  if (rows.length > 0) {
    // Already done → uncheck
    await pool.query(`DELETE FROM habit_log WHERE "habitId" = $1 AND date = $2`, [id, targetDate]);
    return NextResponse.json({ completed: false });
  } else {
    // Not done → check
    await pool.query(
      `INSERT INTO habit_log (id, "habitId", "userId", date) VALUES ($1, $2, $3, $4)`,
      [crypto.randomUUID(), id, session.user.id, targetDate]
    );
    return NextResponse.json({ completed: true });
  }
}
