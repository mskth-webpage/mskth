'use client';

import CommunitySectionView from '@/view/CommunitySectionView';
import HeroSectionView from '@/view/HeroSectionView';
import NewsletterSubscriptionView from '@/view/NewsletterSubscriptionView';
import UpcomingEventsView from '@/view/UpcomingEventsView';

export default function HomePagePresenter() {
  return (
    <>
      <HeroSectionView />
      <CommunitySectionView />
      <UpcomingEventsView />
      <NewsletterSubscriptionView />
    </>
  );
}
