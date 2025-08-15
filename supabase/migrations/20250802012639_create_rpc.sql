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
  if p_user_id is null then
    raise exception 'p_user_id cannot be NULL';
  end if;

  insert into public.api_key_settings as s (user_id, api_provider)
  values (p_user_id, p_api_provider)
  on conflict (user_id) do update
    set api_provider = excluded.api_provider,
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

-- API キー削除
create or replace function public.delete_api_key_setting_and_secret (
  p_user_id      uuid
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
  if p_user_id is null then
    raise exception 'p_user_id cannot be NULL';
  end if;

  update public.api_key_settings
    set api_provider = null,
        updated_at   = now()
  where user_id = p_user_id;

  select id
    into v_secret_id
    from vault.decrypted_secrets
   where name = v_secret_name;

  if v_secret_id is not null then
    delete from vault.secrets
    where id = v_secret_id;
  end if;
end;
$$;

-- API キー取得
create or replace function public.get_api_key_secret (
  p_user_id      uuid
)
returns text
set search_path = ''
language plpgsql
security definer
as $$
declare
  v_secret_name text := format('user_api_key_%s', p_user_id);
  secret text;
begin
  if p_user_id is null then
    raise exception 'p_user_id cannot be NULL';
  end if;

  select decrypted_secret
  into secret
  from vault.decrypted_secrets
  where name = v_secret_name
  limit 1;

  return secret;
end;
$$;

-- ユーザー ID を受け取り、設定情報を返す
create or replace function public.get_user_settings(p_user_id uuid)
returns table (
    provider_name text
)
language sql
security definer
set search_path = ''
as $$
  select ap.name
  from   public.api_key_settings aks
  join   public.api_providers   ap  on ap.id = aks.api_provider
  where  aks.user_id = p_user_id
  limit  1;
$$;

-- ユーザー ID を受け取り、APIキーの種類を返す
create or replace function public.get_user_provider_name(p_user_id uuid)
returns text
language sql
security definer
set search_path = ''
as $$
  select ap.name
  from   public.api_key_settings aks
  join   public.api_providers   ap  on ap.id = aks.api_provider
  where  aks.user_id = p_user_id
  limit  1;
$$;
