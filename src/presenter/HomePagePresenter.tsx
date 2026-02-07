'use client';

import HeroSectionView from '@/view/HeroSectionView';
import Ticket from '@/components/Ticket';
import NewsletterSubscriptionView from '@/view/NewsletterSubscriptionView';

export default function HomePagePresenter() {
  return (
    <>
      <div>
       <HeroSectionView />
      </div>
      <main className="min-h-screen w-full bg-(--blue-soft-2) flex items-center justify-center">
        <Ticket title="TITLE 1" description="Short description for ticket 1." />
      </main>
      <NewsletterSubscriptionView />
    </>
  );
}
