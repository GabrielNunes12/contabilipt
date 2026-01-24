---
name: db-migrations
description: When asked to create or modify a database schema in Supabase
---

# DB Migrations Skill

When asked to create or modify a database schema in Supabase

## Instructions
### DOs
1. Use raw SQL for all database schema changes.
2. Create migration files in the `src/supabase/migrations` directory.
3. Follow the naming convention: `{Timestamp}-{MigrationName}.sql`.
4. Ensure all table and column names use `snake_case`.
5. When modifying existing tables, ensure data integrity and handle potential null constraints.
6. Handle Row Level Security (RLS) policies for any new tables.
7. prefer to use `if not exists` when creating tables.
8. prefer to use random_uuid() when creating uuid columns.
9. verify if the table already exists before creating it.
10. use indexes to improve performance when its necessary.
11. use transactions to group related changes.
12. use comments to explain the purpose of the table and columns.
13. use primary key to ensure data integrity.

### DONTs
1. Do not use any ORM or database management tools.
2. Do not use any database management tools.

## Example
```sql
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
```
