
-- Create a table for public profiles (linked to auth.users)
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  is_premium boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create Policy: Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

-- Create Policy: Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Auto-create profile on signup (Trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Simulations Table (To save scenarios)
create table public.simulations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text default 'Sem título',
  daily_rate numeric not null,
  days_per_month integer default 21,
  months_per_year integer default 11,
  expenses numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Simulations
alter table public.simulations enable row level security;

create policy "Users can all their own simulations"
  on public.simulations for all
  using ( auth.uid() = user_id );
