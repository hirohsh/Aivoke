'use client';

import { MODEL_DEFINITIONS_BY_API_KEY, MODEL_STORAGE_KEY } from '@/lib/constants';
import { ModelDefinition, ModelId } from '@/types/modelTypes';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSettings } from './SettingsProvider';

type ModelContextType = {
  selectedModel?: ModelId;
  modelDefinition?: ModelDefinition;
  handleModelChange: (model: ModelId) => void;
};

const isBrowser = typeof window !== 'undefined';

const readStoredModel = (): ModelId | undefined => {
  if (!isBrowser) return undefined;
  return (localStorage.getItem(MODEL_STORAGE_KEY) as ModelId | null) ?? undefined;
};

const writeStoredModel = (model: ModelId | undefined) => {
  if (!isBrowser) return;
  if (model) {
    localStorage.setItem(MODEL_STORAGE_KEY, model);
  } else {
    localStorage.removeItem(MODEL_STORAGE_KEY);
  }
};

const errorIfNoProvider = () => {
  throw new Error('useModel must be used within ModelProvider');
};

const defaultCtx: ModelContextType = {
  selectedModel: undefined,
  modelDefinition: undefined,
  handleModelChange: errorIfNoProvider,
};

const ModelContext = createContext<ModelContextType>(defaultCtx);

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useSettings();

  const [selectedModel, setSelectedModel] = useState<ModelId | undefined>(undefined);

  const modelDefinition = useMemo<ModelDefinition | undefined>(() => {
    if (!settings?.apiKey.type) return undefined;
    return MODEL_DEFINITIONS_BY_API_KEY[settings.apiKey.type];
  }, [settings?.apiKey.type]);

  useEffect(() => {
    setSelectedModel(readStoredModel());
  }, []);

  useEffect(() => writeStoredModel(selectedModel), [selectedModel]);

  useEffect(() => {
    if (!modelDefinition) {
      setSelectedModel(undefined);
      return;
    }
    if (!selectedModel || !modelDefinition[selectedModel]) {
      const firstKey = Object.keys(modelDefinition)[0] as ModelId;
      setSelectedModel(firstKey);
    }
  }, [modelDefinition, selectedModel]);

  const handleModelChange = useCallback((model: ModelId) => {
    setSelectedModel(model);
  }, []);

  return (
    <ModelContext.Provider
      value={{
        selectedModel,
        handleModelChange,
        modelDefinition,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) errorIfNoProvider();
  return context;
};
