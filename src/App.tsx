import {
  BookOpen,
  Bookmark,
  Brain,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  FileText,
  Highlighter,
  Library,
  ListChecks,
  MessageSquareText,
  PanelRight,
  PenLine,
  Search,
  Sparkles,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import studyDesk from './assets/bible-study.jpg';
import { initialNotes, libraryResources, passages, StudyNote } from './data';

const lensOptions = ['Context', 'Words', 'Cross refs'] as const;

type Lens = (typeof lensOptions)[number];

function buildAssistantResponse(query: string, passageId: string) {
  const passage = passages.find((item) => item.id === passageId) ?? passages[0];
  const normalized = query.trim().toLowerCase();

  if (normalized.includes('word') || normalized.includes('greek') || normalized.includes('hebrew')) {
    return `${passage.wordStudy.word} (${passage.wordStudy.transliteration}) points to ${passage.wordStudy.meaning}`;
  }

  if (normalized.includes('cross') || normalized.includes('reference')) {
    return `${passage.reference} connects well with ${passage.crossRefs.join(', ')}. Start with the first reference, then compare the shared theme.`;
  }

  if (normalized.includes('sermon') || normalized.includes('outline')) {
    return `A tight outline for ${passage.reference}: main claim, movement through the text, gospel connection, and one concrete response.`;
  }

  return `${passage.reference}: ${passage.overview}`;
}

export function App() {
  const [selectedPassageId, setSelectedPassageId] = useState(passages[0].id);
  const [activeVerseId, setActiveVerseId] = useState(passages[0].verses[0].id);
  const [activeLens, setActiveLens] = useState<Lens>('Context');
  const [searchTerm, setSearchTerm] = useState('');
  const [assistantPrompt, setAssistantPrompt] = useState('What is the main idea here?');
  const [assistantAnswer, setAssistantAnswer] = useState(() =>
    buildAssistantResponse('What is the main idea here?', passages[0].id),
  );
  const [notes, setNotes] = useState<StudyNote[]>(initialNotes);
  const [noteDraft, setNoteDraft] = useState('');

  const selectedPassage = passages.find((passage) => passage.id === selectedPassageId) ?? passages[0];
  const activeVerse =
    selectedPassage.verses.find((verse) => verse.id === activeVerseId) ?? selectedPassage.verses[0];

  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return selectedPassage.verses.slice(0, 3).map((verse) => ({
        reference: `${selectedPassage.reference} v${verse.number}`,
        text: verse.text,
      }));
    }

    return passages
      .flatMap((passage) =>
        passage.verses.map((verse) => ({
          reference: `${passage.reference} v${verse.number}`,
          text: verse.text,
          searchable: `${passage.reference} ${passage.theme} ${verse.text} ${verse.keywords.join(' ')}`.toLowerCase(),
        })),
      )
      .filter((result) => result.searchable.includes(query))
      .slice(0, 5);
  }, [searchTerm, selectedPassage]);

  const passageNotes = notes.filter((note) => note.reference === selectedPassage.reference);
  const completedPlanCount = selectedPassage.id === 'john-1' ? 4 : selectedPassage.id === 'psalm-23' ? 2 : 3;

  function changePassage(passageId: string) {
    const nextPassage = passages.find((passage) => passage.id === passageId) ?? passages[0];
    setSelectedPassageId(nextPassage.id);
    setActiveVerseId(nextPassage.verses[0].id);
    setAssistantAnswer(buildAssistantResponse(assistantPrompt, nextPassage.id));
  }

  function askAssistant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAssistantAnswer(buildAssistantResponse(assistantPrompt, selectedPassage.id));
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedNote = noteDraft.trim();

    if (!trimmedNote) {
      return;
    }

    setNotes((currentNotes) => [
      {
        id: `note-${Date.now()}`,
        reference: selectedPassage.reference,
        verse: activeVerse.number,
        body: trimmedNote,
        tag: 'Note',
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

        <section className="plan-summary" aria-label="Reading plan progress">
          <div className="plan-topline">
            <ListChecks size={17} />
            <span>Reading plan</span>
          </div>
          <strong>{completedPlanCount}/7</strong>
          <div className="progress-track">
            <div style={{ width: `${(completedPlanCount / 7) * 100}%` }} />
          </div>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="passage-select">
            <label htmlFor="passage">Passage</label>
            <div>
              <select
                id="passage"
                value={selectedPassageId}
                onChange={(event) => changePassage(event.target.value)}
              >
                {passages.map((passage) => (
                  <option key={passage.id} value={passage.id}>
                    {passage.reference}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
          </div>

          <form className="global-search" id="search" role="search">
            <Search size={18} />
            <input
              aria-label="Search passages"
              placeholder="Search light, shepherd, Spirit..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </form>

          <button className="icon-button" aria-label="Open command menu" title="Command menu">
            <Command size={18} />
          </button>
        </header>

        <div className="content-grid">
          <section className="reader-panel" id="reader" aria-labelledby="reader-title">
            <div className="panel-heading">
              <div>
                <p>{selectedPassage.translation}</p>
                <h1 id="reader-title">{selectedPassage.reference}</h1>
              </div>
              <button className="soft-button">
                <Bookmark size={17} />
                Save
              </button>
            </div>

            <div className="theme-strip">
              <Sparkles size={18} />
              <span>{selectedPassage.theme}</span>
            </div>

            <article className="scripture-text">
              {selectedPassage.verses.map((verse) => (
                <button
                  key={verse.id}
                  className={verse.id === activeVerse.id ? 'verse active' : 'verse'}
                  onClick={() => setActiveVerseId(verse.id)}
                >
                  <sup>{verse.number}</sup>
                  <span>{verse.text}</span>
                </button>
              ))}
            </article>
          </section>

          <aside className="study-panel" aria-label="Study guide">
            <div className="panel-heading compact">
              <div>
                <p>Selected verse</p>
                <h2>
                  {selectedPassage.book} {activeVerse.number}
                </h2>
              </div>
              <button className="icon-button" aria-label="Toggle side panel" title="Toggle side panel">
                <PanelRight size={18} />
              </button>
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
                  <h3>Passage Context</h3>
                  <p>{selectedPassage.overview}</p>
                </>
              )}

              {activeLens === 'Words' && (
                <>
                  <div className="card-icon blue">
                    <Brain size={18} />
                  </div>
                  <h3>{selectedPassage.wordStudy.word}</h3>
                  <p>
                    <strong>{selectedPassage.wordStudy.transliteration}</strong>: {selectedPassage.wordStudy.meaning}
                  </p>
                </>
              )}

              {activeLens === 'Cross refs' && (
                <>
                  <div className="card-icon green">
                    <CircleHelp size={18} />
                  </div>
                  <h3>Cross References</h3>
                  <div className="reference-list">
                    {selectedPassage.crossRefs.map((reference) => (
                      <button key={reference}>{reference}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="commentary-stack">
              <div className="section-title">
                <Highlighter size={17} />
                <h3>Commentary</h3>
              </div>
              {selectedPassage.commentary.map((comment) => (
                <p key={comment}>{comment}</p>
              ))}
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
              <h2>Search Results</h2>
            </div>
            <div className="result-list">
              {searchResults.map((result) => (
                <button key={`${result.reference}-${result.text}`}>
                  <strong>{result.reference}</strong>
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
                placeholder={`Note on verse ${activeVerse.number}`}
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
              <span>Workspace</span>
              <strong>Read, search, and write in one flow.</strong>
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
            Prototype content uses public-domain World English Bible excerpts.
          </span>
        </footer>
      </section>
    </main>
  );
}
