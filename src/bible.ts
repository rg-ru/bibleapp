export type TranslationCode =
  | 'kjv'
  | 'ylt'
  | 'darby'
  | 'asv'
  | 'bbe'
  | 'drc'
  | 'geneva1599'
  | 'rotherham'
  | 'tyndale'
  | 'vulgate'
  | 'tr'
  | 'wlc';

export type Testament = 'old' | 'new';

export type TranslationScope = 'full' | 'old' | 'new';

export type TranslationDirection = 'ltr' | 'rtl';

export type BibleTranslation = {
  code: TranslationCode;
  abbreviation: string;
  name: string;
  language: string;
  year: string;
  coverage: string;
  scope: TranslationScope;
  direction: TranslationDirection;
};

export type BibleBook = {
  code: string;
  name: string;
  testament: Testament;
  chapterCount: number;
};

export type ChapterVerse = {
  verse: number;
  reference: string;
  text: string;
};

export type ChapterPayload = {
  _provider: string;
  translation: TranslationCode;
  book: string;
  book_code: string;
  testament: Testament;
  chapter: number;
  verses: ChapterVerse[];
};

export type VersePayload = ChapterVerse & {
  _provider: string;
  translation: TranslationCode;
  book: string;
  book_code: string;
  chapter: number;
  testament: Testament;
  prev: string | null;
  next: string | null;
};

type RawBookIndex = {
  _provider: string;
  translation: TranslationCode;
  books: Array<{
    code: string;
    name: string;
    testament: Testament;
  }>;
};

export type ReferenceTarget = {
  bookCode: string;
  chapter: number;
  verse?: number;
};

export const translations: BibleTranslation[] = [
  {
    code: 'kjv',
    abbreviation: 'KJV',
    name: 'King James Version',
    language: 'English',
    year: '1611',
    coverage: 'Full Bible',
    scope: 'full',
    direction: 'ltr',
  },
  {
    code: 'asv',
    abbreviation: 'ASV',
    name: 'American Standard Version',
    language: 'English',
    year: '1901',
    coverage: 'Full Bible',
    scope: 'full',
    direction: 'ltr',
  },
  {
    code: 'bbe',
    abbreviation: 'BBE',
    name: 'Bible in Basic English',
    language: 'English',
    year: '1964',
    coverage: 'Full Bible',
    scope: 'full',
    direction: 'ltr',
  },
  {
    code: 'darby',
    abbreviation: 'Darby',
    name: 'Darby Translation',
    language: 'English',
    year: '1867',
    coverage: 'Full Bible',
    scope: 'full',
    direction: 'ltr',
  },
  {
    code: 'drc',
    abbreviation: 'DRC',
    name: 'Douay-Rheims Challoner',
    language: 'English',
    year: '1899',
    coverage: 'Full Bible with deuterocanon',
    scope: 'full',
    direction: 'ltr',
  },
  {
    code: 'geneva1599',
    abbreviation: 'Geneva 1599',
    name: 'Geneva Bible',
    language: 'English',
    year: '1599',
    coverage: 'Full Bible',
    scope: 'full',
    direction: 'ltr',
  },
  {
    code: 'rotherham',
    abbreviation: 'Rotherham',
    name: 'Rotherham Emphasized Bible',
    language: 'English',
    year: '1902',
    coverage: 'Full Bible',
    scope: 'full',
    direction: 'ltr',
  },
  {
    code: 'ylt',
    abbreviation: 'YLT',
    name: "Young's Literal Translation",
    language: 'English',
    year: '1862',
    coverage: 'Full Bible',
    scope: 'full',
    direction: 'ltr',
  },
  {
    code: 'tyndale',
    abbreviation: 'Tyndale',
    name: 'Tyndale Bible',
    language: 'English',
    year: '1530',
    coverage: 'New Testament only',
    scope: 'new',
    direction: 'ltr',
  },
  {
    code: 'vulgate',
    abbreviation: 'Vulgate',
    name: 'Clementine Latin Vulgate',
    language: 'Latin',
    year: '1592',
    coverage: 'Full Bible with deuterocanon',
    scope: 'full',
    direction: 'ltr',
  },
  {
    code: 'tr',
    abbreviation: 'TR',
    name: 'Textus Receptus',
    language: 'Greek',
    year: '1550',
    coverage: 'New Testament only',
    scope: 'new',
    direction: 'ltr',
  },
  {
    code: 'wlc',
    abbreviation: 'WLC',
    name: 'Westminster Leningrad Codex',
    language: 'Hebrew',
    year: '2006',
    coverage: 'Old Testament only',
    scope: 'old',
    direction: 'rtl',
  },
];

export const defaultTranslation: TranslationCode = 'kjv';

export const standardChapterCounts: Record<string, number> = {
  GEN: 50,
  EXO: 40,
  LEV: 27,
  NUM: 36,
  DEU: 34,
  JOS: 24,
  JDG: 21,
  RUT: 4,
  '1SA': 31,
  '2SA': 24,
  '1KI': 22,
  '2KI': 25,
  '1CH': 29,
  '2CH': 36,
  EZR: 10,
  NEH: 13,
  EST: 10,
  JOB: 42,
  PSA: 150,
  PRO: 31,
  ECC: 12,
  SNG: 8,
  ISA: 66,
  JER: 52,
  LAM: 5,
  EZK: 48,
  DAN: 12,
  HOS: 14,
  JOL: 3,
  AMO: 9,
  OBA: 1,
  JON: 4,
  MIC: 7,
  NAH: 3,
  HAB: 3,
  ZEP: 3,
  HAG: 2,
  ZEC: 14,
  MAL: 4,
  MAT: 28,
  MRK: 16,
  LUK: 24,
  JHN: 21,
  ACT: 28,
  ROM: 16,
  '1CO': 16,
  '2CO': 13,
  GAL: 6,
  EPH: 6,
  PHP: 4,
  COL: 4,
  '1TH': 5,
  '2TH': 3,
  '1TI': 6,
  '2TI': 4,
  TIT: 3,
  PHM: 1,
  HEB: 13,
  JAS: 5,
  '1PE': 5,
  '2PE': 3,
  '1JN': 5,
  '2JN': 1,
  '3JN': 1,
  JUD: 1,
  REV: 22,
};

const catholicChapterCounts: Record<string, number> = {
  ...standardChapterCounts,
  EST: 16,
  DAN: 14,
  TOB: 14,
  JDT: 16,
  WIS: 19,
  SIR: 51,
  BAR: 6,
  '1MA': 16,
  '2MA': 15,
};

const bookAliases: Record<string, string[]> = {
  GEN: ['ge', 'gn'],
  EXO: ['ex'],
  LEV: ['le', 'lv'],
  NUM: ['nu', 'nm'],
  DEU: ['deut', 'dt'],
  JOS: ['josh'],
  JDG: ['judg', 'judges'],
  RUT: ['ruth'],
  '1SA': ['1 sam', '1sam', 'first samuel'],
  '2SA': ['2 sam', '2sam', 'second samuel'],
  '1KI': ['1 kgs', '1kgs', '1 kings', 'first kings'],
  '2KI': ['2 kgs', '2kgs', '2 kings', 'second kings'],
  '1CH': ['1 chr', '1chr', '1 chronicles', 'first chronicles'],
  '2CH': ['2 chr', '2chr', '2 chronicles', 'second chronicles'],
  PSA: ['ps', 'psalm', 'psalms'],
  PRO: ['prov', 'prv'],
  ECC: ['eccl', 'qoh'],
  SNG: ['song', 'song of songs', 'canticles'],
  ISA: ['isa'],
  JER: ['jer'],
  EZK: ['eze', 'ezek'],
  DAN: ['dan'],
  OBA: ['obad'],
  JON: ['jonah'],
  NAH: ['nah'],
  MAL: ['mal'],
  MAT: ['mt', 'matt'],
  MRK: ['mk', 'mark'],
  LUK: ['lk', 'luke'],
  JHN: ['jn', 'john'],
  ACT: ['acts'],
  ROM: ['rom'],
  '1CO': ['1 cor', '1cor', 'first corinthians'],
  '2CO': ['2 cor', '2cor', 'second corinthians'],
  EPH: ['eph'],
  PHP: ['phil', 'php'],
  COL: ['col'],
  '1TH': ['1 thess', '1thess', 'first thessalonians'],
  '2TH': ['2 thess', '2thess', 'second thessalonians'],
  '1TI': ['1 tim', '1tim', 'first timothy'],
  '2TI': ['2 tim', '2tim', 'second timothy'],
  PHM: ['philem'],
  HEB: ['heb'],
  JAS: ['jam', 'james'],
  '1PE': ['1 pet', '1pet', 'first peter'],
  '2PE': ['2 pet', '2pet', 'second peter'],
  '1JN': ['1 john', '1john', 'first john'],
  '2JN': ['2 john', '2john', 'second john'],
  '3JN': ['3 john', '3john', 'third john'],
  REV: ['revelation', 'apocalypse'],
};

function endpoint(translation: TranslationCode, path: string) {
  return `https://bible-${translation}.originsapi.com/${path}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Bible request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getTranslation(code: TranslationCode) {
  return translations.find((translation) => translation.code === code) ?? translations[0];
}

export function getChapterCount(translation: TranslationCode, bookCode: string) {
  if (translation === 'drc' || translation === 'vulgate') {
    return catholicChapterCounts[bookCode] ?? standardChapterCounts[bookCode] ?? 1;
  }

  return standardChapterCounts[bookCode] ?? 1;
}

export function getChapterNumbers(translation: TranslationCode, bookCode: string) {
  const count = getChapterCount(translation, bookCode);
  return Array.from({ length: count }, (_, index) => index + 1);
}

export function canReadTestament(translation: BibleTranslation, testament: Testament) {
  return translation.scope === 'full' || translation.scope === testament;
}

export async function fetchBookIndex(translation: TranslationCode): Promise<BibleBook[]> {
  const data = await fetchJson<RawBookIndex>(endpoint(translation, 'index.json'));

  return data.books.map((book) => ({
    ...book,
    chapterCount: getChapterCount(translation, book.code),
  }));
}

export async function fetchChapter(translation: TranslationCode, bookCode: string, chapter: number) {
  return fetchJson<ChapterPayload>(endpoint(translation, `${bookCode}.${chapter}.json`));
}

export async function fetchVerse(
  translation: TranslationCode,
  bookCode: string,
  chapter: number,
  verse: number,
) {
  return fetchJson<VersePayload>(endpoint(translation, `${bookCode}.${chapter}.${verse}.json`));
}

export function formatReference(book: BibleBook | undefined, chapter: number, verse?: number) {
  const bookName = book?.name ?? 'Bible';
  return verse ? `${bookName} ${chapter}:${verse}` : `${bookName} ${chapter}`;
}

export function parseReference(input: string, books: BibleBook[], translation: TranslationCode) {
  const query = input.trim().toLowerCase();

  if (!query) {
    return null;
  }

  const candidates = books
    .flatMap((book) => {
      const labels = [book.name, book.code, ...(bookAliases[book.code] ?? [])];
      return labels.map((label) => ({ book, label: label.toLowerCase() }));
    })
    .sort((left, right) => right.label.length - left.label.length);

  for (const candidate of candidates) {
    if (!query.startsWith(candidate.label)) {
      continue;
    }

    const rest = query.slice(candidate.label.length);
    const match = rest.match(/^[\s.:-]+(\d+)(?:[\s.:,-]+(\d+))?/);

    if (!match) {
      continue;
    }

    const chapterCount = getChapterCount(translation, candidate.book.code);
    const chapter = clampNumber(Number(match[1]), 1, chapterCount);
    const verse = match[2] ? Math.max(1, Number(match[2])) : undefined;

    return {
      bookCode: candidate.book.code,
      chapter,
      verse,
    } satisfies ReferenceTarget;
  }

  return null;
}

export function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}
