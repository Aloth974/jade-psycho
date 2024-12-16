const richSnippetData = {
  "@context": "https://schema.org",
  "@type": "Psycho",
  "image": [
    "https://example.com/photos/1x1/photo.jpg",
    "https://example.com/photos/4x3/photo.jpg",
    "https://example.com/photos/16x9/photo.jpg"
  ],
  "name": "Jade Psycho",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "21 cours Aristide Briand",
    "addressLocality": "Orange",
    "addressRegion": "Orange",
    "postalCode": "84100",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 44.13581162113809,
    "longitude": 4.804875897495294
  },
  "url": "https://www.jade-psycho.fr",
  "telephone": "0759 60 30 77",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday"
      ],
      "opens": "09:00",
      "closes": "17:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Friday",
      "opens": "09:00",
      "closes": "16:00"
    }
  ]
};

// See https://developers.google.com/search/docs/appearance/structured-data/local-business
export default function RichSnippet() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(richSnippetData) }}>
    </script>
  );
}
