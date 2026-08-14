import { createHmac } from "node:crypto";
import { isDatabaseConfigured, query } from "./db";

const ACTIVE_WINDOW_SECONDS = 90;
const RETENTION_HOURS = 24;

function presenceSecret() {
  // VIEW_HASH_SECRET already exists in every deployed environment. A dedicated
  // secret can be supplied later without forcing an immediate reconfiguration.
  return process.env.PRESENCE_HASH_SECRET || process.env.VIEW_HASH_SECRET;
}

export function isPresenceConfigured() {
  return isDatabaseConfigured() && Boolean(presenceSecret());
}

export function hashPresenceSession(sessionId) {
  return createHmac("sha256", presenceSecret()).update(sessionId).digest("hex");
}

export async function recordPresence(sessionHash) {
  if (!isPresenceConfigured()) return { onlineCount: 0, configured: false };

  const { rows } = await query(`
    with heartbeat as (
      insert into site_presence (session_hash, last_seen_at)
      values ($1, now())
      on conflict (session_hash) do update set last_seen_at = excluded.last_seen_at
    ),
    expired as (
      delete from site_presence
      where last_seen_at < now() - make_interval(hours => $2::int)
    )
    select count(*)::int as online_count
    from site_presence
    where last_seen_at >= now() - make_interval(secs => $3::int)
  `, [sessionHash, RETENTION_HOURS, ACTIVE_WINDOW_SECONDS]);

  return { onlineCount: Number(rows[0]?.online_count || 0), configured: true };
}
