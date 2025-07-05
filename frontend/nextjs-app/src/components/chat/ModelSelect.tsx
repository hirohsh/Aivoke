'use client';
import { Data, SelectBox } from '@/components/ui/SelectBox';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// ローカルストレージのキー
const MODEL_STORAGE_KEY = 'selectedChatModel';

const modelList: Data[] = [
  { id: 1, name: 'GPT-3.5' },
  { id: 2, name: 'GPT-4' },
  { id: 3, name: 'Claude' },
];

function ModelSelectContent({ nonce }: { nonce?: string }) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  // モデル情報の取得と設定
  const getModelFromSearchParams = (): Data | null => {
    const modelName = searchParams.get('model');
    return modelList.find((m) => m.name === modelName) ?? null;
  };

  // ローカルストレージからモデル情報を取得
  const getSavedModel = (): Data | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(MODEL_STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as Data) : null;
      return modelList.find((m) => m.id === parsed?.id) ?? null;
    } catch {
      return null;
    }
  };

  // 初期モデルの設定
  const initial = getModelFromSearchParams() ?? getSavedModel() ?? modelList[0];
  const [selectedModel, setSelectedModel] = useState<Data>(initial);

  const handleModelChange = (model: Data) => setSelectedModel(model);

  useEffect(() => {
    // URL 更新
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('model') !== selectedModel.name) {
      params.set('model', selectedModel.name);
      router.replace(`${path}?${params.toString()}`);
    }
    // LocalStorage 更新
    localStorage.setItem(MODEL_STORAGE_KEY, JSON.stringify(selectedModel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel]);

  return (
    <SelectBox
      nonce={nonce}
      items={modelList}
      selected={selectedModel}
      onChange={handleModelChange}
    />
  );
}

export function ModelSelect({ nonce }: { nonce?: string }) {
  return (
    <Suspense
      fallback={
        <SelectBox nonce={nonce} items={modelList} selected={modelList[0]} onChange={() => {}} />
      }
    >
      <ModelSelectContent nonce={nonce} />
    </Suspense>
  );
}
