-- Public read access for portfolio owner's projects
-- Run this in Supabase SQL Editor after replacing YOUR_UUID_HERE with your user UUID
-- (Supabase dashboard → Authentication → Users)
--
-- This allows anonymous visitors to SELECT your projects while keeping
-- todos and notes private (their RLS policies are unchanged).

drop policy if exists "Users can view own projects" on public.projects;

create policy "Public read access" on public.projects
  for select using (
    user_id = 'YOUR_UUID_HERE'::uuid
    OR auth.uid() = user_id
  );
