import { HUGGING_FACE_MODEL_DEFINITIONS } from '@/lib/constants';

export type HuggingFaceModelId = keyof typeof HUGGING_FACE_MODEL_DEFINITIONS;

export type ModelId = HuggingFaceModelId;

export type ModelDefinitionItem = {
  name: string;
  modelId: string;
};

export type ModelDefinition = Record<string, ModelDefinitionItem>;

export type ModeSelectItem = {
  id: ModelId;
  name: string;
};
