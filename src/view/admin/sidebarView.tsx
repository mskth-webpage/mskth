'use client';

import React, { Suspense } from 'react';
import { BookOpen, Calendar, LayoutDashboard, Loader2, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import LogoutButton from '@/components/admin/auth/LogoutButton';
import clsx from 'clsx';

type Item = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  labelKey: string;
  section: string;
  href: string;
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Sidebar component for the admin dashboard area. It includes navigation links and a logout button.
 * It is responsive and can be toggled open or closed.
 */
function SidebarContent({ isOpen, onClose }: SidebarProps) {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [pendingHref, setPendingHref] = React.useState<string | null>(null);

  const MAIN_ITEMS: Item[] = [
    { icon: BookOpen, labelKey: 'event', section: 'event', href: `/${locale}/admin/event` },
    { icon: LayoutDashboard, labelKey: 'project', section: 'project', href: `/${locale}/admin/project` },
    {
      icon: Users,
      labelKey: 'boardmembers',
      section: 'boardmembers',
      href: `/${locale}/admin/boardmembers`,
    },
    { icon: Calendar, labelKey: 'calendar', section: 'calendar', href: `/${locale}/admin/calendar` },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

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
          'fixed top-16 left-0 z-50 border-r border-border bg-card transition-all duration-300 ease-in-out',
          'flex flex-col justify-between overflow-y-auto',
          'h-[calc(100vh-4rem)]',
          isOpen ? 'w-60 sm:w-64' : 'w-20',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Navigation */}
        <div
          className={clsx(
            'flex-1 overflow-y-auto',
            'p-3 sm:p-4 space-y-1 sm:space-y-2'
          )}
        >
          {MAIN_ITEMS.map(({ icon: Icon, labelKey, section, href }) => {
            const active = isActive(href);
            const pending = pendingHref === href;
            return (
              <button
                type="button"
                key={href}
                onClick={() => handleClick(href)}
                disabled={isNavigating}
                className={clsx(
                  'flex items-center w-full rounded-md transition-colors',
                  'text-sm sm:text-[13px] font-medium',
                  'px-2.5 sm:px-3 py-2 sm:py-2.5 gap-2 sm:gap-3',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                  isNavigating ? 'opacity-70' : ''
                )}
              >
                {pending ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                )}
                {isOpen && <span className="truncate">{t(labelKey)}</span>}
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div className="p-3 sm:p-4 border-t border-border">
          <LogoutButton asSidebarItem isSidebarOpen={isOpen} />
        </div>

      </aside>
    </>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <Suspense fallback={null}>
      <SidebarContent isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
}
