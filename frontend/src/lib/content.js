// Editable site copy. Branding is not final: change text here, not in components.
export const BRAND = {
  name: 'TEKS',
  full: 'TEKS: Tech, Entertainment & Kreative Stories',
  tagline: 'Collect Pinoy stories, one game at a time.',
  description:
    'TEKS is an online store for games made by Filipino developers: student teams, indie devs and studios.',
}

export const TEKS_STORY =
  'Remember teks cards? Kids all over the Philippines collected, traded and flipped those little paper cards in the street. TEKS brings that spirit online: every game here is a story from a Filipino developer, and every purchase adds one to your collection.'

export const GENRES = ['RPG', 'Horror', 'Simulation', 'Casual', 'Strategy']

export const PLATFORMS = ['PC', 'Mobile']

// Static list so navigation works before the API answers. Full details come from GET /collections.
export const COLLECTION_LINKS = [
  { slug: 'folklore', title: 'Folklore' },
  { slug: 'traditional-games', title: 'Traditional Games' },
  { slug: 'history', title: 'History' },
  { slug: 'everyday-life', title: 'Everyday Life' },
]

export const COLLECTION_TITLES = Object.fromEntries(COLLECTION_LINKS.map((c) => [c.slug, c.title]))

export const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
]

export const DEVELOPER_TYPES = {
  student: 'Student Team',
  indie: 'Indie',
  studio: 'Studio',
}

export const WHY_TEKS = {
  home: { title: 'One home for Filipino games', body: 'Find games by Filipino students, indies and studios in one place, not scattered across the internet.' },
  platforms: { title: 'Play on PC & mobile', body: 'Pick the games that fit your phone or your computer. Platforms are shown on every game.' },
  fairShare: (percent) => ({
    title: 'Fair share for developers',
    body: percent
      ? `${percent}% of every sale goes directly to the developer who made the game.`
      : 'A fair share of every sale goes directly to the developer who made the game.',
  }),
}

export const SOCIALS = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
]

export const FOOTER_YEAR = 2026
