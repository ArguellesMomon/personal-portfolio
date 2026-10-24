import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  LoaderCircle,
  Mail,
  Send,
  CheckCircle2,
  Trash2,
  Paperclip,
  X,
} from 'lucide-react';
import profile from '../data/profile.js';
import { PageHeading } from '../components/portfolio/SiteLayout.jsx';
const draftKey = 'portfolio-contact-draft';
const emptyDraft = { name: '', email: '', topic: 'Collaboration', message: '' };
const topics = ['Internship opportunity', 'Collaboration', 'Project enquiry', 'General enquiry'];
const maxAttachmentBytes = 10_000_000;
function attachmentValidation(files) {
  if (files.length > 3) return 'Choose up to 3 files per message. Remove a file to continue.';
  if (files.reduce((total, file) => total + file.size, 0) > maxAttachmentBytes)
    return 'Files exceed 10 MB in total. Remove a file or choose smaller files.';
  return '';
}

function fileList(files) {
  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  return transfer.files;
}
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
  const [attachments, setAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState('');
  const attachmentInput = useRef(null);
  const hasAttachments = attachments.length > 0;
  const charactersNeeded = Math.max(0, 20 - draft.message.trim().length);
  const pendingRequest = useRef(null);
  useEffect(() => {
    // Restore the form if the visitor returns from the attachment send page.
    const restore = () => {
      pendingRequest.current = null;
      setStatus('idle');
      setFeedback('');
      const files = Array.from(attachmentInput.current?.files || []);
      setAttachments(files);
      setAttachmentError(attachmentValidation(files));
    };
    window.addEventListener('pageshow', restore);
    return () => {
      window.removeEventListener('pageshow', restore);
      pendingRequest.current?.abort();
    };
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
    if (attachmentInput.current) attachmentInput.current.value = '';
    setAttachments([]);
    setAttachmentError('');
    setStatus('idle');
    setFeedback('');
  };
  const updateAttachments = (files) => {
    attachmentInput.current.files = fileList(files);
    setAttachments(files);
    setAttachmentError(attachmentValidation(files));
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
    const files = [...fields.values()].filter((value) => value instanceof File && value.name);
    const fileError = attachmentValidation(files);
    if (fileError) {
      setAttachmentError(fileError);
      attachmentInput.current.focus();
      return;
    }
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
    if (files.length) {
      // FormSubmit documents attachments for native multipart submissions.
      // Keep the file inputs enabled so their bytes are included in the POST.
      setStatus('uploading');
      setFeedback('Continuing to FormSubmit to send your message and attachments…');
      try {
        HTMLFormElement.prototype.submit.call(form);
      } catch {
        pendingRequest.current = null;
        setStatus('error');
        setFeedback('The send page could not be opened. Your message and files are still here.');
      }
      return;
    }
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
      setAttachments([]);
      setAttachmentError('');
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
      <PageHeading title="Contact">
        Open to internships and software development opportunities.
      </PageHeading>
      <div className="contact-layout">
        <aside className="contact-links">
          <h2>Contact details</h2>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <p>Philippines · Asia/Manila</p>
          <div className="inline-links">
            <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={16} />
            </a>
            <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight size={16} />
            </a>
          </div>
        </aside>
        <section className="contact-primary">
          <h2>Send a message</h2>
          <form
            className="contact-form"
            action={`https://formsubmit.co/${profile.email}`}
            method="post"
            encType="multipart/form-data"
            onSubmit={sendMessage}
            onInput={(event) => event.target.setCustomValidity?.('')}
            aria-busy={status === 'sending' || status === 'uploading'}
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
                    placeholder="Your full name"
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
                Topic
                <select
                  id="contact-topic"
                  name="topic"
                  value={draft.topic}
                  onChange={(event) => updateDraft('topic', event.target.value)}
                >
                  <option>Internship opportunity</option>
                  <option>Collaboration</option>
                  <option>Project enquiry</option>
                  <option>General enquiry</option>
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
                  placeholder="Describe the role, project, or question."
                  required
                  minLength={20}
                  maxLength={5000}
                  aria-describedby="message-requirement message-count"
                />
              </label>
              <div className="message-meta">
                <span
                  id="message-requirement"
                  className={charactersNeeded === 0 ? 'minimum-reached' : ''}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {charactersNeeded
                    ? `${charactersNeeded} more ${charactersNeeded === 1 ? 'character' : 'characters'} needed`
                    : '20-character minimum reached'}
                </span>
                <span id="message-count">
                  {draft.message.length.toLocaleString('en-US')} / 5,000 characters
                </span>
              </div>
              <div className="attachment-fields">
                <label htmlFor="contact-attachments">
                  <span>
                    <Paperclip size={14} aria-hidden="true" /> Attachments (optional)
                  </span>
                  <input
                    ref={attachmentInput}
                    id="contact-attachments"
                    type="file"
                    multiple
                    aria-describedby="attachment-help attachment-error"
                    onChange={(event) => updateAttachments(Array.from(event.target.files))}
                  />
                </label>
                <p id="attachment-help" className="attachment-help">
                  Select up to 3 files at once, 10 MB total. Files aren’t saved with drafts. With
                  attachments, you’ll continue to FormSubmit to send your message.
                </p>
                {hasAttachments && (
                  <ul className="attachment-list" aria-label="Selected attachments">
                    {attachments.map((attachment, index) => (
                      <li key={`${index}-${attachment.name}`}>
                        <span className="attachment-name">{attachment.name}</span>
                        <button
                          type="button"
                          className="icon-button attachment-remove"
                          aria-label={`Remove attachment ${index + 1}: ${attachment.name}`}
                          onClick={() =>
                            updateAttachments(attachments.filter((_, slot) => slot !== index))
                          }
                        >
                          <X size={18} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div hidden>
                  {/* FormSubmit receives separate named file fields from one visible picker. */}
                  {attachments.map((attachment, index) => (
                    <input
                      key={index}
                      type="file"
                      name={index === 0 ? 'attachment' : `attachment${index + 1}`}
                      ref={(input) => {
                        if (input) input.files = fileList([attachment]);
                      }}
                      tabIndex={-1}
                    />
                  ))}
                </div>
                <p id="attachment-error" className="feedback-error attachment-error" role="alert">
                  {attachmentError}
                </p>
              </div>
              <input type="hidden" name="_subject" value={`Portfolio enquiry: ${draft.topic}`} />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_url" value={window.location.href} />
              <div className="form-honeypot" aria-hidden="true">
                <label htmlFor="contact-website">Leave this field empty</label>
                <input id="contact-website" name="_honey" tabIndex={-1} autoComplete="off" />
              </div>
              {(hasDraft || hasAttachments) && (
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
                Your name, email, message, and any attachments are delivered via FormSubmit.
                Attachments are optional; all other fields are required.
              </p>
              <button className="button" type="submit" disabled={status === 'uploading'}>
                {status === 'sending' ? (
                  <LoaderCircle className="sending-icon" size={18} />
                ) : (
                  <Send size={18} />
                )}
                {status === 'sending'
                  ? 'Sending…'
                  : status === 'uploading'
                    ? 'Continuing…'
                    : hasAttachments
                      ? 'Continue to send'
                      : 'Send message'}
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
              <div>
                <a className="text-link email-fallback" href={emailFallback}>
                  <Mail size={17} /> Send with your email app <ArrowUpRight size={15} />
                </a>
                {hasAttachments && (
                  <p className="attachment-help">Attach your files again in your email app.</p>
                )}
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
