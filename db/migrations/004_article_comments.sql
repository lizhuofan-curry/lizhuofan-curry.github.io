begin;

create table if not exists article_comments (
  id bigint generated always as identity primary key,
  article_id bigint not null references articles(id) on delete cascade,
  author_id text references "user"(id) on delete set null,
  author_name text not null check (char_length(author_name) between 1 and 80),
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by text references "user"(id) on delete set null
);

create index if not exists article_comments_public_article_created_idx
  on article_comments (article_id, created_at, id) where deleted_at is null;
create index if not exists article_comments_author_created_idx
  on article_comments (author_id, created_at desc);

create table if not exists comment_rate_limits (
  user_id text primary key references "user"(id) on delete cascade,
  last_submitted_at timestamptz not null default now()
);

alter table article_comments enable row level security;
alter table comment_rate_limits enable row level security;

revoke all on table article_comments, comment_rate_limits from anon, authenticated;
revoke all on sequence article_comments_id_seq from anon, authenticated;

commit;
