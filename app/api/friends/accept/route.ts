import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { code } = await req.json();

  const { rows } = await pool.query(
    `SELECT * FROM friend_invite WHERE code = $1 AND "usedByUserId" IS NULL`,
    [code]
  );
  if (!rows.length) return NextResponse.json({ error: "Lien invalide ou déjà utilisé" }, { status: 400 });

  const invite = rows[0];
  if (invite.fromUserId === session.user.id)
    return NextResponse.json({ error: "Impossible de s'ajouter soi-même" }, { status: 400 });

  // Create friendship (both ways)
  const id1 = crypto.randomUUID();
  const id2 = crypto.randomUUID();
  await pool.query(
    `INSERT INTO friendship (id, "userId", "friendId") VALUES ($1,$2,$3),($4,$5,$6)
     ON CONFLICT DO NOTHING`,
    [id1, session.user.id, invite.fromUserId, id2, invite.fromUserId, session.user.id]
  );

  // Mark invite as used
  await pool.query(
    `UPDATE friend_invite SET "usedByUserId" = $1 WHERE code = $2`,
    [session.user.id, code]
  );

  return NextResponse.json({ success: true });
}
