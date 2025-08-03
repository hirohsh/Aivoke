'use client';

import { deleteApiKey, saveApiKey } from '@/actions/settingActions';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/providers/SettingsProvider';
import { type ApiKeyFormValues, apiKeySchema } from '@/schemas/settingSchemas';
import { API_KEY_TYPES, SettingActionState } from '@/types/settingTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function ApikeyForm() {
  const { settings, getProviderId } = useSettings();
  const router = useRouter();
  const [settingState, settingAction, settingPending] = useActionState<SettingActionState, FormData>(saveApiKey, {
    ok: false,
  });
  const [deleteKeyState, deleteKeyAction, deleteKeyPending] = useActionState<SettingActionState>(deleteApiKey, {
    ok: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const form = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema),
    mode: 'onSubmit',
    defaultValues: {
      type: getProviderId(settings?.apiKey.type),
      key: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    resetField,
  } = form;

  useEffect(() => {
    if (!settingState.message) return; // 初期レンダリング時は無視
    if (settingPending) return; // リクエスト中は無視
    toast.dismiss(); // 既存のトーストをクリア

    if (settingState.ok) {
      toast.success(settingState.message, {
        duration: 3000,
        position: 'top-center',
      });
      setIsEditing(false);
      router.refresh(); // 設定を更新するためにページをリフレッシュ
    } else {
      toast.error(settingState.message, {
        duration: 3000,
        position: 'top-center',
      });
    }
    resetField('key');
  }, [resetField, router, settingPending, settingState.message, settingState.ok]);

  useEffect(() => {
    if (!deleteKeyState.message) return; // 初期レンダリング時は無視
    if (deleteKeyPending) return; // リクエスト中は無視
    toast.dismiss(); // 既存のトーストをクリア

    if (deleteKeyState.ok) {
      toast.success(deleteKeyState.message, {
        duration: 3000,
        position: 'top-center',
      });
      router.refresh(); // 設定を更新するためにページをリフレッシュ
    } else {
      toast.error(deleteKeyState.message, {
        duration: 3000,
        position: 'top-center',
      });
    }
    resetField('key');
  }, [deleteKeyPending, deleteKeyState.message, deleteKeyState.ok, resetField, router]);

  const onValid = (values: ApiKeyFormValues) => {
    const fd = new FormData();
    fd.append('type', values.type);
    fd.append('key', values.key);

    startTransition(() => {
      settingAction(fd);
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    resetField('key');
  };

  const handleDeleteApiKey = () => {
    setIsOpenDialog(false);
    startTransition(() => {
      deleteKeyAction();
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onValid)} className="my-6">
          {settingState.formError && (
            <div className="mt-2 text-center text-sm text-red-500">{settingState.formError}</div>
          )}
          <div className="grid gap-6">
            <div className="grid gap-3">
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="key">API Type</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting || settingPending || deleteKeyPending || !isEditing}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.entries(API_KEY_TYPES).map(([key, obj]) => (
                              <SelectItem key={key} value={obj.id}>
                                {obj.value}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="key">API Key</FormLabel>
                    <FormControl>
                      <Input
                        id="key"
                        type="password"
                        autoComplete="off"
                        placeholder={!isEditing && settings?.apiKey.type ? '********' : ''}
                        disabled={isSubmitting || settingPending || deleteKeyPending || !isEditing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full cursor-pointer"
                disabled={isSubmitting || settingPending || deleteKeyPending || isEditing}
              >
                {'Edit'}
              </Button>
            ) : null}
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsOpenDialog(true)}
                variant={'outlineDangerous'}
                className="w-full cursor-pointer"
                disabled={isSubmitting || settingPending || deleteKeyPending || !settings?.apiKey.type}
              >
                {'Delete API Key'}
              </Button>
            ) : null}
            {isEditing ? (
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting || settingPending || deleteKeyPending || !isEditing}
              >
                {isSubmitting || settingPending ? <LoadingSpinner className="size-7" /> : 'Save API Key'}
              </Button>
            ) : null}
            {isEditing ? (
              <Button
                type="button"
                onClick={handleCancel}
                className="w-full cursor-pointer"
                disabled={isSubmitting || settingPending || deleteKeyPending || !isEditing}
              >
                {'Cancel'}
              </Button>
            ) : null}
          </div>
        </form>
      </Form>
      <ConfirmDialog
        onConfirm={handleDeleteApiKey}
        title="APIキーの削除確認"
        description="APIキーを削除しますか？"
        isOpen={isOpenDialog}
        setOpen={setIsOpenDialog}
        confirmLabel="削除"
      />
    </>
  );
}
