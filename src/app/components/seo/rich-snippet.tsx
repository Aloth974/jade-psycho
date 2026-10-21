import { site } from '@/config/site';

const richSnippetData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/opengraph-image.jpg`,
  telephone: site.phone.e164,
  email: site.email,
  areaServed: site.areaServed,
  sameAs: Object.values(site.socials),
  founder: {
    '@type': 'Person',
    name: site.name,
    jobTitle: site.jobTitle,
  },
  openingHoursSpecification: site.openingHours.map(({ days, opens, closes }) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: days,
    opens,
    closes,
  })),
};

// See https://developers.google.com/search/docs/appearance/structured-data/local-business
export default function RichSnippet() {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag early
      dangerouslySetInnerHTML={{ __html: JSON.stringify(richSnippetData).replace(/</g, '\\u003c') }}
    />
  );
}
