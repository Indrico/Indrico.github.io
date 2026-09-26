# AGENTS.md

Guide for AI coding agents working on this repo. Read it fully before editing anything.
The human-oriented guide (in Indonesian) is `README.md`.

## What this is

Personal portfolio landing page for **Indrico Jowensen**, Backend Software Engineer.
It's one static page: plain HTML + CSS + vanilla JavaScript. There is no framework, no build step, no package manager and no dependencies. Keep it that way unless the owner asks otherwise.

- **Live:** https://indrico.github.io/ (GitHub Pages, deployed from branch `main`, folder `/`).
- **Repo:** `github.com/Indrico/Indrico.github.io`. That repo name is what makes the site live at the root URL, so never rename it.
- **Deploying:** every push to `main` goes live in about a minute.

## Files

| Path | Purpose |
|---|---|
| `index.html` | All page content. Each section is marked with a `<!-- ===== Name ===== -->` comment: header, hero (with the animated pipeline SVG), metrics, about, expertise, work (case studies), experience, stack, principles, contact, footer. |
| `assets/css/styles.css` | Design tokens at the top (`:root` = dark default, `[data-theme="light"]` = light), then layout per section. |
| `assets/js/main.js` | Theme toggle (`localStorage` key `theme`), mobile nav, scroll spy, reveal-on-scroll, count-up (`[data-count]`), card spotlight, contact form submit, hero pipeline simulation (`initPipeline`). |
| `assets/img/og-image.png` | 1200×630 social preview. It's rendered from HTML with headless Chromium. Re-render it whenever the name, headline or stack chips change. |
| `assets/img/favicon.svg`, `apple-touch-icon.png` | "IJ." monogram. |
| `landing-page-indrico/index.html` | Redirect from the old URL (`/landing-page-indrico/`). Keep it. |
| `.nojekyll` | Makes GitHub Pages serve files as-is. Keep it. |

Preview locally with `python3 -m http.server 8000`, then open http://localhost:8000.

## Confidentiality rules (critical)

The repo, its git history and the website are all **public**. The owner is bound by a confidentiality agreement with their employer.

1. **Never name the employer, clients, suppliers or vendors**, and don't add details that could identify them. This applies everywhere: page text, HTML comments, alt text, CSS/JS comments, README, commit messages and images.
   - Employer: "Enterprise software company", with name withheld.
   - Clients: industries only (Banking, Insurance, Logistics, Government).
   - Messaging vendors: "third-party messaging providers". "WhatsApp Business Platform" is fine, since it's a public product.
2. **No personal contact data.** No email address, phone number, street address or ID numbers. The location is "Greater Jakarta, Indonesia" only. Visitors reach the owner through the contact form only.
3. **Never commit documents** (`*.pdf`, `*.docx`, etc.). The owner keeps private documents in the working folder; they are git-ignored. Never `git add -f` them. Never deploy by uploading the folder to a drag-and-drop host.
4. **Commit identity:** use the repo-local git identity, which is a GitHub noreply address. Don't override it.
5. **Local pre-commit hook:** `.git/hooks/pre-commit` exists on the owner's machine but is not versioned. It blocks confidential terms, documents and the wrong identity. Never bypass it with `--no-verify`. On a fresh clone without the hook, ask the owner before committing any new work-history content.
6. **Don't invent metrics or achievements.** Only use figures from the owner's CV: 6+ years, 100K+ transactions/day, millions of MySQL records, 3 channels (WhatsApp, SMS, Email), 4 industries; React modernization: React 18 + Vite, 55 peer-dependency conflicts resolved, 36 high/critical vulnerabilities eliminated, tests 76 → 170.
7. **If something sensitive gets committed:** if it hasn't been pushed, rewrite the commit before pushing. If it has been pushed, stop and tell the owner.

## Content and tone

- The display name is **"Indrico Jowensen"** everywhere: title, meta tags, hero, footer and OG image. Don't add another surname.
- The page is a **portfolio, not a job application.** Don't add:
  - availability badges or "open to work / opportunities"
  - "hire me" or "request CV" calls to action
  - recruiter-oriented form topics
  - freelance or service offers
- All copy is in **English**.

## Design rules

- **Theme:** blue. Use colors only through the CSS variables in `styles.css`, and make sure both dark and light themes look right.
- **Fonts:** Geist (text) and Geist Mono (labels/code). **Don't use serif or italic display fonts.** Accent words use `<em>` inside `h1`/`h2`: same font, `var(--accent-text)` blue, normal style.
- **Motion and no-JS:** respect `prefers-reduced-motion`. Content must stay visible without JavaScript: reveal animations only apply under `html.js`.
- **Layout:** must work down to 360px width with no horizontal scroll.

## Contact form

The form posts to Web3Forms (`https://api.web3forms.com/submit`).
- **Access key:** the hidden input `access_key` in `index.html`. It's public by design.
- **Spam protection:** a honeypot field, `botcheck`.
- **Topics:** `hello`, `tech`, `other`.
- **Testing:** every real submission lands in the owner's inbox. Mock the API when testing, e.g. with Playwright `page.route`, and don't send real submissions without the owner's OK.

## Before you commit

- [ ] Check the page locally at desktop and 360–390px widths, in both themes, with no console errors.
- [ ] `git ls-files` contains no documents.
- [ ] `git log -1 --format='%ae'` is the noreply address.
- [ ] `og-image.png` has been re-rendered if the name, headline or stack changed.
- [ ] The commit message follows the confidentiality rules above.

After pushing, check the deploy with `gh api repos/Indrico/Indrico.github.io/pages/builds/latest --jq .status`.
