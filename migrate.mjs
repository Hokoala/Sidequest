import { Pool } from "pg";
import * as dotenv from "fs";

// Read .env.local manually
const envContent = dotenv.readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

// Parse DATABASE_URL manuellement pour éviter les problèmes d'encodage
const dbUrl = new URL(env.DATABASE_URL);
const pool = new Pool({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port),
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 10000,
});

const sql = `
CREATE TABLE IF NOT EXISTS "user" (
  "id"            TEXT        NOT NULL PRIMARY KEY,
  "name"          TEXT        NOT NULL,
  "email"         TEXT        NOT NULL UNIQUE,
  "emailVerified" BOOLEAN     NOT NULL DEFAULT false,
  "image"         TEXT,
  "createdAt"     TIMESTAMP   NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
  "id"          TEXT        NOT NULL PRIMARY KEY,
  "expiresAt"   TIMESTAMP   NOT NULL,
  "token"       TEXT        NOT NULL UNIQUE,
  "createdAt"   TIMESTAMP   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMP   NOT NULL DEFAULT NOW(),
  "ipAddress"   TEXT,
  "userAgent"   TEXT,
  "userId"      TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id"                    TEXT        NOT NULL PRIMARY KEY,
  "accountId"             TEXT        NOT NULL,
  "providerId"            TEXT        NOT NULL,
  "userId"                TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken"           TEXT,
  "refreshToken"          TEXT,
  "idToken"               TEXT,
  "accessTokenExpiresAt"  TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  "scope"                 TEXT,
  "password"              TEXT,
  "createdAt"             TIMESTAMP   NOT NULL DEFAULT NOW(),
  "updatedAt"             TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id"          TEXT        NOT NULL PRIMARY KEY,
  "identifier"  TEXT        NOT NULL,
  "value"       TEXT        NOT NULL,
  "expiresAt"   TIMESTAMP   NOT NULL,
  "createdAt"   TIMESTAMP,
  "updatedAt"   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "habit" (
  "id"          TEXT        NOT NULL PRIMARY KEY,
  "userId"      TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "name"        TEXT        NOT NULL,
  "emoji"       TEXT        NOT NULL DEFAULT '🎯',
  "createdAt"   TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "habit_log" (
  "id"          TEXT        NOT NULL PRIMARY KEY,
  "habitId"     TEXT        NOT NULL REFERENCES "habit"("id") ON DELETE CASCADE,
  "userId"      TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "date"        DATE        NOT NULL,
  "createdAt"   TIMESTAMP   NOT NULL DEFAULT NOW(),
  UNIQUE("habitId", "date")
);

CREATE TABLE IF NOT EXISTS "friend_invite" (
  "id"          TEXT        NOT NULL PRIMARY KEY,
  "fromUserId"  TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "code"        TEXT        NOT NULL UNIQUE,
  "usedByUserId" TEXT       REFERENCES "user"("id") ON DELETE SET NULL,
  "createdAt"   TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "friendship" (
  "id"          TEXT        NOT NULL PRIMARY KEY,
  "userId"      TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "friendId"    TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "createdAt"   TIMESTAMP   NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "friendId")
);
`;

try {
  await pool.query(sql);
  console.log("✅ Migration réussie — tables créées !");
} catch (err) {
  console.error("❌ Erreur :", err.message);
} finally {
  await pool.end();
}
