begin;

create table if not exists "user" (
  id text primary key,
  name text not null,
  email text not null unique,
  "emailVerified" boolean not null default false,
  image text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists session (
  id text primary key,
  "userId" text not null references "user"(id) on delete cascade,
  token text not null unique,
  "expiresAt" timestamptz not null,
  "ipAddress" text,
  "userAgent" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists session_user_id_idx on session ("userId");
create index if not exists session_expires_at_idx on session ("expiresAt");

create table if not exists account (
  id text primary key,
  "userId" text not null references "user"(id) on delete cascade,
  "accountId" text not null,
  "providerId" text not null,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  scope text,
  password text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("providerId", "accountId")
);

create index if not exists account_user_id_idx on account ("userId");

create table if not exists verification (
  id text primary key,
  identifier text not null,
  value text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists verification_identifier_idx on verification (identifier);

create table if not exists profiles (
  user_id text primary key references "user"(id) on delete cascade,
  role text not null default 'reader' check (role in ('reader', 'admin')),
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists articles (
  id bigint generated always as identity primary key,
  slug text not null unique,
  author_id text references "user"(id) on delete set null,
  draft_revision_id bigint,
  published_revision_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_author_id_idx on articles (author_id);

create table if not exists article_revisions (
  id bigint generated always as identity primary key,
  article_id bigint not null references articles(id) on delete cascade,
  title text not null,
  description text not null,
  body_markdown text not null,
  cover_url text,
  tags text[] not null default '{}',
  category text not null,
  reading_time_minutes integer not null default 1 check (reading_time_minutes > 0),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by text references "user"(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists article_revisions_article_id_idx on article_revisions (article_id);
create index if not exists article_revisions_status_published_idx
  on article_revisions (status, published_at desc) where status = 'published';

alter table articles drop constraint if exists articles_draft_revision_id_fkey;
alter table articles add constraint articles_draft_revision_id_fkey
  foreign key (draft_revision_id) references article_revisions(id) on delete set null;
alter table articles drop constraint if exists articles_published_revision_id_fkey;
alter table articles add constraint articles_published_revision_id_fkey
  foreign key (published_revision_id) references article_revisions(id) on delete set null;

create table if not exists article_views (
  article_id bigint not null references articles(id) on delete cascade,
  session_hash text not null,
  first_seen_at timestamptz not null default now(),
  primary key (article_id, session_hash)
);

create table if not exists article_likes (
  article_id bigint not null references articles(id) on delete cascade,
  user_id text not null references "user"(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (article_id, user_id)
);

create index if not exists article_likes_user_id_idx on article_likes (user_id);

create table if not exists media_assets (
  id bigint generated always as identity primary key,
  storage_key text not null unique,
  public_url text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 5242880),
  uploader_id text references "user"(id) on delete set null,
  created_at timestamptz not null default now()
);

-- All browser-facing access goes through the Next.js server. Keep the public
-- Supabase Data API closed: no anon/authenticated grants and no RLS policies.
alter table "user" enable row level security;
alter table session enable row level security;
alter table account enable row level security;
alter table verification enable row level security;
alter table profiles enable row level security;
alter table articles enable row level security;
alter table article_revisions enable row level security;
alter table article_views enable row level security;
alter table article_likes enable row level security;
alter table media_assets enable row level security;

revoke all on table "user", session, account, verification, profiles,
  articles, article_revisions, article_views, article_likes, media_assets
  from anon, authenticated;
revoke all on sequence articles_id_seq, article_revisions_id_seq, media_assets_id_seq
  from anon, authenticated;

commit;
