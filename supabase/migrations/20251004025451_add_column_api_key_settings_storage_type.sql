CREATE TYPE storage_type AS ENUM ('local', 'server');

ALTER TABLE api_key_settings ADD COLUMN storage storage_type NOT NULL DEFAULT 'local';


-- API キー保存
create or replace function public.upsert_api_key_setting_and_secret (
  p_user_id      uuid,
  p_api_provider integer,
  p_api_key      text
)
returns void
set search_path = ''
language plpgsql
security definer
as $$
declare
  v_secret_name text := format('user_api_key_%s', p_user_id);
  v_secret_id   uuid;
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  if p_user_id is null then
    raise exception 'p_user_id cannot be NULL';
  end if;

  insert into public.api_key_settings as s (user_id, api_provider, storage)
  values (p_user_id, p_api_provider, 'server')
  on conflict (user_id) do update
    set api_provider = excluded.api_provider,
        storage      = excluded.storage,
        updated_at   = now();

  select id
    into v_secret_id
    from vault.decrypted_secrets
   where name = v_secret_name;

  if v_secret_id is null then
    -- 新規作成
    perform vault.create_secret(
             p_api_key,
             v_secret_name,
             'created ' || now()
           );
  else
    -- 既存を上書き
    perform vault.update_secret(
             v_secret_id,
             p_api_key,
             v_secret_name,
             'updated ' || now()
           );
  end if;
end;
$$;

-- API キーローカル保存用設定更新
create or replace function public.upsert_api_key_setting_local (
  p_user_id      uuid,
  p_api_provider integer
)
returns void
set search_path = ''
language plpgsql
security definer
as $$
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  if p_user_id is null then
    raise exception 'p_user_id cannot be NULL';
  end if;

  insert into public.api_key_settings as s (user_id, api_provider, storage)
  values (p_user_id, p_api_provider, 'local')
  on conflict (user_id) do update
    set api_provider = excluded.api_provider,
        storage      = excluded.storage,
        updated_at   = now();
end;
$$;

drop function if exists public.get_user_settings(uuid);

-- ユーザー ID を受け取り、設定情報を返す
create or replace function public.get_user_settings(p_user_id uuid)
returns table (
    provider_name text,
    storage      storage_type
)
language sql
security definer
set search_path = ''
as $$
  select ap.name  as provider_name,
         aks.storage
  from   public.api_key_settings aks
  join   public.api_providers   ap  on ap.id = aks.api_provider
  where  aks.user_id = p_user_id
  limit  1;
$$;


REVOKE ALL ON FUNCTION public.get_user_settings(uuid) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.upsert_api_key_setting_local(uuid, integer) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.upsert_api_key_setting_and_secret(uuid, integer, text) FROM anon, authenticated, public;
