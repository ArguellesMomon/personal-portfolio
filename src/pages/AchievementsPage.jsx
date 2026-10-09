import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Download, Maximize2, Search, X } from 'lucide-react';
import certificates from '../data/certificates.js';
import '../styles/learning.css';

const categories = [
  ['all', 'Everything'],
  ['certification', 'Courses'],
  ['seminar', 'Rooms I showed up in'],
  ['milestone', 'Recognition'],
];
const types = {
  certification: 'Course completed',
  seminar: 'Seminar & participation',
  milestone: 'Academic recognition',
};
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const formatDate = (date) => dateFormat.format(new Date(date + 'T00:00:00Z'));
const published = certificates
  .filter((item) => item.title.trim())
  .sort((a, b) => b.date.localeCompare(a.date));
const recognition = published.find((item) => item.id === 'applications-development');
const foundations = published.find((item) => item.id === 'elements-ai');
const relatedWork = {
  'pytorch-intro': ['AedesCapella', '/projects/aedescapella'],
  'elements-ai': ['AedesCapella', '/projects/aedescapella'],
  arduinnovation: ['AedesCapella', '/projects/aedescapella'],
  'applications-development': ['The project collection', '/projects'],
  'lets-git-it': ['My public repositories', 'https://github.com/ArguellesMomon'],
};

function DocumentLinks({ item }) {
  return (
    <div className="archive-document-links">
      <a
        href={item.documentUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={'Open original certificate: ' + item.title}
      >
        Open original <ArrowUpRight size={16} aria-hidden="true" />
      </a>
      <a
        href={item.documentUrl}
        download={item.sourceFile.split('/').pop()}
        aria-label={'Download certificate: ' + item.title}
      >
        Download <Download size={15} aria-hidden="true" />
      </a>
    </div>
  );
}

function CertificateViewer({ item, onClose, opener }) {
  const dialog = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    };
  }, [opener]);
  return (
    <dialog
      ref={dialog}
      className="archive-viewer"
      aria-labelledby="archive-viewer-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = dialog.current.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = [...dialog.current.querySelectorAll('button, a[href], [tabindex="0"]')];
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <header className="archive-viewer-header">
        <div>
          <span className="archive-label">THE ORIGINAL RECORD</span>
          <h2 id="archive-viewer-title">{item.title}</h2>
        </div>
        <button autoFocus className="icon-button" onClick={onClose} aria-label="Close certificate">
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div
        className={'archive-viewer-stage ' + (zoomed ? 'is-zoomed' : '')}
        tabIndex={0}
        role="region"
        aria-label="Certificate preview; scroll to explore"
      >
        <img src={item.preview} alt={item.title + ' certificate awarded to Richmond Arguelles'} />
      </div>
      <footer className="archive-viewer-footer">
        <DocumentLinks item={item} />
        <button className="archive-zoom" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>
          <Maximize2 size={15} aria-hidden="true" />
          {zoomed ? 'Fit to screen' : 'Enlarge preview'}
        </button>
      </footer>
    </dialog>
  );
}

export default function AchievementsPage() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('pytorch-intro');
  const [viewing, setViewing] = useState(null);
  const opener = useRef(null);
  const visible = published.filter(
    (item) =>
      (category === 'all' || item.type === category) &&
      [item.title, item.issuer, item.description]
        .join(' ')
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const selected = visible.find((item) => item.id === selectedId) || visible[0];
  const openViewer = (item, element) => {
    opener.current = element;
    setViewing(item);
  };
  const selectEntry = (item, event) => {
    setSelectedId(item.id);
    if (window.matchMedia('(max-width: 800px)').matches) openViewer(item, event.currentTarget);
  };
  return (
    <main id="main-content" tabIndex={-1} className="learning-page">
      <div className="container">
        <header className="learning-masthead">
          <span>RICHMOND ARGUELLES / LEARNING ARCHIVE</span>
          <span>
            VOL. 01 <span aria-hidden="true">—</span> 2025–2026
          </span>
        </header>
        <section className="learning-opening" aria-labelledby="learning-title">
          <div className="learning-opening-copy">
            <span className="archive-label">CERTIFICATES & ACHIEVEMENTS</span>
            <h1 id="learning-title">
              An unfinished
              <br />
              <em>education.</em>
            </h1>
            <p>
              The courses I finish. The rooms I show up in.
              <br className="archive-desktop-break" /> The things I bring back to my work.
            </p>
            <a className="archive-browse" href="#learning-index">
              Explore the archive <ArrowDown size={18} aria-hidden="true" />
            </a>
            <span className="learning-margin-note">There’s always another page.</span>
          </div>
          <div className="learning-paper-scene">
            <span className="archive-scene-index" aria-hidden="true">
              A FEW PAGES FROM THE JOURNEY
            </span>
            <button
              className="archive-paper archive-paper-back"
              onClick={(event) => openViewer(foundations, event.currentTarget)}
              aria-label="Explore Elements of AI certificate"
            >
              <img
                src={foundations.preview}
                alt="Elements of AI course certificate"
                width="1000"
                height="750"
              />
              <span>01 / A foundation in AI</span>
            </button>
            <button
              className="archive-paper archive-paper-front"
              onClick={(event) => openViewer(recognition, event.currentTarget)}
              aria-label="Explore academic recognition certificate"
            >
              <img
                src={recognition.preview}
                alt="Academic recognition for Applications Development and Emerging Technologies"
                width="1000"
                height="750"
              />
              <span>
                02 / A moment of recognition <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </button>
          </div>
        </section>
        <div className="learning-colophon">
          <p>
            <span className="archive-colophon-dot" aria-hidden="true" />
            Computer Science <span className="colophon-divider">/</span> De La Salle Lipa
          </p>
          <span>{published.length} records, and counting</span>
        </div>
        <section id="learning-index" className="learning-index" aria-labelledby="archive-title">
          <div className="archive-section-heading">
            <div>
              <span className="archive-label">THE COLLECTION</span>
              <h2 id="archive-title">Follow the curiosity.</h2>
            </div>
            <p>
              Choose a record to look inside.
              <br />
              Every entry has its original document.
            </p>
          </div>
          <div className="archive-controls">
            <div className="archive-categories" role="group" aria-label="Certificate category">
              {categories.map(([value, label]) => (
                <button
                  key={value}
                  aria-pressed={category === value}
                  onClick={() => setCategory(value)}
                >
                  {label}
                  <span>
                    {value === 'all'
                      ? published.length
                      : published.filter((item) => item.type === value).length}
                  </span>
                </button>
              ))}
            </div>
            <label className="archive-search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                aria-label="Search certificates"
                placeholder="Find something…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
          <p className="archive-result-count" role="status">
            {visible.length} of {published.length} records <span aria-hidden="true">/</span> Newest
            first
          </p>
          <div className="archive-workspace">
            <div className="archive-register">
              {['2026', '2025'].map((year) => {
                const records = visible.filter((item) => item.date.startsWith(year));
                if (!records.length) return null;
                return (
                  <section
                    className="archive-year"
                    key={year}
                    aria-labelledby={'archive-year-' + year}
                  >
                    <h3 id={'archive-year-' + year}>
                      {year}
                      <span>{records.length} records</span>
                    </h3>
                    <ol>
                      {records.map((item) => (
                        <li key={item.id} className="learning-entry">
                          <button
                            className={
                              'archive-entry ' + (selected?.id === item.id ? 'is-selected' : '')
                            }
                            aria-pressed={selected?.id === item.id}
                            aria-label={'Explore certificate: ' + item.title}
                            onClick={(event) => selectEntry(item, event)}
                          >
                            <span className="archive-entry-number" aria-hidden="true">
                              {String(published.indexOf(item) + 1).padStart(2, '0')}
                            </span>
                            <span className="archive-entry-copy">
                              <span className="archive-entry-title">{item.title}</span>
                              <span className="archive-entry-meta">
                                {item.issuer}
                                <time dateTime={item.date}>{formatDate(item.date)}</time>
                              </span>
                            </span>
                            <ArrowRight
                              className="archive-entry-arrow"
                              size={19}
                              aria-hidden="true"
                            />
                          </button>
                        </li>
                      ))}
                    </ol>
                  </section>
                );
              })}
              {!visible.length && (
                <div className="archive-empty">
                  <h3>No records on this page.</h3>
                  <p>Try another search, or start fresh.</p>
                  <button
                    className="text-link"
                    onClick={() => {
                      setQuery('');
                      setCategory('all');
                    }}
                  >
                    Clear search & filters <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
            {selected && (
              <aside className="archive-inspector" aria-label="Selected certificate">
                <div className="archive-inspector-heading">
                  <span className="archive-label">ON THE READING DESK</span>
                  <span>
                    {String(published.indexOf(selected) + 1).padStart(2, '0')} / {published.length}
                  </span>
                </div>
                <button
                  className="archive-inspector-preview"
                  onClick={(event) => openViewer(selected, event.currentTarget)}
                  aria-label={'Enlarge certificate: ' + selected.title}
                >
                  <img
                    key={selected.id}
                    src={selected.preview}
                    alt={selected.title + ' certificate awarded to Richmond Arguelles'}
                    width="1000"
                    height="750"
                  />
                  <span>
                    <Maximize2 size={14} aria-hidden="true" /> A closer look
                  </span>
                </button>
                <div className="archive-inspector-copy" key={selected.id}>
                  <span className="archive-label">{types[selected.type]}</span>
                  <h3>{selected.title}</h3>
                  <p className="archive-inspector-issuer">
                    {selected.issuer}
                    <time dateTime={selected.date}>{formatDate(selected.date)}</time>
                  </p>
                  <p>{selected.description}</p>
                  <DocumentLinks item={selected} />
                  {relatedWork[selected.id] && (
                    <div className="archive-related">
                      <span className="archive-label">RELATED WORK</span>
                      {relatedWork[selected.id][1].startsWith('https') ? (
                        <a href={relatedWork[selected.id][1]} target="_blank" rel="noreferrer">
                          {relatedWork[selected.id][0]}
                          <ArrowUpRight size={17} aria-hidden="true" />
                        </a>
                      ) : (
                        <Link to={relatedWork[selected.id][1]}>
                          {relatedWork[selected.id][0]}
                          <ArrowUpRight size={17} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </aside>
            )}
          </div>
        </section>
        <section className="learning-next" aria-labelledby="learning-next-title">
          <span className="archive-label">THE NEXT CHAPTER</span>
          <h2 id="learning-next-title">
            Good learning
            <br />
            finds its way <em>into the work.</em>
          </h2>
          <div>
            <p>
              The certificates are one part of the story.
              <br />
              The projects are where the ideas meet practice.
            </p>
            <Link to="/projects">
              See what I’m building <ArrowUpRight size={23} aria-hidden="true" />
            </Link>
          </div>
          <span className="learning-endnote">Curiosity continues.</span>
        </section>
      </div>
      {viewing && (
        <CertificateViewer item={viewing} onClose={() => setViewing(null)} opener={opener} />
      )}
    </main>
  );
}
