'use client';

import HomePageView from '../view/homepageView';
import Ticket from '@/src/components/Ticket';

export default function HomePagePresenter() {
  return (
    <>
      <div>
        <HomePageView />
      </div>
      <main className="min-h-screen w-full bg-[#8ECAFF] flex items-center justify-center">
        <Ticket title="TITLE 1" description="Short description for ticket 1." />
      </main>
    </>
  );
}
