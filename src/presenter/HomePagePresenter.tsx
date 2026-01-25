'use client';

import HeroSectionView from '@/view/HeroSectionView';
import NewsletterSubscriptionView from '@/view/NewsletterSubscriptionView';

export default function HomePagePresenter() {
  return (
    <div>
      <HeroSectionView />
      <NewsletterSubscriptionView />
    </div>
  );
}
