'use client';

import { useState } from 'react';
import Sidebar from '@/view/admin/sidebarView';
import Topbar from '@/components/admin/auth/Topbar';
import SwrProvider from '@/components/admin/SwrProvider';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
};

export default function AdminLayoutView({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });

  return (
    <SwrProvider>
      <div className="min-h-screen bg-background">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
        />

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main
          className={clsx(
            'pt-16 transition-[padding-left] duration-300 ease-in-out',
            isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
          )}
        >
          {children}
        </main>
      </div>
    </SwrProvider>
  );
}
