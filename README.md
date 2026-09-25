# Paweł Godkowicz — Portfolio

A bilingual (Polish / English) single-page portfolio for a data analyst. Plain
HTML, CSS and ES modules — no framework, no bundler, no build step.

**→ [pawelgodkowicz.github.io](https://pawelgodkowicz.github.io/)**

Two details are worth a look if you came here from the site:

- **No copy in the markup.** `index.html` carries structure and translation
  keys, nothing else. Every user-facing string lives in one catalogue and is
  injected at runtime, so there is no duplicated text in two languages to drift
  apart.
- **The CV is encrypted, not gated.** It ships as AES-256-GCM ciphertext and is
  decrypted in the visitor's browser with a key derived from the password they
  type. The password exists nowhere in this repository, and a wrong one fails
  the authentication tag — there is no check to bypass.

## Stack

Plain HTML, CSS and ES modules. The only external dependencies are the Outfit
webfont (Google Fonts) and [Ionicons](https://ionic.io/ionicons), both from a
CDN. Decryption uses the browser's built-in Web Crypto API — no library.

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
