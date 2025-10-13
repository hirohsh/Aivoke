'use client';

import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { useApiKey } from '@/hooks/useApiKey';
import { useMutationToast } from '@/hooks/useMutationToast';
import { API_PROVIDERS } from '@/lib/constants';
import { useModel } from '@/providers/ModelProvider';
import { useSettings } from '@/providers/SettingsProvider';
import { apiKeySchema } from '@/schemas/settingSchemas';
import { ApiKeyFormValues } from '@/types/settingTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

export function ApikeyForm() {
  const { settings, getProviderId, isSaveToServer } = useSettings();
  const router = useRouter();
  const { handleModelChange } = useModel();
  const {
    saveState,
    saveAction,
    savePending,
    deleteState,
    deleteAction,
    deletePending,
    saveLocalState,
    saveLocalAction,
    saveLocalPending,
    anyPending,
    saveApiKeytoLocalStorage,
    deleteApiKeyFromLocalStorage,
  } = useApiKey();
  const [isEditing, setIsEditing] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isServer, setIsServer] = useState<boolean>(() => isSaveToServer());

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

  const onSaveSuccess = () => {
    setIsEditing(false);
    router.refresh();
  };

  const onDeleteSuccess = () => {
    setIsServer(false);
    router.refresh();
  };

  const onFinally = () => {
    resetField('key');
  };

  useMutationToast({
    state: saveState,
    pending: savePending,
    onSuccess: onSaveSuccess,
    onFinally,
  });

  useMutationToast({
    state: deleteState,
    pending: deletePending,
    onSuccess: onDeleteSuccess,
    onFinally,
  });

  useMutationToast({
    state: saveLocalState,
    pending: saveLocalPending,
    onSuccess: onSaveSuccess,
    onFinally,
  });

  const handleSaveKey = (values: ApiKeyFormValues) => {
    if (!isSaveToServer()) {
      deleteApiKeyFromLocalStorage();
    }

    const fd = new FormData();
    fd.append('type', values.type);
    fd.append('key', values.key);

    startTransition(() => {
      saveAction(fd);
    });
  };

  const handleSaveKeyLocal = (values: ApiKeyFormValues) => {
    saveApiKeytoLocalStorage(values.key);

    const fd = new FormData();
    fd.append('type', values.type);

    startTransition(() => {
      saveLocalAction(fd);
    });
  };

  const onValid = (values: ApiKeyFormValues) => {
    if (isServer) {
      handleSaveKey(values);
    } else {
      handleSaveKeyLocal(values);
    }
  };

  const handleDelete = () => {
    deleteApiKeyFromLocalStorage();
    handleModelChange('');
    startTransition(() => {
      deleteAction();
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsServer(isSaveToServer());
    resetField('key');
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onValid)} className="my-2">
          {saveState.formError && <div className="mt-2 text-center text-sm text-red-500">{saveState.formError}</div>}
          <div className="grid gap-6">
            <div className="grid gap-3">
              <FormLabel htmlFor="saveToServer">Save to Server</FormLabel>
              <FormDescription>{'Enable this option to save your API key on the server.'}</FormDescription>
              <Switch
                disabled={isSubmitting || anyPending || !isEditing}
                checked={isServer}
                onCheckedChange={setIsServer}
                id="saveToServer"
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="apiType">API Type</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting || anyPending || !isEditing}
                      >
                        <SelectTrigger className="w-full" id="apiType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.entries(API_PROVIDERS).map(([key, obj]) => (
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
                        disabled={isSubmitting || anyPending || !isEditing}
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
                disabled={isSubmitting || anyPending || isEditing}
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
                disabled={isSubmitting || anyPending || !settings?.apiKey.type}
              >
                {'Delete API Key'}
              </Button>
            ) : null}
            {isEditing ? (
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting || anyPending || !isEditing}
              >
                {isSubmitting || savePending ? <Spinner /> : 'Save API Key'}
              </Button>
            ) : null}
            {isEditing ? (
              <Button
                type="button"
                onClick={handleCancel}
                className="w-full cursor-pointer"
                disabled={isSubmitting || anyPending || !isEditing}
              >
                {'Cancel'}
              </Button>
            ) : null}
          </div>
        </form>
      </Form>
      <ConfirmDialog
        onConfirm={handleDelete}
        title="APIキーの削除確認"
        description="APIキーを削除しますか？"
        isOpen={isOpenDialog}
        setOpen={setIsOpenDialog}
        confirmLabel="削除"
      />
    </>
  );
}
