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


-- Service Role 判定（JWT の role クレームを確認）
create or replace function public.is_service_role()
returns boolean
set search_path = ''
language sql
stable
as $$
  select coalesce(
           nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role',
           ''
         ) = 'service_role';
$$;

comment on function public.is_service_role() is 'Supabase JWTのrole=service_roleのみtrue。';


-- 会話作成
create or replace function public.rpc_create_conversation(
  p_user_id uuid,
  p_title   text default null,
  p_model   text default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_conv_id uuid;
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  insert into public.conversations (user_id, title, model)
  values (p_user_id, p_title, p_model)
  returning id into v_conv_id;

  return v_conv_id;
end;
$$;

-- 会話タイトル更新
create or replace function public.rpc_update_conversation_title(
  p_user_id uuid,
  p_conversation_id uuid,
  p_title text
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  update public.conversations
     set title = p_title
   where id = p_conversation_id
     and user_id = p_user_id;
end;
$$;

-- 会話アーカイブ/解除
create or replace function public.rpc_archive_conversation(
  p_user_id uuid,
  p_conversation_id uuid,
  p_archived boolean
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  update public.conversations
     set archived_at = case when p_archived then now() else null end
   where id = p_conversation_id
     and user_id = p_user_id;
end;
$$;

-- 会話のソフトデリート
create or replace function public.rpc_delete_conversation(
  p_user_id uuid,
  p_conversation_id uuid
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  update public.conversations
     set deleted_at = now()
   where id = p_conversation_id
     and user_id = p_user_id;
end;
$$;

-- 返却用の型
create type public.conversation_list as (
  id uuid,
  title text,
  model text,
  created_at timestamptz
);

-- 会話一覧（ページング）
create or replace function public.rpc_list_conversations(
  p_user_id uuid,
  p_limit   int   default 20,
  p_cursor  timestamptz default null
)
returns setof public.conversation_list
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  return query
  select c.id, c.title, c.model, c.created_at
    from public.conversations c
   where c.user_id = p_user_id
     and c.deleted_at is null
     and (p_cursor is null or c.updated_at < p_cursor)
   order by c.updated_at desc
   limit greatest(1, least(p_limit, 100));
end;
$$;


-- メッセージ作成（reply_to が同一会話かを検証）
create or replace function public.rpc_create_message(
  p_conversation_id uuid,
  p_user_id         uuid,
  p_role            message_role,
  p_content         jsonb,
  p_reply_to        uuid default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_parent_conv uuid;
  v_id uuid;
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  if p_reply_to is not null then
    select m.conversation_id into v_parent_conv
      from public.messages m
     where m.id = p_reply_to;

    if v_parent_conv is null then
      raise exception 'reply_to points to non-existing message';
    end if;

    if v_parent_conv <> p_conversation_id then
      raise exception 'reply_to must be in the same conversation';
    end if;
  end if;

  insert into public.messages (
    conversation_id, user_id, role, content, model, reply_to
  ) values (
    p_conversation_id, p_user_id, p_role, p_content, p_model, p_reply_to
  )
  returning id into v_id;

  -- 会話の更新時刻をタッチ
  update public.conversations
     set updated_at = now()
   where id = p_conversation_id
     and user_id = p_user_id;

  return v_id;
end;
$$;


-- 会話内メッセージ取得（ページング）
create or replace function public.rpc_list_messages(
  p_conversation_id uuid,
  p_user_id         uuid,
  p_limit           int   default 50,
  p_after           timestamptz default null  -- created_at がこれより新しいもの（asc）
)
returns table (
  id uuid,
  conversation_id uuid,
  role message_role,
  content jsonb,
  model text,
  reply_to uuid,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  return query
  select m.id, m.conversation_id, m.role, m.content, m.model,
         m.reply_to, m.created_at, m.updated_at
    from public.messages m
    join public.conversations c
      on c.id = m.conversation_id
   where m.conversation_id = p_conversation_id
     and c.user_id = p_user_id
     and m.deleted_at is null
     and (p_after is null or m.created_at > p_after)
   order by m.created_at asc
   limit greatest(1, least(p_limit, 500));
end;
$$;


-- サマリー以降のメッセージ取得
create or replace function public.rpc_list_messages_after_summary(
  p_user_id uuid,
  p_conversation_id uuid
)
returns setof public.messages
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_up_to_created timestamptz;
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  -- サマリーがなければ空返し
  select m.created_at
    into v_up_to_created
    from public.conversation_summaries s
    join public.messages m
      on m.id = s.up_to_message_id
     and m.conversation_id = s.conversation_id
   where s.conversation_id = p_conversation_id
     and s.user_id = p_user_id;

  if not found then
    return;
  end if;

  return query
  select m.*
    from public.messages m
   where m.conversation_id = p_conversation_id
     and m.user_id = p_user_id
     and m.deleted_at is null
     and m.created_at > v_up_to_created
   order by m.created_at asc;
end;
$$;


-- 使用料記録
create or replace function public.rpc_insert_token_usage(
  p_user_id uuid,
  p_conversation_id uuid,
  p_message_id uuid,
  p_model text,
  p_prompt_tokens int,
  p_completion_tokens int,
  p_cost_cents numeric
) returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id bigint;
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  insert into public.token_usage (
    user_id, conversation_id, message_id, model,
    prompt_tokens, completion_tokens, cost_cents
  ) values (
    p_user_id, p_conversation_id, p_message_id, p_model,
    coalesce(p_prompt_tokens,0), coalesce(p_completion_tokens,0), coalesce(p_cost_cents,0)
  )
  returning id into v_id;

  return v_id;
end;
$$;


-- 期間集計
create or replace function public.rpc_sum_token_usage(
  p_user_id uuid,
  p_from timestamptz,
  p_to   timestamptz
) returns table(
  model text,
  prompt_tokens bigint,
  completion_tokens bigint,
  cost_cents numeric
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  return query
  select model,
         sum(prompt_tokens)::bigint,
         sum(completion_tokens)::bigint,
         sum(cost_cents)
    from public.token_usage
   where user_id = p_user_id
     and created_at >= p_from
     and created_at <  p_to
   group by model
   order by model;
end;
$$;


-- 会話サマリー作成
create or replace function public.rpc_upsert_conversation_summary(
  p_user_id uuid,
  p_conversation_id uuid,
  p_summary text,
  p_up_to_message_id uuid
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  insert into public.conversation_summaries as cs (
    conversation_id, user_id, summary, up_to_message_id, updated_at
  ) values (
    p_conversation_id, p_user_id, p_summary, p_up_to_message_id, now()
  )
  on conflict (conversation_id) do update
     set summary = excluded.summary,
         up_to_message_id = excluded.up_to_message_id,
         updated_at = now();
end;
$$;

-- 会話サマリー取得
create or replace function public.rpc_get_conversation_summary(
  p_user_id uuid,
  p_conversation_id uuid
)
returns table (
  conversation_id uuid,
  summary text,
  up_to_message_id uuid,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_service_role() then
    raise exception 'forbidden';
  end if;

  return query
  select c.conversation_id, c.summary, c.up_to_message_id, c.updated_at
    from public.conversation_summaries c
   where c.conversation_id = p_conversation_id
     and c.user_id = p_user_id;
end;
$$;
