export type Verse = {
  id: string;
  number: number;
  text: string;
  keywords: string[];
};

export type Passage = {
  id: string;
  reference: string;
  book: string;
  theme: string;
  overview: string;
  translation: string;
  verses: Verse[];
  crossRefs: string[];
  wordStudy: {
    word: string;
    transliteration: string;
    meaning: string;
  };
  commentary: string[];
};

export type LibraryResource = {
  id: string;
  title: string;
  author: string;
  type: string;
  focus: string;
  color: string;
};

export type StudyNote = {
  id: string;
  reference: string;
  verse: number;
  body: string;
  tag: string;
};

export const passages: Passage[] = [
  {
    id: 'john-1',
    reference: 'John 1:1-5',
    book: 'John',
    theme: 'The Word brings life and light',
    overview:
      'John opens by placing Jesus before creation, then connects him to life, light, and the darkness that cannot overcome him.',
    translation: 'World English Bible',
    verses: [
      {
        id: 'john-1-1',
        number: 1,
        text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
        keywords: ['beginning', 'Word', 'God'],
      },
      {
        id: 'john-1-2',
        number: 2,
        text: 'The same was in the beginning with God.',
        keywords: ['beginning', 'with God'],
      },
      {
        id: 'john-1-3',
        number: 3,
        text: 'All things were made through him. Without him, nothing was made that has been made.',
        keywords: ['made', 'creation', 'through him'],
      },
      {
        id: 'john-1-4',
        number: 4,
        text: 'In him was life, and the life was the light of men.',
        keywords: ['life', 'light'],
      },
      {
        id: 'john-1-5',
        number: 5,
        text: 'The light shines in the darkness, and the darkness has not overcome it.',
        keywords: ['light', 'darkness', 'overcome'],
      },
    ],
    crossRefs: ['Genesis 1:1', 'Colossians 1:15-17', 'Hebrews 1:1-3'],
    wordStudy: {
      word: 'Logos',
      transliteration: 'logos',
      meaning:
        'Word, message, reason, or self-expression. In John 1 it presents Jesus as God made known.',
    },
    commentary: [
      'The prologue starts before history, echoing Genesis and presenting creation through the Son.',
      'Light and darkness give the passage a strong contrast: revelation and life stand against resistance.',
      'The repeated phrase "with God" keeps relationship in view while the passage also states deity plainly.',
    ],
  },
  {
    id: 'psalm-23',
    reference: 'Psalm 23:1-6',
    book: 'Psalms',
    theme: 'God shepherds his people',
    overview:
      'The psalm moves from provision and guidance into protection, honor, and lasting fellowship with the Lord.',
    translation: 'World English Bible',
    verses: [
      {
        id: 'psalm-23-1',
        number: 1,
        text: 'Yahweh is my shepherd: I shall lack nothing.',
        keywords: ['shepherd', 'provision'],
      },
      {
        id: 'psalm-23-2',
        number: 2,
        text: 'He makes me lie down in green pastures. He leads me beside still waters.',
        keywords: ['rest', 'waters', 'guidance'],
      },
      {
        id: 'psalm-23-3',
        number: 3,
        text: "He restores my soul. He guides me in the paths of righteousness for his name's sake.",
        keywords: ['restores', 'righteousness'],
      },
      {
        id: 'psalm-23-4',
        number: 4,
        text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me.',
        keywords: ['fear', 'with me', 'valley'],
      },
      {
        id: 'psalm-23-5',
        number: 5,
        text: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil. My cup runs over.',
        keywords: ['table', 'anoint', 'cup'],
      },
      {
        id: 'psalm-23-6',
        number: 6,
        text: "Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in Yahweh's house forever.",
        keywords: ['goodness', 'loving kindness', 'forever'],
      },
    ],
    crossRefs: ['John 10:11', 'Ezekiel 34:11-16', 'Revelation 7:17'],
    wordStudy: {
      word: 'Raah',
      transliteration: 'raah',
      meaning:
        'To shepherd, feed, or tend. The image includes care, leadership, and protection.',
    },
    commentary: [
      'The first half speaks about God; the middle turns to God directly, making the psalm more intimate.',
      'The table image changes the scene from wilderness danger to honored welcome.',
      "The psalm is not absence of danger, but confidence in the Lord's presence through danger.",
    ],
  },
  {
    id: 'romans-8',
    reference: 'Romans 8:1-4',
    book: 'Romans',
    theme: 'Life in the Spirit',
    overview:
      'Paul announces freedom from condemnation and explains that God accomplished what the law could not do.',
    translation: 'World English Bible',
    verses: [
      {
        id: 'romans-8-1',
        number: 1,
        text: "There is therefore now no condemnation to those who are in Christ Jesus, who don't walk according to the flesh, but according to the Spirit.",
        keywords: ['condemnation', 'Christ Jesus', 'Spirit'],
      },
      {
        id: 'romans-8-2',
        number: 2,
        text: 'For the law of the Spirit of life in Christ Jesus made me free from the law of sin and of death.',
        keywords: ['Spirit', 'life', 'free'],
      },
      {
        id: 'romans-8-3',
        number: 3,
        text: "For what the law couldn't do, in that it was weak through the flesh, God did, sending his own Son in the likeness of sinful flesh and for sin.",
        keywords: ['law', 'God did', 'Son'],
      },
      {
        id: 'romans-8-4',
        number: 4,
        text: 'He condemned sin in the flesh, that the ordinance of the law might be fulfilled in us, who walk not after the flesh, but after the Spirit.',
        keywords: ['fulfilled', 'walk', 'Spirit'],
      },
    ],
    crossRefs: ['Romans 5:1', 'Galatians 5:16-25', '2 Corinthians 3:17'],
    wordStudy: {
      word: 'Katakrima',
      transliteration: 'katakrima',
      meaning:
        "A sentence or condemnation. Paul uses it to frame the believer's new standing in Christ.",
    },
    commentary: [
      "The phrase \"therefore now\" connects the declaration to Paul's earlier argument about union with Christ.",
      'The contrast is not merely law versus grace, but the weakness of flesh versus the life of the Spirit.',
      "Paul grounds assurance in God's action through the Son, not in human effort.",
    ],
  },
];

export const libraryResources: LibraryResource[] = [
  {
    id: 'study-bible',
    title: 'Study Bible Notes',
    author: 'Lumen Library',
    type: 'Study Bible',
    focus: 'Fast background for the selected passage',
    color: '#2f6f73',
  },
  {
    id: 'commentary',
    title: 'Concise Commentary',
    author: 'Lumen Library',
    type: 'Commentary',
    focus: 'Paragraph-level observations',
    color: '#b75c36',
  },
  {
    id: 'wordbook',
    title: 'Bible Wordbook',
    author: 'Lumen Library',
    type: 'Lexicon',
    focus: 'Original-language summaries',
    color: '#5368a6',
  },
  {
    id: 'atlas',
    title: 'Scripture Atlas',
    author: 'Lumen Library',
    type: 'Reference',
    focus: 'People, places, and movement',
    color: '#879b4d',
  },
];

export const initialNotes: StudyNote[] = [
  {
    id: 'note-1',
    reference: 'John 1:1-5',
    verse: 5,
    body: 'Light is active here: it shines before darkness responds.',
    tag: 'Observation',
  },
  {
    id: 'note-2',
    reference: 'Psalm 23:1-6',
    verse: 4,
    body: 'The pronouns shift from "he" to "you" when the valley appears.',
    tag: 'Structure',
  },
];
