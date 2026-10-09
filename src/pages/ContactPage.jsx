import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Github,
  Linkedin,
  LoaderCircle,
  Mail,
  Send,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import profile from '../data/profile.js';
import { PageHeading } from '../components/portfolio/SiteLayout.jsx';
const draftKey = 'portfolio-contact-draft';
const emptyDraft = { name: '', email: '', topic: 'Collaboration', message: '' };
const topics = ['Internship opportunity', 'Collaboration', 'Project enquiry', 'Just saying hello'];
function restoreDraft() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(draftKey));
    if (!saved || typeof saved !== 'object') return emptyDraft;
    return {
      name: typeof saved.name === 'string' ? saved.name.slice(0, 100) : '',
      email: typeof saved.email === 'string' ? saved.email.slice(0, 254) : '',
      topic: topics.includes(saved.topic) ? saved.topic : 'Collaboration',
      message: typeof saved.message === 'string' ? saved.message.slice(0, 5000) : '',
    };
  } catch {
    return emptyDraft;
  }
}
export default function ContactPage() {
  const [draft, setDraft] = useState(restoreDraft);
  const [draftSaved, setDraftSaved] = useState(false);
  const hasDraft = Boolean(draft.name || draft.email || draft.message);
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');
  const pendingRequest = useRef(null);
  useEffect(() => {
    return () => pendingRequest.current?.abort();
  }, []);
  useEffect(() => {
    try {
      if (hasDraft) sessionStorage.setItem(draftKey, JSON.stringify(draft));
      else sessionStorage.removeItem(draftKey);
      setDraftSaved(hasDraft);
    } catch {
      setDraftSaved(false);
    }
  }, [draft, hasDraft]);
  const updateDraft = (field, value) => {
    setDraft((previous) => ({ ...previous, [field]: value }));
    setStatus('idle');
    setFeedback('');
  };
  const clearDraft = () => {
    setDraft(emptyDraft);
    setStatus('idle');
    setFeedback('');
  };
  const emailFallback =
    'mailto:' +
    profile.email +
    '?subject=' +
    encodeURIComponent('Portfolio enquiry: ' + draft.topic) +
    '&body=' +
    encodeURIComponent(draft.message + '\n\nFrom: ' + draft.name + '\nReply to: ' + draft.email);
  const sendMessage = async (event) => {
    event.preventDefault();
    if (pendingRequest.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    if (fields.get('_honey')) return;
    for (const [name, minimum] of [
      ['name', 2],
      ['message', 20],
    ]) {
      if (fields.get(name).trim().length < minimum) {
        form.elements[name].setCustomValidity(
          `Please enter at least ${minimum} characters, excluding spaces at the ends.`,
        );
        form.elements[name].reportValidity();
        return;
      }
    }
    const controller = new AbortController();
    pendingRequest.current = controller;
    setStatus('sending');
    setFeedback('Sending your message…');
    const timeout = setTimeout(() => controller.abort('timeout'), 20000);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit',
        signal: controller.signal,
        body: JSON.stringify({
          name: fields.get('name').trim(),
          email: fields.get('email').trim(),
          topic: fields.get('topic'),
          message: fields.get('message').trim(),
          _subject: `Portfolio enquiry: ${fields.get('topic')}`,
          _template: 'table',
          _honey: '',
          _url: window.location.href,
        }),
      });
      const result = await response.json();
      if (!response.ok || ![true, 'true'].includes(result.success)) {
        throw new Error(/needs activation/i.test(result.message || '') ? 'activation' : 'failed');
      }
      form.reset();
      setDraft(emptyDraft);
      setStatus('success');
      setFeedback(
        'Message submitted. Thank you for reaching out! I’ll reply to the email you provided.',
      );
    } catch (error) {
      // A navigation abort should not update a page that has been unmounted.
      if (controller.signal.aborted && controller.signal.reason !== 'timeout') return;
      setStatus('error');
      setFeedback(
        error.message === 'activation'
          ? 'The contact form is being activated. Please use the email link for now. Your message has been kept here.'
          : 'Your message could not be sent. Your details are still here—please try again, or use the email link.',
      );
    } finally {
      clearTimeout(timeout);
      pendingRequest.current = null;
    }
  };
  return (
    <main id="main-content" tabIndex={-1} className="container page-content contact-page">
      <PageHeading eyebrow="LET’S MAKE SOMETHING GOOD" title="Start a conversation">
        An internship, a collaboration, or a problem worth solving. I’d love to hear what you’re
        working on.
      </PageHeading>
      <div className="contact-layout">
        <section className="contact-primary">
          <div className="availability">
            <span className="live-dot" /> Open to internship opportunities
          </div>
          <h2>
            A simple hello<span className="accent">.</span>
          </h2>
          <p>
            Tell me a little about yourself and what you have in mind. Your message goes straight to
            my inbox.
          </p>
          <form
            className="contact-form"
            onSubmit={sendMessage}
            onInput={(event) => event.target.setCustomValidity?.('')}
            aria-busy={status === 'sending'}
          >
            <fieldset disabled={status === 'sending'}>
              <legend className="visually-hidden">Send Richmond a message</legend>
              <div className="form-row">
                <label htmlFor="contact-name">
                  Your name
                  <input
                    id="contact-name"
                    name="name"
                    value={draft.name}
                    onChange={(event) => updateDraft('name', event.target.value)}
                    autoComplete="name"
                    placeholder="How should I address you?"
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </label>
                <label htmlFor="contact-email">
                  Email address
                  <input
                    id="contact-email"
                    name="email"
                    value={draft.email}
                    onChange={(event) => updateDraft('email', event.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    maxLength={254}
                  />
                </label>
              </div>
              <label htmlFor="contact-topic">
                What’s this about?
                <select
                  id="contact-topic"
                  name="topic"
                  value={draft.topic}
                  onChange={(event) => updateDraft('topic', event.target.value)}
                >
                  <option>Internship opportunity</option>
                  <option>Collaboration</option>
                  <option>Project enquiry</option>
                  <option>Just saying hello</option>
                </select>
              </label>
              <label htmlFor="contact-message">
                Your message
                <textarea
                  id="contact-message"
                  name="message"
                  value={draft.message}
                  onChange={(event) => updateDraft('message', event.target.value)}
                  rows={6}
                  placeholder="Share a little about the opportunity, idea, or project…"
                  required
                  minLength={20}
                  maxLength={5000}
                />
              </label>
              <div className="form-honeypot" aria-hidden="true">
                <label htmlFor="contact-website">Leave this field empty</label>
                <input id="contact-website" name="_honey" tabIndex={-1} autoComplete="off" />
              </div>
              {hasDraft && (
                <div className="draft-toolbar">
                  <span>
                    {draftSaved
                      ? 'Draft saved in this tab'
                      : 'Your draft is kept while this page is open'}
                  </span>
                  <button type="button" className="text-link" onClick={clearDraft}>
                    <Trash2 size={14} /> Clear draft
                  </button>
                </div>
              )}
              <p className="form-privacy">
                Your name, email, and message are sent to Richmond through FormSubmit. All fields
                are required.
              </p>
              <button className="button" type="submit">
                {status === 'sending' ? (
                  <LoaderCircle className="sending-icon" size={18} />
                ) : (
                  <Send size={18} />
                )}
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </fieldset>
            <div
              className={`form-feedback feedback-${status}`}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {status === 'success' && <CheckCircle2 size={20} />}
              <p>{feedback}</p>
            </div>
            {status === 'error' && (
              <a className="text-link email-fallback" href={emailFallback}>
                <Mail size={17} /> Send with your email app <ArrowUpRight size={15} />
              </a>
            )}
          </form>
        </section>
        <aside className="contact-links">
          <span className="eyebrow">ELSEWHERE ON THE INTERNET</span>
          <a className="contact-link-card" href={profile.github} target="_blank" rel="noreferrer">
            <span className="contact-link-icon">
              <Github size={25} />
            </span>
            <div>
              <h3>GitHub</h3>
              <p>Code, projects, and experiments.</p>
              <span>@ArguellesMomon</span>
            </div>
            <ArrowUpRight size={21} />
          </a>
          {profile.linkedin && (
            <a
              className="contact-link-card"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-link-icon">
                <Linkedin size={25} />
              </span>
              <div>
                <h3>LinkedIn</h3>
                <p>Let’s connect professionally.</p>
              </div>
              <ArrowUpRight size={21} />
            </a>
          )}
          {profile.email && (
            <a className="contact-link-card" href={`mailto:${profile.email}`}>
              <span className="contact-link-icon">
                <Mail size={25} />
              </span>
              <div>
                <h3>Email</h3>
                <p>{profile.email}</p>
              </div>
              <ArrowUpRight size={21} />
            </a>
          )}
          <div className="contact-note">
            <span className="eyebrow">A GOOD FIT</span>
            <h3>Useful ideas. Thoughtful people.</h3>
            <p>
              I enjoy projects with a clear purpose and teams that care about both how a product
              works and how it feels.
            </p>
            <span className="location-note">Philippines · Asia/Manila</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
