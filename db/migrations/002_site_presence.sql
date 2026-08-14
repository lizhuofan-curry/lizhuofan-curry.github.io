begin;

-- A short-lived, anonymous heartbeat for the homepage's online indicator.
-- The application receives only an HMAC digest, never the browser identifier.
create table if not exists site_presence (
  session_hash text primary key,
  last_seen_at timestamptz not null default now()
);

create index if not exists site_presence_last_seen_at_idx on site_presence (last_seen_at);

alter table site_presence enable row level security;
revoke all on table site_presence from anon, authenticated;

commit;
