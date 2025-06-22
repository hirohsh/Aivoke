import { ThemeToggle } from '@/components/layout/ThemeToggle';
import type { ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { SelectBox, SelectBoxProps } from '@/components/ui/SelectBox';
import Link from 'next/link';

/**
 * 単一ナビゲーション項目の型定義
 */
export interface NavItem {
  /** 表示ラベル */
  label: string;
  /** 種類 */
  type: 'link' | 'selectbox' | 'button' | 'theme-toggle';
  /** 左寄せ（default）／右寄せ */
  align?: 'left' | 'right';
  /** selectbox用データ */
  selectProps?: SelectBoxProps;
  /** ボタン用props */
  buttonProps?: ShadcnButtonProps;
  /** 表示・非表示制御 */
  visible?: boolean; // デフォルトtrue
}

/**
 * Header コンポーネントの props
 */
interface HeaderProps {
  /** ナビゲーション項目の配列 */
  items: NavItem[];
}

export default function Header({ items }: HeaderProps) {
  // // NavItemの状態をuseStateで管理
  // const [navItems, setNavItems] = useState<NavItem[]>(
  //   items.map((item) => ({ ...item, visible: item.visible !== false }))
  // );

  // // NavItemの表示/非表示を切り替える
  // const hideNavItem = (label: string) => {
  //   setNavItems((prev) =>
  //     prev.map((item) => (item.label === label ? { ...item, visible: !item.visible } : item))
  //   );
  // };

  // align プロパティで分割（visibleなものだけ）
  const leftItems = items.filter((item) => item.align !== 'right' && item.visible);
  const rightItems = items.filter((item) => item.align === 'right' && item.visible);

  // ラベルから href を生成するヘルパー
  const makeHref = (label: string) =>
    label === 'Home' ? '/' : `/${label.toLowerCase().replace(/\s+/g, '-')}`;

  const renderLink = (label: string) => (
    <Link
      key={label}
      href={makeHref(label)}
      className="flex items-center justify-center rounded-sm bg-transparent p-1.5 text-sm font-medium text-foreground hover:bg-input/30"
    >
      {label}
    </Link>
  );

  const renderSelectBox = (item: NavItem) => {
    if (!item.selectProps) return null;
    return (
      <SelectBox
        key={item.label}
        items={item.selectProps.items}
        selected={item.selectProps.selected}
        onChange={item.selectProps.onChange}
      />
    );
  };

  const renderButton = (item: NavItem) => {
    if (!item.buttonProps) return null;
    return <Button key={item.label} {...item.buttonProps}></Button>;
  };

  const renderThemeToggle = () => {
    return <ThemeToggle />;
  };

  const renderNavItem = (item: NavItem) => {
    if (item.type === 'link') return renderLink(item.label);
    if (item.type === 'selectbox') return renderSelectBox(item);
    if (item.type === 'button') return renderButton(item);
    if (item.type === 'theme-toggle') return renderThemeToggle();
    return null;
  };

  return (
    <header className="sticky top-0 right-0 left-0 z-50 flex h-16 items-center justify-between bg-transparent px-4 3xl:absolute">
      {/* 左側ナビゲーション */}
      <div className="flex flex-1 gap-4">
        {leftItems.map((item) => (
          <div key={item.label} className="flex bg-transparent">
            {renderNavItem(item)}
          </div>
        ))}
      </div>
      {/* 右側ナビゲーション */}
      <div className="flex flex-1 justify-end gap-4">
        {rightItems.map((item) => (
          <div key={item.label} className="flex bg-transparent">
            {renderNavItem(item)}
          </div>
        ))}
      </div>
    </header>
  );
}
