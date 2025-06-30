'use client';

import type { NavItem } from '@/components/layout/Header';
import { Header } from '@/components/layout/Header';
import { Data } from '@/components/ui/SelectBox';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

// ローカルストレージのキー
const MODEL_STORAGE_KEY = 'selectedChatModel';

const modelList: Data[] = [
  { id: 1, name: 'GPT-3.5' },
  { id: 2, name: 'GPT-4' },
  { id: 3, name: 'Claude' },
];

/**
 * HeaderWrapper コンポーネント
 * - usePathname フックを使用して、現在のパスに基づいてナビゲーション項目を動的に変更します。
 */
export function HeaderWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = usePathname();

  // モデル情報の取得と設定
  const getModelFromSearchParams = (searchParams: URLSearchParams): Data => {
    const modelName = searchParams.get('model');
    if (!modelName) return modelList[0]; // デフォルトモデルを返す
    return modelList.find((model) => model.name === modelName) || modelList[0]; // 一致するモデルがなければデフォルトを返す
  };

  // ローカルストレージからモデル情報を取得
  const getSavedModel = (): Data | null => {
    if (typeof window === 'undefined') return null; // サーバーサイドでの実行時は null を返す

    try {
      const savedModel = localStorage.getItem(MODEL_STORAGE_KEY);
      if (!savedModel) return null;

      const parsedModel = JSON.parse(savedModel) as Data;
      // 有効なモデルかチェック
      return modelList.find((model) => model.id === parsedModel.id) || null;
    } catch (error) {
      console.error('Failed to get saved model:', error);
      return null;
    }
  };

  // 初期モデルの設定
  const initialModel = (): Data => {
    // URLパラメータを優先
    const modelFromParams = getModelFromSearchParams(searchParams);
    if (modelFromParams) return modelFromParams;

    // 次にローカルストレージから
    const savedModel = getSavedModel();
    if (savedModel) return savedModel;

    // 最後にデフォルト
    return modelList[0];
  };

  const [selectedModel, setSelectedModel] = useState<Data>(initialModel());

  useEffect(() => {
    // パスが/chatの場合の処理
    if (path.startsWith('/chat')) {
      // URLにモデルパラメータがない場合
      if (!searchParams.has('model')) {
        // ローカルストレージからモデルを取得
        const savedModel = getSavedModel();
        const modelToUse = savedModel || modelList[0]; // 保存されたモデルまたはデフォルト

        // URLを更新
        const params = new URLSearchParams(searchParams.toString());
        params.set('model', modelToUse.name);
        router.replace(`${path}?${params.toString()}`);
        return;
      }

      // URLからモデルを取得して状態を更新
      const model = getModelFromSearchParams(searchParams);
      setSelectedModel(model);

      // ローカルストレージに保存
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(MODEL_STORAGE_KEY, JSON.stringify(model));
        } catch (error) {
          console.error('Failed to save model to localStorage:', error);
        }
      }
    }
  }, [searchParams, router, path]);

  // モデル変更ハンドラ
  const handleChange = useCallback(
    (selected: Data) => {
      // クエリパラメータを更新
      const params = new URLSearchParams(searchParams.toString());
      params.set('model', selected.name);
      router.push(`${path}?${params.toString()}`);

      // ローカルストレージに保存
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(MODEL_STORAGE_KEY, JSON.stringify(selected));
        } catch (error) {
          console.error('Failed to save model to localStorage:', error);
        }
      }
    },
    [searchParams, router, path]
  );

  // モデル選択セレクトボックス（共通アイテム）
  const modelSelectBox: NavItem = useMemo(
    () => ({
      label: 'Model',
      type: 'selectbox',
      align: 'left',
      selectProps: {
        items: modelList,
        selected: selectedModel,
        onChange: handleChange,
      },
    }),
    [selectedModel, handleChange]
  );

  // 基本ヘッダーアイテム一覧
  const defaultItems: NavItem[] = useMemo(
    () => [
      { label: 'Home', type: 'link', align: 'left' },
      { label: 'Chat', type: 'link', align: 'left' },
      { label: 'ToggleTheme', type: 'theme-toggle', align: 'right' },
      { label: 'EllipsisMenu', type: 'ellipsis-menu', align: 'right' },
    ],
    []
  );

  // チャットページのヘッダーアイテム一覧
  const chatItems: NavItem[] = useMemo(
    () => [
      { label: 'Home', type: 'link', align: 'left' },
      { label: 'ToggleTheme', type: 'theme-toggle', align: 'right' },
      { label: 'EllipsisMenu', type: 'ellipsis-menu', align: 'right' },
      modelSelectBox,
    ],
    [modelSelectBox]
  );

  // ログインページヘッダーアイテム一覧
  const loginItems: NavItem[] = useMemo(
    () => [
      { label: 'Home', type: 'link', align: 'left' },
      { label: 'ToggleTheme', type: 'theme-toggle', align: 'right' },
    ],
    []
  );

  const getHeaderItems = useCallback(
    (pathValue: string): NavItem[] => {
      if (pathValue.startsWith('/chat')) return chatItems;
      if (pathValue.startsWith('/login')) return loginItems;

      return defaultItems;
    },
    [defaultItems, chatItems, loginItems]
  );

  const items: NavItem[] = useMemo(() => {
    return getHeaderItems(path);
  }, [path, getHeaderItems]);

  return <Header items={items} />;
}
