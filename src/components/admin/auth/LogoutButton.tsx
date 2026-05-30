'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

type Props = {
  /** When true, render as a full-width sidebar row with destructive styling */
  asSidebarItem?: boolean;
  className?: string;
  /** Whether the sidebar is open (for showing text or just icon) */
  isSidebarOpen?: boolean;
  /** Optional override for where to redirect after logout */
  redirectTo?: string;
  tone?: 'destructive' | 'inverse';
};

/**
 * LogoutButton component — a button that logs the user out when clicked.
 */
export default function LogoutButton({
  asSidebarItem = false,
  className,
  isSidebarOpen = true,
  redirectTo,
  tone = 'destructive',
}: Props) {
  const t = useTranslations('AdminDashboard');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [hover, setHover] = useState(false);

  const handleLogout = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace(redirectTo ?? `/${locale}/admin/login`);
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsPending(false);
    }
  };

  // Sidebar variant
  if (asSidebarItem) {
    const inverse = tone === 'inverse';

    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        disabled={isPending}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={[
          'w-full justify-start gap-3 rounded-lg px-3 py-2 cursor-pointer mb-2',
          inverse
            ? 'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
            : 'hover:bg-ring/40',
          className || '',
        ].join(' ')}
      >
        {isPending ? (
          <Loader2
            className={`size-4.5 animate-spin ${
              inverse ? 'text-current' : 'text-destructive'
            }`}
          />
        ) : (
          <LogOut
            className={`size-4.5 ${inverse ? 'text-current' : 'text-destructive'}`}
          />
        )}
        {/* Only show label when sidebar is open */}
        {isSidebarOpen && (
          <span
            className={`text-[13px] font-medium ${
              inverse ? 'text-current' : 'text-destructive'
            } ${
              hover ? 'underline' : ''
            }`}
          >
            {t('logout')}
          </span>
        )}
      </Button>
    );
  }

  // Default variant (outside sidebar)
  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isPending}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={['flex items-center gap-2 cursor-pointer', className || ''].join(' ')}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span className={hover ? 'underline' : ''}>{t('logout')}</span>
    </Button>
  );
}
