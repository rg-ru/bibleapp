import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Brain,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Highlighter,
  Library,
  ListChecks,
  MessageSquareText,
  PenLine,
  Search,
  Sparkles,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BibleBook,
  ChapterPayload,
  ChapterVerse,
  TranslationCode,
  VersePayload,
  canReadTestament,
  clampNumber,
  defaultTranslation,
  fetchBookIndex,
  fetchChapter,
  fetchVerse,
  formatReference,
  getChapterNumbers,
  getTranslation,
  parseReference,
  translations,
} from './bible';
import studyDesk from './assets/bible-study.jpg';
import { initialNotes, libraryResources, StudyNote } from './data';

const lensOptions = ['Context', 'Words', 'Parallel'] as const;
const notesKey = 'lumen:bible-notes';

type Lens = (typeof lensOptions)[number];

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

function loadNotes() {
  try {
    const savedNotes = window.localStorage.getItem(notesKey);
    return savedNotes ? (JSON.parse(savedNotes) as StudyNote[]) : initialNotes;
  } catch {
    return initialNotes;
  }
}

function getSignificantWords(text: string) {
  const stopWords = new Set([
    'about',
    'after',
    'again',
    'also',
    'and',
    'are',
    'because',
    'before',
    'but',
    'for',
    'from',
    'hath',
    'have',
    'him',
    'his',
    'into',
    'not',
    'shall',
    'that',
    'the',
    'their',
    'them',
    'there',
    'they',
    'this',
    'thou',
    'unto',
    'was',
    'were',
    'which',
    'with',
    'you',
  ]);

  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z\s]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 3 && !stopWords.has(word)),
    ),
  ).slice(0, 10);
}

function buildAssistantResponse(
  query: string,
  translationName: string,
  reference: string,
  verse: ChapterVerse | undefined,
  chapterData: ChapterPayload | null,
) {
  if (!verse || !chapterData) {
    return 'Load a chapter first, then ask against the selected verse.';
  }

  const normalized = query.trim().toLowerCase();
  const words = getSignificantWords(verse.text).slice(0, 5);

  if (normalized.includes('outline') || normalized.includes('sermon')) {
    return `${reference}: start with the chapter setting, trace the movement around verse ${verse.verse}, compare repeated terms, then state the main claim in one sentence.`;
  }

  if (normalized.includes('word') || normalized.includes('keyword')) {
    return words.length
      ? `${reference} has these study terms worth checking: ${words.join(', ')}.`
      : `${reference} has no obvious repeated study terms in the current verse text.`;
  }

  if (normalized.includes('context')) {
    return `${reference} sits inside ${chapterData.book} ${chapterData.chapter}, a chapter with ${chapterData.verses.length} verses in ${translationName}. Read the verse before and after before building doctrine from it.`;
  }

  return `${reference} in ${translationName}: ${verse.text}`;
}

function getParallelCodes(current: TranslationCode, selectedBook: BibleBook | undefined) {
  if (!selectedBook) {
    return [current];
  }

  const baseline: TranslationCode[] =
    selectedBook.testament === 'old'
      ? ['kjv', 'asv', 'ylt', 'wlc', 'vulgate']
      : ['kjv', 'asv', 'ylt', 'tr', 'vulgate'];

  return Array.from(new Set([current, ...baseline]))
    .filter((code) => canReadTestament(getTranslation(code), selectedBook.testament))
    .slice(0, 5);
}

export function App() {
  const [translationCode, setTranslationCode] = useState<TranslationCode>(defaultTranslation);
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [bookCode, setBookCode] = useState('JHN');
  const [chapter, setChapter] = useState(3);
  const [activeVerseNumber, setActiveVerseNumber] = useState(16);
  const [activeLens, setActiveLens] = useState<Lens>('Context');
  const [lookup, setLookup] = useState('John 3:16');
  const [assistantPrompt, setAssistantPrompt] = useState('Give me context');
  const [assistantAnswer, setAssistantAnswer] = useState('');
  const [notes, setNotes] = useState<StudyNote[]>(loadNotes);
  const [noteDraft, setNoteDraft] = useState('');
  const [indexState, setIndexState] = useState<LoadState>('idle');
  const [chapterState, setChapterState] = useState<LoadState>('idle');
  const [chapterData, setChapterData] = useState<ChapterPayload | null>(null);
  const [parallelVerses, setParallelVerses] = useState<Array<{ code: TranslationCode; verse: VersePayload }>>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const translation = getTranslation(translationCode);
  const selectedBook = books.find((book) => book.code === bookCode);
  const chapterNumbers = selectedBook ? getChapterNumbers(translationCode, selectedBook.code) : [chapter];
  const activeVerse = chapterData?.verses.find((verse) => verse.verse === activeVerseNumber);
  const currentReference = formatReference(selectedBook, chapter, activeVerse?.verse);
  const savedReference = `${bookCode}.${chapter}.${activeVerseNumber}`;
  const bookPosition = Math.max(books.findIndex((book) => book.code === bookCode) + 1, 1);
  const libraryProgress = books.length ? (bookPosition / books.length) * 100 : 0;

  const chapterMatches = useMemo(() => {
    const query = lookup.trim().toLowerCase();

    if (!chapterData) {
      return [];
    }

    if (!query || parseReference(query, books, translationCode)) {
      return chapterData.verses.slice(0, 6);
    }

    return chapterData.verses
      .filter((verse) => {
        const reference = `${chapterData.book} ${chapterData.chapter}:${verse.verse}`.toLowerCase();
        return verse.text.toLowerCase().includes(query) || reference.includes(query);
      })
      .slice(0, 8);
  }, [books, chapterData, lookup, translationCode]);

  const passageNotes = notes.filter((note) => note.reference === savedReference);
  const activeWords = getSignificantWords(activeVerse?.text ?? '');

  useEffect(() => {
    let ignore = false;
    setIndexState('loading');
    setErrorMessage('');

    fetchBookIndex(translationCode)
      .then((nextBooks) => {
        if (ignore) {
          return;
        }

        const currentBook = nextBooks.find((book) => book.code === bookCode);
        const fallbackBook =
          nextBooks.find((book) => book.code === 'JHN') ??
          nextBooks.find((book) => book.code === 'GEN') ??
          nextBooks[0];

        setBooks(nextBooks);

        if (!currentBook && fallbackBook) {
          setBookCode(fallbackBook.code);
          setChapter(fallbackBook.code === 'JHN' ? 3 : 1);
          setActiveVerseNumber(fallbackBook.code === 'JHN' ? 16 : 1);
        } else if (currentBook) {
          setChapter((currentChapter) => clampNumber(currentChapter, 1, currentBook.chapterCount));
        }

        setIndexState('ready');
      })
      .catch((error: Error) => {
        if (ignore) {
          return;
        }

        setErrorMessage(error.message);
        setIndexState('error');
      });

    return () => {
      ignore = true;
    };
  }, [translationCode]);

  useEffect(() => {
    if (!selectedBook) {
      return;
    }

    let ignore = false;
    setChapterState('loading');
    setErrorMessage('');

    fetchChapter(translationCode, selectedBook.code, chapter)
      .then((nextChapter) => {
        if (ignore) {
          return;
        }

        setChapterData(nextChapter);
        setActiveVerseNumber((currentVerse) =>
          nextChapter.verses.some((verse) => verse.verse === currentVerse)
            ? currentVerse
            : (nextChapter.verses[0]?.verse ?? 1),
        );
        setChapterState('ready');
      })
      .catch((error: Error) => {
        if (ignore) {
          return;
        }

        setErrorMessage(error.message);
        setChapterData(null);
        setChapterState('error');
      });

    return () => {
      ignore = true;
    };
  }, [chapter, selectedBook, translationCode]);

  useEffect(() => {
    if (!activeVerse || !selectedBook) {
      setParallelVerses([]);
      return;
    }

    let ignore = false;
    const parallelCodes = getParallelCodes(translationCode, selectedBook);

    Promise.all(
      parallelCodes.map((code) =>
        fetchVerse(code, selectedBook.code, chapter, activeVerse.verse)
          .then((verse) => ({ code, verse }))
          .catch(() => null),
      ),
    ).then((results) => {
      if (!ignore) {
        setParallelVerses(results.filter(Boolean) as Array<{ code: TranslationCode; verse: VersePayload }>);
      }
    });

    return () => {
      ignore = true;
    };
  }, [activeVerse, chapter, selectedBook, translationCode]);

  useEffect(() => {
    window.localStorage.setItem(notesKey, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    setAssistantAnswer(buildAssistantResponse(assistantPrompt, translation.name, currentReference, activeVerse, chapterData));
  }, [activeVerse, assistantPrompt, chapterData, currentReference, translation.name]);

  function changeTranslation(nextTranslation: TranslationCode) {
    setTranslationCode(nextTranslation);
  }

  function changeBook(nextBookCode: string) {
    setBookCode(nextBookCode);
    setChapter(1);
    setActiveVerseNumber(1);
  }

  function changeChapter(nextChapter: number) {
    if (!selectedBook) {
      return;
    }

    setChapter(clampNumber(nextChapter, 1, selectedBook.chapterCount));
    setActiveVerseNumber(1);
  }

  function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = parseReference(lookup, books, translationCode);

    if (!target) {
      return;
    }

    setBookCode(target.bookCode);
    setChapter(target.chapter);
    setActiveVerseNumber(target.verse ?? 1);
  }

  function askAssistant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAssistantAnswer(buildAssistantResponse(assistantPrompt, translation.name, currentReference, activeVerse, chapterData));
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedNote = noteDraft.trim();

    if (!trimmedNote || !activeVerse) {
      return;
    }

    setNotes((currentNotes) => [
      {
        id: `note-${Date.now()}`,
        reference: savedReference,
        verse: activeVerse.verse,
        body: trimmedNote,
        tag: translation.abbreviation,
      },
      ...currentNotes,
    ]);
    setNoteDraft('');
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Workspace navigation">
        <div className="brand">
          <div className="brand-mark">L</div>
          <div>
            <strong>Lumen</strong>
            <span>Bible Study</span>
          </div>
        </div>

        <nav className="nav-list">
          <a className="nav-item active" href="#reader">
            <BookOpen size={18} />
            Reader
          </a>
          <a className="nav-item" href="#search">
            <Search size={18} />
            Search
          </a>
          <a className="nav-item" href="#notes">
            <PenLine size={18} />
            Notes
          </a>
          <a className="nav-item" href="#library">
            <Library size={18} />
            Library
          </a>
        </nav>

        <section className="plan-summary" aria-label="Bible library progress">
          <div className="plan-topline">
            <ListChecks size={17} />
            <span>{translation.abbreviation} library</span>
          </div>
          <strong>{books.length || '--'}</strong>
          <span className="metric-label">books available</span>
          <div className="progress-track">
            <div style={{ width: `${libraryProgress}%` }} />
          </div>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="passage-select">
            <label htmlFor="translation">Translation</label>
            <div>
              <select
                id="translation"
                value={translationCode}
                onChange={(event) => changeTranslation(event.target.value as TranslationCode)}
              >
                {translations.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.abbreviation} - {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="passage-select">
            <label htmlFor="book">Book</label>
            <div>
              <select
                id="book"
                value={selectedBook?.code ?? ''}
                disabled={indexState === 'loading' || !books.length}
                onChange={(event) => changeBook(event.target.value)}
              >
                {books.map((book) => (
                  <option key={book.code} value={book.code}>
                    {book.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="passage-select">
            <label htmlFor="chapter">Chapter</label>
            <div>
              <select
                id="chapter"
                value={chapter}
                disabled={!selectedBook}
                onChange={(event) => changeChapter(Number(event.target.value))}
              >
                {chapterNumbers.map((chapterNumber) => (
                  <option key={chapterNumber} value={chapterNumber}>
                    {chapterNumber}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
          </div>

          <form className="global-search" id="search" role="search" onSubmit={handleLookup}>
            <Search size={18} />
            <input
              aria-label="Search current chapter or jump to reference"
              placeholder="John 3:16 or a word in this chapter"
              value={lookup}
              onChange={(event) => setLookup(event.target.value)}
            />
            <button type="submit">Go</button>
          </form>
        </header>

        <div className="content-grid">
          <section className="reader-panel" id="reader" aria-labelledby="reader-title">
            <div className="panel-heading">
              <div>
                <p>
                  {translation.name} - {translation.coverage}
                </p>
                <h1 id="reader-title">{formatReference(selectedBook, chapter)}</h1>
              </div>
              <button className="soft-button">
                <Bookmark size={17} />
                Save
              </button>
            </div>

            <div className="theme-strip">
              <Sparkles size={18} />
              <span>
                {translation.language} text, {translation.year}. Source: OriginsAPI public-domain corpus.
              </span>
            </div>

            <div className="chapter-actions">
              <button disabled={chapter <= 1} onClick={() => changeChapter(chapter - 1)}>
                <ArrowLeft size={17} />
                Previous
              </button>
              <span>
                {selectedBook?.chapterCount ?? 0} chapters - {chapterData?.verses.length ?? 0} verses loaded
              </span>
              <button
                disabled={!selectedBook || chapter >= selectedBook.chapterCount}
                onClick={() => changeChapter(chapter + 1)}
              >
                Next
                <ArrowRight size={17} />
              </button>
            </div>

            {errorMessage && (
              <div className="state-message error">
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            {chapterState === 'loading' && <div className="state-message">Loading chapter text...</div>}

            {chapterState === 'ready' && chapterData && (
              <article className="scripture-text" dir={translation.direction}>
                {chapterData.verses.map((verse) => (
                  <button
                    key={verse.reference}
                    className={verse.verse === activeVerseNumber ? 'verse active' : 'verse'}
                    onClick={() => setActiveVerseNumber(verse.verse)}
                  >
                    <sup>{verse.verse}</sup>
                    <span>{verse.text}</span>
                  </button>
                ))}
              </article>
            )}
          </section>

          <aside className="study-panel" aria-label="Study guide">
            <div className="panel-heading compact">
              <div>
                <p>Selected verse</p>
                <h2>{currentReference}</h2>
              </div>
              <span className="source-pill">{translation.abbreviation}</span>
            </div>

            <div className="lens-tabs" aria-label="Study lenses">
              {lensOptions.map((lens) => (
                <button
                  key={lens}
                  className={activeLens === lens ? 'active' : ''}
                  onClick={() => setActiveLens(lens)}
                >
                  {lens}
                </button>
              ))}
            </div>

            <div className="insight-card">
              {activeLens === 'Context' && (
                <>
                  <div className="card-icon">
                    <FileText size={18} />
                  </div>
                  <h3>Chapter Context</h3>
                  <p>
                    {selectedBook?.name} is in the {selectedBook?.testament === 'old' ? 'Old' : 'New'} Testament.
                    This chapter has {chapterData?.verses.length ?? 0} loaded verses in {translation.abbreviation}.
                  </p>
                </>
              )}

              {activeLens === 'Words' && (
                <>
                  <div className="card-icon blue">
                    <Brain size={18} />
                  </div>
                  <h3>Study Terms</h3>
                  <div className="word-list">
                    {activeWords.length ? activeWords.map((word) => <span key={word}>{word}</span>) : <span>None</span>}
                  </div>
                </>
              )}

              {activeLens === 'Parallel' && (
                <>
                  <div className="card-icon green">
                    <Highlighter size={18} />
                  </div>
                  <h3>Parallel Texts</h3>
                  <div className="parallel-list">
                    {parallelVerses.map((item) => (
                      <p key={item.code} dir={getTranslation(item.code).direction}>
                        <strong>{getTranslation(item.code).abbreviation}</strong> {item.verse.text}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="commentary-stack">
              <div className="section-title">
                <Highlighter size={17} />
                <h3>Study Checks</h3>
              </div>
              <p>Read the selected verse inside the chapter before using it as a standalone proof text.</p>
              <p>Compare wording across the parallel panel when the selected verse exists in those texts.</p>
              <p>Modern copyrighted translations should be added only through licensed provider access.</p>
            </div>
          </aside>
        </div>

        <section className="lower-grid">
          <div className="assistant-panel">
            <div className="section-title">
              <MessageSquareText size={18} />
              <h2>Study Assistant</h2>
            </div>
            <form onSubmit={askAssistant} className="assistant-form">
              <input
                aria-label="Ask a study question"
                value={assistantPrompt}
                onChange={(event) => setAssistantPrompt(event.target.value)}
              />
              <button type="submit">
                <Sparkles size={17} />
                Ask
              </button>
            </form>
            <div className="assistant-answer">{assistantAnswer}</div>
          </div>

          <div className="search-panel">
            <div className="section-title">
              <Search size={18} />
              <h2>Chapter Search</h2>
            </div>
            <div className="result-list">
              {chapterMatches.map((result) => (
                <button key={result.reference} onClick={() => setActiveVerseNumber(result.verse)}>
                  <strong>
                    {selectedBook?.name} {chapter}:{result.verse}
                  </strong>
                  <span>{result.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="notes-panel" id="notes">
            <div className="section-title">
              <PenLine size={18} />
              <h2>Notes</h2>
            </div>
            <form onSubmit={addNote} className="note-form">
              <textarea
                aria-label="New note"
                placeholder={`Note on ${currentReference}`}
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
              />
              <button type="submit">
                <Check size={17} />
                Add
              </button>
            </form>
            <div className="note-list">
              {passageNotes.map((note) => (
                <article key={note.id}>
                  <span>
                    {note.tag} - v{note.verse}
                  </span>
                  <p>{note.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="library-section" id="library">
          <div className="study-image">
            <img src={studyDesk} alt="Bible study desk with open Scripture, notebook, pen, and phone" />
            <div>
              <span>Library</span>
              <strong>{translations.length} public-domain texts are wired into the reader.</strong>
            </div>
          </div>

          <div className="library-grid">
            {libraryResources.map((resource) => (
              <article key={resource.id} className="resource-card">
                <div style={{ background: resource.color }}>
                  <Library size={18} />
                </div>
                <span>{resource.type}</span>
                <h3>{resource.title}</h3>
                <p>{resource.focus}</p>
                <small>{resource.author}</small>
              </article>
            ))}
          </div>
        </section>

        <footer className="app-footer">
          <span>
            <Clock3 size={16} />
            Public-domain Bible text is loaded from OriginsAPI. Licensed translations need publisher/API.Bible rights.
          </span>
        </footer>
      </section>
    </main>
  );
}
