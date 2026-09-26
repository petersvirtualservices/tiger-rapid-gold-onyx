-- Shared family moving list. Access is membership, not a public board.
-- user_id is the signed-in Better Auth id (text).

create table if not exists households (
  id text primary key,
  name text not null,
  join_code text not null unique,
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists household_members (
  household_id text not null references households (id) on delete cascade,
  user_id text not null,
  display_name text not null,
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create unique index if not exists household_members_one_home
  on household_members (user_id);

create table if not exists tasks (
  id text primary key,
  household_id text not null references households (id) on delete cascade,
  title text not null,
  detail text not null default '',
  note text not null default '',
  note_by_name text not null default '',
  phase text not null,
  assignee text not null default 'Anyone',
  status text not null default 'open',
  pinned boolean not null default false,
  pin_order integer not null default 0,
  sort_order integer not null default 0,
  added_by text not null,
  added_by_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint tasks_status_chk check (status in ('open', 'done', 'skipped'))
);

create index if not exists tasks_household_idx
  on tasks (household_id, status, sort_order);
