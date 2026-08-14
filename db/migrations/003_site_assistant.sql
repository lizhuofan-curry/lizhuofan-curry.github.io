begin;

create table if not exists assistant_messages (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  visitor_hash text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 2000),
  token_count integer not null default 0 check (token_count >= 0),
  created_at timestamptz not null default now()
);
create index if not exists assistant_messages_visitor_created_idx on assistant_messages (visitor_hash, created_at desc);
create index if not exists assistant_messages_session_idx on assistant_messages (session_id, created_at desc);
alter table assistant_messages enable row level security;
revoke all on table assistant_messages from anon, authenticated;
commit;
