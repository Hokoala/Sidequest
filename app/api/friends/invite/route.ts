import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { headers } from "next/headers";

// GET — fetch invite info by code (public)
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Code manquant" }, { status: 400 });

  const { rows } = await pool.query(
    `SELECT fi.id, fi.code, fi."usedByUserId", u.name AS "fromName"
     FROM friend_invite fi
     JOIN "user" u ON u.id = fi."fromUserId"
     WHERE fi.code = $1`,
    [code]
  );
  if (!rows.length) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });

  return NextResponse.json(rows[0]);
}

// POST — create invite link
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Check if already has a pending invite
  const { rows: existing } = await pool.query(
    `SELECT code FROM friend_invite WHERE "fromUserId" = $1 AND "usedByUserId" IS NULL ORDER BY "createdAt" DESC LIMIT 1`,
    [session.user.id]
  );
  if (existing.length) return NextResponse.json({ code: existing[0].code });

  const code = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  await pool.query(
    `INSERT INTO friend_invite (id, "fromUserId", code) VALUES ($1, $2, $3)`,
    [crypto.randomUUID(), session.user.id, code]
  );
  return NextResponse.json({ code });
}
