'use client';

import React from 'react';
import { BookOpen, Calendar, LayoutDashboard, Loader2, SquareKanban, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import LogoutButton from '@/components/admin/auth/LogoutButton';
import Logo from '@/components/Logo';
import clsx from 'clsx';

type Item = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  labelKey: string;
  href: string;
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [pendingHref, setPendingHref] = React.useState<string | null>(null);

  const MAIN_ITEMS: Item[] = [
    { icon: SquareKanban, labelKey: 'dashboard', href: `/${locale}/admin/dashboard` },
    { icon: BookOpen, labelKey: 'event', href: `/${locale}/admin/event` },
    { icon: LayoutDashboard, labelKey: 'project', href: `/${locale}/admin/project` },
    { icon: Users, labelKey: 'boardmembers', href: `/${locale}/admin/boardmember` },
    { icon: Calendar, labelKey: 'calendar', href: `/${locale}/admin/schedule` },
  ];

  const isActive = (href: string) => pathname === href;

  const handleClick = (href: string) => {
    if (pendingHref === href) return;
    setPendingHref(href);
    router.push(href);
    if (window.innerWidth < 1024) onClose();
  };

  React.useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const isNavigating = pendingHref !== null;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-16 z-50 border-r border-primary-foreground/10 bg-primary transition-all duration-300 ease-in-out lg:top-0',
          'flex flex-col justify-between overflow-y-auto',
          'h-[calc(100vh-4rem)] lg:h-screen',
          isOpen ? 'w-60 sm:w-64' : 'w-20',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div
          className={clsx(
            'hidden shrink-0 items-center justify-center lg:flex',
            isOpen ? 'h-44 px-6 pt-8 pb-6' : 'h-24 px-2 py-4',
          )}
        >
          <Logo
            variant="admin"
            badge
            imageClassName={clsx(isOpen ? 'w-32 sm:w-32' : 'w-12 sm:w-12')}
          />
        </div>

        {/* Navigation */}
        <div
          className={clsx(
            'flex-1 overflow-y-auto',
            isOpen
              ? 'space-y-2 px-4 py-5'
              : 'space-y-3 px-3 py-4'
          )}
        >
          {MAIN_ITEMS.map(({ icon: Icon, labelKey, href }) => {
            const active = isActive(href);
            const pending = pendingHref === href;
            return (
              <button
                type="button"
                key={href}
                onClick={() => handleClick(href)}
                disabled={isNavigating}
                className={clsx(
                  'flex min-h-10 w-full items-center rounded-md transition-all duration-200 ease-out',
                  'text-[14px] font-medium',
                  'gap-3 px-3 py-2',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/40',
                  active
                    ? 'bg-primary-foreground/15 text-primary-foreground'
                    : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground',
                  isOpen ? 'justify-start' : 'justify-center',
                  isNavigating ? 'opacity-70' : ''
                )}
              >
                {pending ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                ) : (
                  <Icon className={clsx('h-5 w-5 shrink-0', active ? 'text-primary-foreground' : 'opacity-90')} />
                )}
                {isOpen && <span className="truncate">{t(labelKey)}</span>}
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div className={clsx('border-t border-primary-foreground/10', isOpen ? 'p-6' : 'p-3')}>
          <LogoutButton asSidebarItem isSidebarOpen={isOpen} tone="inverse" />
        </div>
      </aside>
    </>
  );
}
