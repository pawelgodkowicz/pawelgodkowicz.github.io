# Paweł Godkowicz — Portfolio

Personal portfolio site of a data analyst. Static, dependency-free, bilingual
(English / Polish), hosted on GitHub Pages.

**Live:** https://pawelgodkowicz.github.io/

## Stack

Plain HTML, CSS and ES modules — no build step, no framework, no bundler.
The only external dependencies are the Outfit webfont (Google Fonts) and
[Ionicons](https://ionic.io/ionicons) for iconography, both loaded from a CDN.

## Structure

```
index.html              Single page — structure and keys only, no copy
assets/
├── css/style.css       All styling, including the responsive rules
├── js/i18n.js          Translation catalogue (every user-facing string)
├── js/main.js          Locale switching, navigation, clipboard, CV decryption
├── img/                Portrait and favicon
└── docs/resume.enc     The CV as ciphertext — the only version published
tools/
└── encrypt-resume.mjs  Produces resume.enc from a local PDF
private/                Unencrypted CV. Gitignored — never leaves your machine
```

## How translations work

Markup carries **keys**, never text in two languages:

```html
<h1 data-i18n="hero.greeting">Hello!</h1>
```

The element's own content is the English fallback — it is what search engines
index and what a visitor sees if JavaScript fails. On load, `main.js` resolves
the key against `assets/js/i18n.js` and swaps in the active locale.

Attributes use `data-i18n-attr` with `attribute:key` pairs:

```html
<img data-i18n-attr="alt:hobbies.tech.alt" ...>
<a data-i18n-attr="aria-label:header.github;title:header.github" ...>
```

Locale selection order: the visitor's stored preference → their browser
language → English.

### Adding or changing text

Edit `assets/js/i18n.js` only. Both languages live side by side there, so a
missing translation is obvious at a glance.

### Adding a language

1. Add a locale object to `translations` using the same key structure.
2. Add its code to `SUPPORTED_LOCALES`.
3. Extend the switch in the header (currently a two-way PL/EN toggle).

## Running locally

The page uses ES modules, which browsers refuse to load over `file://`.
Serve the folder over HTTP:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

GitHub Pages serves the repository root, so a push to `main` publishes the
site. In **Settings → Pages**, set the source to `Deploy from a branch`,
branch `main`, folder `/ (root)`.

## The encrypted CV

The CV is never published in the clear. `assets/docs/resume.enc` holds
AES-256-GCM ciphertext; the key is derived in the visitor's browser with
PBKDF2-HMAC-SHA256 (310,000 iterations) from the password they type. Nothing
in this repository — not the code, not a config file, not an environment
variable — contains the password. A wrong password fails the GCM
authentication tag, so there is no password comparison to bypass: without the
right one the bytes simply do not decrypt.

The unencrypted PDF lives in `private/`, which is gitignored. It stays on your
machine and never reaches GitHub. **This matters**: GitHub Pages serves whatever
is in the repository, so a plaintext PDF committed anywhere is public
regardless of any gate in front of it.

### Replacing the CV

```bash
# 1. Drop the new PDF into private/ (any filename)
# 2. Re-encrypt — the password is read from stdin, not from a flag,
#    so it never lands in your shell history
node tools/encrypt-resume.mjs private/Your_New_CV.pdf
# 3. Commit only assets/docs/resume.enc
```

Changing the password means nothing more than re-running that command with a
different one. The page reads the salt, IV and iteration count out of the file
itself, so it cannot drift out of step with the encryption script.

### What this does and does not protect against

It protects against anyone downloading the CV without the password — the file
served is useless on its own. It does not protect against someone who has the
password sharing it, nor against brute force if the password is weak. And
anyone who already had the CV keeps their copy.

## Metadata, and what is deliberately missing

`index.html` ships no prose at all — not in the body, not in the head. The
`description` meta tag is created at runtime by `main.js` so that it matches
the active language. Crawlers that execute JavaScript, Google included, read
it normally.

`og:description` is **intentionally absent**. Link-preview crawlers (LinkedIn,
Slack, Facebook) fetch the raw HTML and never run scripts, so a script-injected
value would be invisible to them — there is no point emitting one. The trade-off
is deliberate: a link shared on LinkedIn shows the title and the portrait but no
description text. If you would rather have that description back, add a literal
tag to the head:

```html
<meta property="og:description" content="…">
```

That is the only way it can work, and it means one English sentence lives in
the markup again.

## Notes

- The portrait is served at 675×900 (~930 KB). If it needs to be lighter,
  run it through [squoosh.app](https://squoosh.app) and export WebP.
- Hobby photos are hotlinked from Unsplash. Download and self-host them if
  you would rather not depend on an external CDN.

## License

Code is MIT-licensed (see `LICENSE`). Personal content — text, CV and
photographs — is not covered by that license and remains all rights reserved.
