'use client';

import HeroSectionView from '@/view/HeroSectionView';
import NewsletterSubscriptionView from '@/view/NewsletterSubscriptionView';
import UpcomingEventsView from '@/view/UpcomingEventsView';

export default function HomePagePresenter() {
  return (
    <>
      <div>
       <HeroSectionView />
      </div>
      <UpcomingEventsView />
      <NewsletterSubscriptionView />
    </>
  );
}
