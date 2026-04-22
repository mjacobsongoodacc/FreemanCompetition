-- Extensions
create extension if not exists "pgcrypto";

-- Sessions table (single demo session for now)
create table public.sessions (
  id text primary key,
  user_profile jsonb not null,
  created_at timestamptz not null default now()
);

-- Turns table: one row per request/response pair
create table public.turns (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.sessions(id) on delete cascade,
  user_message text not null,
  response_payload jsonb,
  status text not null default 'pending' check (status in ('pending','in_boodlebox','responded')),
  created_at timestamptz not null default now(),
  responded_at timestamptz
);

create index turns_session_created_idx on public.turns(session_id, created_at desc);

-- Realtime: enable on turns so subscribers see inserts and updates
alter publication supabase_realtime add table public.turns;

-- RLS: intentionally DISABLED for the pitch demo.
-- Re-enable and write policies before any production use.
alter table public.sessions disable row level security;
alter table public.turns disable row level security;

-- Seed the single demo session
insert into public.sessions (id, user_profile) values (
  'sarah_demo',
  jsonb_build_object(
    'name', 'Sarah Boudreaux',
    'age', 34,
    'address', 'Gentilly, New Orleans',
    'zip', '70122',
    'vehicle', '2014 Honda Civic',
    'fuel_level', 0.375,
    'budget_usd', 1000,
    'dependents', jsonb_build_array('mother in Slidell')
  )
);
