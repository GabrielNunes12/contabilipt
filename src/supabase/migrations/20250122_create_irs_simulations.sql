create table if not exists public.irs_simulations (
  id uuid not null default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Inputs
  annual_gross_income numeric not null,
  income_type text not null default 'B', -- 'A' or 'B'
  status text not null default 'single', -- 'single' or 'married'
  dependents integer not null default 0,
  expenses numeric not null default 0,
  withholding_tax numeric not null default 0,
  
  -- Calculated Results (Snapshot)
  result_net_tax numeric,
  result_amount_to_pay numeric,
  
  created_at timestamptz not null default now(),
  
  primary key (id)
);

-- RLS Policies
alter table public.irs_simulations enable row level security;

create policy "Users can insert their own irs simulations"
  on public.irs_simulations for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own irs simulations"
  on public.irs_simulations for select
  using (auth.uid() = user_id);
