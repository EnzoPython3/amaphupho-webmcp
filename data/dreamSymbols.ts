export interface DreamSymbol {
  english: string;
  zulu: string;
  meaning: string;
  slug: string;
  expanded: string;
  related: string[];
  category: 'animal' | 'nature' | 'person' | 'object' | 'place' | 'colour' | 'action' | 'food' | 'spiritual';
}

const dreamSymbols: DreamSymbol[] = [
  {
    english: 'Ancestors',
    zulu: 'Amadlozi',
    meaning: 'Dreaming of ancestors signals spiritual guidance or a calling. The amadlozi may be delivering a message, warning, or blessing.',
    slug: 'ancestors',
    expanded: 'Ancestors in dreams can represent guidance, family responsibility, ritual acknowledgement, and connection between the living and departed.',
    related: ['Traditional Healer', 'White', 'Candle', 'Snake'],
    category: 'spiritual',
  },
  {
    english: 'Snake',
    zulu: 'Inyoka',
    meaning: 'Snakes are among the most significant dream symbols in African culture. They can represent ancestors returning in spirit form, protection, healing, hidden danger, or spiritual attack depending on context.',
    slug: 'snakes',
    expanded: 'The type, colour, behaviour, and location of a snake shape its interpretation. A snake entering a home can suggest ancestral presence, while a threatening snake can signal danger or conflict.',
    related: ['Ancestors', 'Traditional Healer', 'Water', 'Green'],
    category: 'animal',
  },
  {
    english: 'Water',
    zulu: 'Amanzi',
    meaning: 'Water can represent cleansing, emotion, spiritual depth, transition, and connection with water spirits.',
    slug: 'water',
    expanded: 'Clear water often suggests cleansing or clarity. Troubled water can reflect emotional or spiritual uncertainty. Context and movement matter.',
    related: ['River', 'Ocean', 'Snake', 'Ancestors'],
    category: 'nature',
  },
  {
    english: 'Beads',
    zulu: 'Ubuhlalu',
    meaning: 'Beads represent spiritual identity, cultural heritage, ancestral connection, and messages carried through colour and pattern.',
    slug: 'beads',
    expanded: 'Beads can point to cultural identity, spiritual responsibility, ceremony, and the symbolism of specific colours.',
    related: ['Ancestors', 'White', 'Red', 'Traditional Healer'],
    category: 'object',
  },
  {
    english: 'Candle',
    zulu: 'Ikhandlela',
    meaning: 'A candle can symbolise spiritual illumination, prayer, guidance, and communication with ancestors.',
    slug: 'candle',
    expanded: 'A burning candle can suggest guidance and spiritual presence. An extinguished candle can suggest neglect, uncertainty, or fading hope.',
    related: ['Ancestors', 'White', 'Prayer'],
    category: 'spiritual',
  }
];

export default dreamSymbols;
