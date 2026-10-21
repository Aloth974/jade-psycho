// Single source of truth for the practice's public details.
// Used by the footer, social links, page metadata and JSON-LD.
export const site = {
  name: 'Jade Techer',
  jobTitle: 'Psychopraticienne', // not "psychologue", which is a protected title
  title: 'Jade Techer – Psychopraticienne à Orange (84)',
  description:
    'Jade Techer, psychopraticienne à Orange (84100) : accompagnement thérapeutique des enfants, adolescents et adultes, formations et analyse de pratiques professionnelles.',
  url: 'https://www.jade-psycho.fr',
  locale: 'fr_FR',
  areaServed: 'Orange (84100)',
  email: 'jade.techer.psycho@gmail.com',
  phone: {
    display: '07 59 60 30 77',
    e164: '+33759603077',
  },
  socials: {
    facebook: 'https://www.facebook.com/profile.php?id=61572511209865',
    instagram: 'https://www.instagram.com/jade_psychoprat/',
  },
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '17:00' },
    { days: ['Friday'], opens: '09:00', closes: '16:00' },
  ],
} as const;
