'use client';

import { deleteApiKey, saveApiKey, saveApiKeyLocal } from '@/actions/settingActions';
import { API_STORAGE_KEY } from '@/lib/constants';
import { SettingActionState } from '@/types/settingTypes';
import { useActionState } from 'react';

export function useApiKey() {
  const [saveState, saveAction, savePending] = useActionState<SettingActionState, FormData>(saveApiKey, {
    ok: false,
  });
  const [deleteState, deleteAction, deletePending] = useActionState<SettingActionState>(deleteApiKey, {
    ok: false,
  });
  const [saveLocalState, saveLocalAction, saveLocalPending] = useActionState<SettingActionState, FormData>(
    saveApiKeyLocal,
    {
      ok: false,
    }
  );

  const anyPending = savePending || deletePending || saveLocalPending;

  const saveApiKeytoLocalStorage = (key: string) => {
    localStorage.setItem(API_STORAGE_KEY, key);
  };

  const getApiKeyFromLocalStorage = () => {
    return localStorage.getItem(API_STORAGE_KEY) || '';
  };

  const deleteApiKeyFromLocalStorage = () => {
    localStorage.removeItem(API_STORAGE_KEY);
  };

  return {
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
    getApiKeyFromLocalStorage,
    deleteApiKeyFromLocalStorage,
  };
}
