import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'sv'],
  defaultLocale: 'sv',
});

export const { Link, useRouter, usePathname } = createNavigation(routing);