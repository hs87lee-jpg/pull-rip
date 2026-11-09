-- 0001 허용목록 (G2 · T22)
-- 시험 프로젝트(vzytphssywwoebftqduw)의 SQL Editor에 붙여넣어 실행한다.
-- 실사용 프로젝트에는 G5 전환 때 같은 파일을 상석이 직접 실행한다.

-- 1) 허용목록 표: 들어올 수 있는 구글 이메일
create table if not exists public.allowed_users (
  email      text primary key check (email = lower(email)),
  role       text not null default 'member' check (role in ('owner', 'member')),
  added_at   timestamptz not null default now()
);

alter table public.allowed_users enable row level security;
-- 일반 사용자(anon, authenticated)에게는 정책을 주지 않는다 = 이 표를 직접 읽거나 쓸 수 없다.

-- 2) "지금 로그인한 사람이 허용목록에 있나?" — 앱과 다른 표의 RLS에서 사용
create or replace function public.is_allowed()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.allowed_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_allowed() from public, anon;
grant execute on function public.is_allowed() to authenticated;

-- 3) 가입 전 차단 훅: 허용목록에 없는 이메일은 계정 자체를 만들지 않는다
create or replace function public.hook_before_user_created(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_email text := lower(coalesce(event -> 'user' ->> 'email', ''));
begin
  if exists (select 1 from public.allowed_users where email = new_email) then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object(
    'error', jsonb_build_object(
      'message', '초대된 계정만 이용할 수 있습니다.',
      'http_code', 403
    )
  );
end;
$$;

grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_before_user_created(jsonb) from public, anon, authenticated;
grant usage on schema public to supabase_auth_admin;
grant select on public.allowed_users to supabase_auth_admin;

-- 4) 첫 허용 계정 (소유자)
insert into public.allowed_users (email, role)
values ('hs87lee@gmail.com', 'owner')
on conflict (email) do nothing;
