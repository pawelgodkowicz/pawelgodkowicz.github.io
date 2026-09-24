import { DEFAULT_LOCALE, SUPPORTED_LOCALES, translate } from './i18n.js';

const CONTACT_EMAIL = 'p.godkowicz@gmail.com';
const LOCALE_STORAGE_KEY = 'portfolio-locale';
const COPY_FEEDBACK_MS = 2000;
/** Matches the `.site-content` opacity transition in style.css. */
const PANEL_TRANSITION_MS = 400;
/** Ciphertext produced by tools/encrypt-resume.mjs. */
const RESUME_CIPHERTEXT_URL = 'assets/docs/resume.enc';

/* ------------------------------------------------------------------ *
 * Locale
 * ------------------------------------------------------------------ */

/** Remembered choice first, then the browser's preference, then English. */
function resolveInitialLocale() {
  let stored = null;
  try {
    stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    // Private browsing or blocked storage — fall through to detection.
  }
  if (stored && SUPPORTED_LOCALES.includes(stored)) return stored;

  const preferred = navigator.languages ?? [navigator.language];
  const match = preferred
    .filter(Boolean)
    .map((tag) => tag.slice(0, 2).toLowerCase())
    .find((code) => SUPPORTED_LOCALES.includes(code));

  return match ?? DEFAULT_LOCALE;
}

function rememberLocale(locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Not being able to persist the choice is not worth interrupting the user.
  }
}

/**
 * Applies `locale` to every element carrying a translation key.
 *
 * `data-i18n` replaces text content; `data-i18n-attr` takes a
 * semicolon-separated list of `attribute:key` pairs, e.g.
 * `data-i18n-attr="alt:hobbies.tech.alt;title:contact.copy"`.
 */
function applyLocale(locale) {
  document.documentElement.lang = locale;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = translate(locale, el.dataset.i18n);
    if (value !== null) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attribute, key] = pair.split(':').map((part) => part.trim());
      if (!attribute || !key) return;
      const value = translate(locale, key);
      if (value !== null) el.setAttribute(attribute, value);
    });
  });

  const title = translate(locale, 'meta.title');
  if (title !== null) document.title = title;

  // The tag is absent from index.html by design — no prose is shipped in the
  // markup — so create it on first run. Crawlers that execute JavaScript
  // (Google among them) still read a proper, language-matched description.
  const summary = translate(locale, 'meta.description');
  if (summary !== null) {
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.name = 'description';
      document.head.append(description);
    }
    description.content = summary;
  }
}

function initLocaleSwitch() {
  const toggle = document.getElementById('language-toggle');
  const labels = {
    pl: document.getElementById('language-label-pl'),
    en: document.getElementById('language-label-en'),
  };

  function render(locale) {
    applyLocale(locale);
    if (toggle) {
      toggle.checked = locale === 'en';
      toggle.setAttribute('aria-checked', String(toggle.checked));
    }
    Object.entries(labels).forEach(([code, label]) => {
      label?.classList.toggle('is-active', code === locale);
    });
  }

  toggle?.addEventListener('change', () => {
    const locale = toggle.checked ? 'en' : 'pl';
    rememberLocale(locale);
    render(locale);
  });

  render(resolveInitialLocale());
  // Markup ships without copy, so only reveal the page once it has been filled.
  document.body.classList.add('i18n-ready');
}

/* ------------------------------------------------------------------ *
 * Layout
 * ------------------------------------------------------------------ */

/** The hero fills the viewport minus the sticky header and the footer. */
function initLayoutMetrics() {
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.site-footer');

  function measure() {
    const root = document.documentElement.style;
    root.setProperty('--header-height', `${header?.offsetHeight ?? 0}px`);
    root.setProperty('--footer-height', `${footer?.offsetHeight ?? 0}px`);
  }

  measure();

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(measure);
    if (header) observer.observe(header);
    if (footer) observer.observe(footer);
  } else {
    window.addEventListener('resize', measure);
  }
}

/* ------------------------------------------------------------------ *
 * Navigation
 * ------------------------------------------------------------------ */

function initNavigation() {
  const trigger = document.getElementById('nav-trigger');
  const panel = document.getElementById('site-content');
  const socials = document.querySelector('.header-socials');
  if (!trigger || !panel) return;

  let collapseTimer;

  function setExpanded(expanded) {
    trigger.setAttribute('aria-expanded', String(expanded));
    trigger.classList.toggle('is-open', expanded);
    socials?.classList.toggle('is-visible', expanded);
    clearTimeout(collapseTimer);

    if (expanded) {
      panel.hidden = false;
      // Let the browser paint the unhidden panel before animating it in.
      requestAnimationFrame(() => panel.classList.add('is-visible'));
    } else {
      panel.classList.remove('is-visible');
      // Keep the panel in the layout until the fade-out has finished.
      collapseTimer = setTimeout(() => {
        panel.hidden = true;
      }, PANEL_TRANSITION_MS);
    }
  }

  trigger.addEventListener('click', () => {
    setExpanded(trigger.getAttribute('aria-expanded') !== 'true');
  });

  // A shared link such as /#contact points at a section inside the collapsed
  // panel, so open it before the browser tries to scroll there.
  function revealTarget() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !panel.querySelector(`#${CSS.escape(id)}`)) return;
    setExpanded(true);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }

  window.addEventListener('hashchange', revealTarget);
  revealTarget();
}

/* ------------------------------------------------------------------ *
 * Clipboard
 * ------------------------------------------------------------------ */

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Older Safari and any non-secure context.
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  if (!copied) throw new Error('Clipboard unavailable');
}

function initCopyButtons() {
  const status = document.getElementById('copy-status');

  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    const icon = button.querySelector('ion-icon');
    const restingIcon = icon?.getAttribute('name');
    let resetTimer;

    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const locale = document.documentElement.lang;

      try {
        await copyToClipboard(CONTACT_EMAIL);
        icon?.setAttribute('name', 'checkmark-outline');
        button.classList.add('is-copied');
        if (status) status.textContent = translate(locale, 'contact.copied') ?? '';
      } catch {
        if (status) status.textContent = translate(locale, 'contact.copyFailed') ?? '';
        return;
      }

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        if (restingIcon) icon?.setAttribute('name', restingIcon);
        button.classList.remove('is-copied');
        if (status) status.textContent = '';
      }, COPY_FEEDBACK_MS);
    });
  });
}

/* ------------------------------------------------------------------ *
 * Encrypted CV
 * ------------------------------------------------------------------ */

/**
 * Reads the container written by tools/encrypt-resume.mjs.
 * Layout: magic(8) | salt(16) | iv(12) | iterations(4, big-endian) | body.
 */
function parseContainer(buffer) {
  const bytes = new Uint8Array(buffer);
  const magic = new TextDecoder().decode(bytes.subarray(0, 8));
  if (magic !== 'PGRESUME') throw new Error('Unrecognised container');
  return {
    salt: bytes.subarray(8, 24),
    iv: bytes.subarray(24, 36),
    iterations: new DataView(buffer).getUint32(36),
    body: bytes.subarray(40),
  };
}

async function decryptResume(password) {
  const response = await fetch(RESUME_CIPHERTEXT_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

  const { salt, iv, iterations, body } = parseContainer(await response.arrayBuffer());

  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );

  // A wrong password fails the GCM tag check, so this throws rather than
  // returning garbage — there is no separate password comparison anywhere.
  const pdf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, body);
  return new Blob([pdf], { type: 'application/pdf' });
}

function initResumeGate() {
  const trigger = document.getElementById('resume-trigger');
  const dialog = document.getElementById('resume-dialog');
  const form = document.getElementById('resume-form');
  const input = document.getElementById('resume-password');
  const submit = document.getElementById('resume-submit');
  const cancel = document.getElementById('resume-cancel');
  const message = document.getElementById('resume-message');
  if (!trigger || !dialog || !form) return;

  let objectUrl = null;

  function say(key, tone = 'error') {
    message.textContent = translate(document.documentElement.lang, key) ?? '';
    message.dataset.tone = tone;
  }

  function releaseObjectUrl() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  }

  trigger.addEventListener('click', () => {
    form.reset();
    message.textContent = '';
    dialog.showModal();
    input.focus();
  });

  cancel.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', releaseObjectUrl);

  form.addEventListener('submit', async (event) => {
    // method="dialog" would close the dialog before the work is done.
    event.preventDefault();

    if (!window.crypto?.subtle) {
      say('resume.unsupported');
      return;
    }

    submit.disabled = true;
    say('resume.working', 'busy');

    try {
      releaseObjectUrl();
      const blob = await decryptResume(input.value);
      objectUrl = URL.createObjectURL(blob);

      const opened = window.open(objectUrl, '_blank', 'noopener');
      if (opened) {
        say('resume.ready', 'success');
      } else {
        // Popup blocked — offer a link the visitor clicks themselves.
        message.textContent = '';
        message.dataset.tone = 'success';
        const link = document.createElement('a');
        link.href = objectUrl;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = translate(document.documentElement.lang, 'resume.openManually') ?? '';
        message.append(link);
      }
    } catch (error) {
      // Distinguish "file did not arrive" from "tag check failed".
      say(error instanceof TypeError || /Fetch failed/.test(error.message)
        ? 'resume.loadFailed'
        : 'resume.wrongPassword');
      input.select();
    } finally {
      submit.disabled = false;
    }
  });
}

/* ------------------------------------------------------------------ */

initLocaleSwitch();
initLayoutMetrics();
initNavigation();
initCopyButtons();
initResumeGate();
