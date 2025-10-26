'use server';

import { I18N_SETTING_KEYS } from '@/lib/constants';
import { getCurrentLocale } from '@/lib/server/Locale';
import { apiKeyLocalSchema, apiKeySchema, userSettingsRpcSchema } from '@/schemas/settingSchemas';
import type {
  ApiKeyFormValues,
  ApiKeyLocalFormValues,
  ApiKeyType,
  SettingActionState,
  Settings,
  UserSettingsRpcValues,
} from '@/types/settingTypes';
import { createAdminClient, createAnonClient } from '@/utils/supabase/server';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * APIキー登録
 * @param _prevState
 * @param formData
 * @returns
 */
export async function saveApiKey(_prevState: SettingActionState, formData: FormData): Promise<SettingActionState> {
  const supabaseAnon = await createAnonClient();
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });

  const {
    data: { user },
    error: userError,
  } = await supabaseAnon.auth.getUser();

  if (!user || userError) {
    revalidatePath('/', 'layout');
    return redirect(`/${locale}/auth/login`);
  }

  const data: ApiKeyFormValues = {
    type: formData.get('type') as string,
    key: formData.get('key') as string,
    csrfToken: formData.get('csrfToken') as string,
  };

  const parsedSchema = apiKeySchema.safeParse(data);
  if (!parsedSchema.success) {
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { ok: false, formError: errorMessages };
  }

  const supabaseAdmin = await createAdminClient();

  const { error: insertError } = await supabaseAdmin.rpc('upsert_api_key_setting_and_secret', {
    p_user_id: user.id,
    p_api_provider: Number(parsedSchema.data.type),
    p_api_key: parsedSchema.data.key,
  });

  if (insertError) {
    return { ok: false, message: t(I18N_SETTING_KEYS.ApiKey.SaveFailure) };
  }

  return { ok: true, message: t(I18N_SETTING_KEYS.ApiKey.SaveSuccess) };
}

/**
 * APIキーローカル登録
 * @param _prevState
 * @param formData
 * @returns
 */
export async function saveApiKeyLocal(_prevState: SettingActionState, formData: FormData): Promise<SettingActionState> {
  const supabaseAnon = await createAnonClient();
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });

  const {
    data: { user },
    error: userError,
  } = await supabaseAnon.auth.getUser();

  if (!user || userError) {
    revalidatePath('/', 'layout');
    return redirect(`/${locale}/auth/login`);
  }

  const data: ApiKeyLocalFormValues = {
    type: formData.get('type') as string,
    csrfToken: formData.get('csrfToken') as string,
  };

  const parsedSchema = apiKeyLocalSchema.safeParse(data);
  if (!parsedSchema.success) {
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { ok: false, formError: errorMessages };
  }

  const supabaseAdmin = await createAdminClient();

  await supabaseAdmin.rpc('delete_api_key_setting_and_secret', {
    p_user_id: user.id,
  });

  const { error: insertError } = await supabaseAdmin.rpc('upsert_api_key_setting_local', {
    p_user_id: user.id,
    p_api_provider: Number(parsedSchema.data.type),
  });

  if (insertError) {
    return { ok: false, message: t(I18N_SETTING_KEYS.ApiKey.SaveFailure) };
  }

  return { ok: true, message: t(I18N_SETTING_KEYS.ApiKey.SaveSuccess) };
}

/**
 * APIキー削除
 * @param _prevState
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteApiKey(_prevState: SettingActionState, formData: FormData): Promise<SettingActionState> {
  const supabaseAnon = await createAnonClient();
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });

  const {
    data: { user },
    error: userError,
  } = await supabaseAnon.auth.getUser();

  if (!user || userError) {
    revalidatePath('/', 'layout');
    return redirect(`/${locale}/auth/login`);
  }

  const supabaseAdmin = await createAdminClient();

  const { error: deleteError } = await supabaseAdmin.rpc('delete_api_key_setting_and_secret', {
    p_user_id: user.id,
  });

  if (deleteError) {
    console.log('API key deleted failed:', deleteError);
    return { ok: false, message: t(I18N_SETTING_KEYS.ApiKey.DeleteFailure) };
  }
  return { ok: true, message: t(I18N_SETTING_KEYS.ApiKey.DeleteSuccess) };
}

/**
 * ユーザーの設定情報を取得する
 * @returns Promise<Settings>
 */
export async function getSettings(): Promise<Settings | null> {
  const supabaseAnon = await createAnonClient();

  const {
    data: { user },
    error: userError,
  } = await supabaseAnon.auth.getUser();

  if (!user || userError) {
    return null;
  }
  const supabaseAdmin = await createAdminClient();

  const { data, error } = await supabaseAdmin.rpc('get_user_settings', {
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }

  const settingData: UserSettingsRpcValues = {
    provider_name: data[0]?.provider_name as ApiKeyType,
    storage: data[0]?.storage,
  };

  const parsedSchema = userSettingsRpcSchema.safeParse(settingData);

  if (!parsedSchema.success) {
    console.error('Error parsing settings data:', parsedSchema.error);
    return null;
  }

  const result: Settings = {
    apiKey: {
      type: parsedSchema.data.provider_name,
      storage: parsedSchema.data.storage,
    },
  };

  return result;
}
