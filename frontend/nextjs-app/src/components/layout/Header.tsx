'use client';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { LogoIcon } from '../common/LogoIcon';
import { AuthToggleButton } from './AuthToggleButton';
import { LocaleSelect } from './LocaleSelect';

const ModelSelect = dynamic(() => import('@/components/chat/ModelSelect').then((m) => m.ModelSelect), {
  ssr: false,
});

interface ShadcnButtonProps {
  props: ButtonProps;
  text?: string;
  icon?: React.JSX.Element;
}

/**
 * 単一ナビゲーション項目の型定義
 */
export interface NavItem {
  /** 表示ラベル */
  label: string;
  /** 種類 */
  type:
    | 'link'
    | 'model-select'
    | 'button'
    | 'theme-toggle'
    | 'auth-toggle-button'
    | 'sidebar-trigger'
    | 'logo'
    | 'locale-select';
  /** 左寄せ（default）／右寄せ */
  align?: 'left' | 'right';
  /** モバイル限定 */
  mobileOnly?: boolean;
  /** ボタン用props */
  buttonProps?: ShadcnButtonProps;
}

/**
 * Header コンポーネントの props
 */
interface HeaderProps {
  /** ナビゲーション項目の配列 */
  items: NavItem[];
  nonce?: string;
}

export function Header({ items }: HeaderProps) {
  // モバイルデバイスかどうかを判定するフック
  const isMobile = useIsMobile();

  const t = useTranslations();

  // align プロパティで分割（visibleなものだけ）
  const leftItems = items.filter((item) => item.align !== 'right');
  const rightItems = items.filter((item) => item.align === 'right');

  // ラベルから href を生成するヘルパー
  const makeHref = (label: string) => (label === 'Home' ? `/` : `/${label.toLowerCase().replace(/\s+/g, '-')}`);

  const renderLink = (label: string) => (
    <Link
      key={label}
      href={makeHref(label)}
      className="flex items-center justify-center rounded-sm bg-transparent p-1.5 text-sm font-medium text-foreground hover:bg-input/60 dark:hover:bg-input/30"
    >
      {t(`Header.${label}`)}
    </Link>
  );

  const renderModelSelect = () => {
    return <ModelSelect />;
  };

  const renderButton = (item: NavItem) => {
    if (!item.buttonProps) return null;
    return (
      <Button key={item.label} {...item.buttonProps.props}>
        {item.buttonProps.icon}
        {item.buttonProps.text}
      </Button>
    );
  };

  const renderThemeToggle = () => {
    return !isMobile ? <ThemeToggle /> : null;
  };

  const renderAuthToggleButton = () => {
    return <AuthToggleButton />;
  };

  const renderSidebarTrigger = () => {
    return <SidebarTrigger />;
  };

  const renderLogoIcon = () => {
    return <LogoIcon size={32} strokeWidth={20} className="text-foreground" />;
  };

  const renderLocaleSelect = () => {
    return !isMobile ? <LocaleSelect /> : null;
  };

  const renderNavItem = (item: NavItem) => {
    if (item.type === 'link') return renderLink(item.label);
    if (item.type === 'model-select') return renderModelSelect();
    if (item.type === 'button') return renderButton(item);
    if (item.type === 'theme-toggle') return renderThemeToggle();
    if (item.type === 'auth-toggle-button') return renderAuthToggleButton();
    if (item.type === 'sidebar-trigger') return renderSidebarTrigger();
    if (item.type === 'logo') return renderLogoIcon();
    if (item.type === 'locale-select') return renderLocaleSelect();
    return null;
  };

  return (
    <header className="sticky top-0 right-0 left-0 z-50 flex h-14 items-center justify-between bg-background px-4 2xl:absolute 2xl:bg-transparent">
      {/* 左側ナビゲーション */}
      <div className="flex flex-1 gap-4">
        {leftItems.map(
          (item) =>
            (!item.mobileOnly || isMobile) && (
              <div key={item.label} className="flex items-center bg-transparent">
                {renderNavItem(item)}
              </div>
            )
        )}
      </div>
      {/* 右側ナビゲーション */}
      <div className="flex flex-1 justify-end gap-4">
        {rightItems.map((item) => (
          <div key={item.label} className="flex bg-transparent">
            {(!item.mobileOnly || isMobile) && renderNavItem(item)}
          </div>
        ))}
      </div>
    </header>
  );
}
