import type { Metadata } from 'next';

import { site } from '@/config/site';

const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  authors: { name: site.name, url: site.url },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: '/',
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: { card: 'summary_large_image' },
};

export default metadata;
