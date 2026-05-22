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

export const libraryResources: LibraryResource[] = [
  {
    id: 'study-bible',
    title: 'Public-Domain Corpus',
    author: 'OriginsAPI',
    type: 'Bible Texts',
    focus: 'Twelve legal translations and source texts',
    color: '#2f6f73',
  },
  {
    id: 'commentary',
    title: 'Licensed Translation Layer',
    author: 'API.Bible-ready',
    type: 'Roadmap',
    focus: 'Provider boundary for NIV, ESV, NASB, NLT, and more',
    color: '#b75c36',
  },
  {
    id: 'wordbook',
    title: 'Parallel Reader',
    author: 'Lumen Study',
    type: 'Comparison',
    focus: 'Compare selected verses across available texts',
    color: '#5368a6',
  },
  {
    id: 'atlas',
    title: 'Search Index',
    author: 'Lumen Library',
    type: 'Next backend',
    focus: 'Full-corpus search belongs server-side',
    color: '#879b4d',
  },
];

export const initialNotes: StudyNote[] = [
  {
    id: 'note-1',
    reference: 'JHN.3.16',
    verse: 16,
    body: 'This is the first real data version: notes are keyed to live Bible references.',
    tag: 'Observation',
  },
  {
    id: 'note-2',
    reference: 'PSA.23.1',
    verse: 1,
    body: 'Keep licensed modern translations behind a provider contract, not copied into Git.',
    tag: 'Build',
  },
];
