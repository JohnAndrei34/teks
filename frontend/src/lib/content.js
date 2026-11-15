// Editable site copy. Branding is not final: change text here, not in components.
export const BRAND = {
  name: 'TEKS',
  full: 'TEKS: Tech, Entertainment & Kreative Stories',
  tagline: 'Collect Pinoy stories, one game at a time.',
  description:
    'TEKS is an online store for games made by Filipino developers: student teams, indie devs and studios.',
}

export const TEKS_STORY =
  'Teks were the paper game cards Filipino children collected, traded and played in school and on the streets. TEKS invites you to "collect" and "play" stories from Filipino games, carrying that childhood memory into the digital age.'

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

export const HOME_DEV_BANNER = {
  title: 'Make games? Sell them on TEKS.',
  body: 'Student teams, indie devs and studios are welcome. Share your Filipino story with players.',
  cta: 'Sell on TEKS',
}

export const STORE_SUBTITLE = 'Games by Filipino developers, for PC and mobile.'

// ---- Cart / checkout / order ----
export const CART_NOTE = 'Each game is a digital copy, bought once.'
export const DEMO_BANNER = 'Demo checkout — no real payment is processed.'

export const PAYMENT_METHODS = [
  { value: 'gcash', label: 'GCash', badge: 'GCash', hint: 'Pay with your GCash wallet' },
  { value: 'maya', label: 'Maya', badge: 'maya', hint: 'Pay with your Maya wallet' },
  { value: 'card', label: 'Credit/Debit Card', badge: 'CARD', hint: 'Visa or Mastercard' },
]
export const PAYMENT_LABELS = Object.fromEntries(PAYMENT_METHODS.map((m) => [m.value, m.label]))

// ---- Sell on TEKS ----
export const SELL = {
  title: 'Sell your game to Filipino players',
  subtitle: 'For student teams, indie developers and small studios making games in the Philippines.',
  benefits: (share) => [
    { title: 'A Filipino audience', body: 'Players come to TEKS looking for games made by and for Filipinos.' },
    {
      title: share ? `${share}% revenue share` : 'Fair revenue share',
      body: 'You keep the lion\'s share of every sale. We keep the rest to run the store.',
    },
    { title: 'Pinoy Collections spotlight', body: 'Folklore, traditional games, history and everyday-life titles get featured collections.' },
    { title: 'Open to student teams', body: 'Capstone and org projects are welcome. Your first release can start here.' },
  ],
  steps: [
    { title: 'Submit', body: 'Fill in the form with your game and a build link.' },
    { title: 'Review', body: 'We check the build and the details, and reach out if we need anything.' },
    { title: 'Go live', body: 'Your game gets a store page and a place in the catalog.' },
  ],
  faq: [
    { q: 'Are there any fees?', a: '(placeholder) There is no listing fee. TEKS keeps the share not paid to developers. Final terms will be shared before you go live.' },
    { q: 'What games qualify?', a: '(placeholder) Games made by Filipino developers, or games with a Filipino theme. Both finished and early-access titles may be considered.' },
    { q: 'How long does review take?', a: '(placeholder) Usually about a week. We will email you when there is an update.' },
    { q: 'Can student projects be submitted?', a: 'Yes. Student teams are a core part of TEKS. Capstone, thesis and org projects are all welcome.' },
  ],
}

// ---- About ----
export const MISSION =
  'TEKS is committed to empowering Filipino game developers by providing an accessible and dedicated marketplace where they can showcase and sell their games, while giving Filipino players the opportunity to discover, purchase and enjoy their creations. Through TEKS, we aim to promote Filipino culture and creativity while supporting the growth of the local game development industry.'
export const VISION =
  "TEKS aspires to become one of the leading online marketplaces for Filipino games: the first choice of players searching for Filipino indie games, and a trusted home for game developers, from student creators to established studios, where they can develop their craft and thrive. We look toward a future where Filipino games and their stories are widely recognized, supported and enjoyed in the Philippines and around the world, helping the local game development industry grow into a significant part of the nation's creative economy."
export const OBJECTIVES = [
  'Provide Filipino game developers, including independent studios, small teams and student developers, a platform where they can showcase and sell their games.',
  'Make Filipino games easier for players to discover by gathering them in one dedicated website.',
  'Present each game with clear and complete information (title, description, price, images and developer) so players can make informed choices.',
  'Offer a simple and convenient purchasing process suited to Filipino consumers.',
  'Promote Filipino culture and creativity by featuring games inspired by Filipino folklore, history, traditions and everyday life.',
]
export const AUDIENCES = [
  { title: 'Players', body: 'Find games that feel like home, on PC and mobile.' },
  { title: 'Developers', body: 'Reach players and earn a fair share of each sale.' },
  { title: 'Content Creators', body: 'Discover fresh Filipino games to play and share with your audience.' },
  { title: 'Gaming Communities & Esports', body: 'Find games for community nights, events and tournaments.' },
  { title: 'Game-Dev Students', body: 'See what local developers are making, and publish your own.' },
]
export const TEAM = [
  { name: 'Jessie Jean Santos', role: 'Business Concept & Planning' },
  { name: 'Andrea Salvanera (Dea)', role: 'Branding, Content & Website Development' },
  { name: 'John Andrei Sumilang (Drei)', role: 'Website Development' },
  { name: 'Crisha Mae Malubay', role: 'Marketing Strategy' },
  { name: 'Jedrick Calabano', role: 'Marketing & Financial Planning' },
  { name: 'Elaiza Belle Pitas', role: 'Business Impact & Financial Planning' },
  { name: 'Ramielle Antonette Orbeta', role: 'Promotional Video & Presentation' },
]

// ---- Contact ----
export const INQUIRY_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'developer', label: 'I\'m a developer' },
  { value: 'creator', label: 'Content creator: review keys / features' },
  { value: 'community', label: 'Gaming community / esports event' },
  { value: 'school', label: 'School / student' },
]
export const CONTACT = { email: 'hello@teks.example (placeholder)' }
