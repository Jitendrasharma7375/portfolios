# Jitendra Sharma: portfolios

There are four single-page portfolios. Each one is a plain `index.html` with an `assets/` folder for the photos and the resume PDF. There is no build step.

| Folder | Style |
| --- | --- |
| `kinetic/` | Animated, editorial (best as the main site) |
| `sketchbook/` | Illustrated road trip |
| `bughunt/` | Funny comic |
| `levelup/` | 8-bit game |

Each portfolio has these extras:
- a resume download (`assets/Jitendra_Sharma_Resume.pdf`)
- an EN/हिं language toggle
- easter eggs; try the Konami code ↑↑↓↓←→←→BA

## Preview locally

```bash
node D:/Portfolios/serve.js
```

Then open:
- http://localhost:5180/kinetic/
- http://localhost:5180/sketchbook/
- http://localhost:5180/bughunt/
- http://localhost:5180/levelup/

The pages are written without `<!doctype html>` because the claude.ai artifact viewer adds it. `serve.js` adds it locally.

## Deploy (GitHub Pages, free)

Every push to `main` deploys automatically through `.github/workflows/pages.yml`. The workflow runs `node build.js`, which does three things:
- wraps each page in a full HTML document;
- adds link-preview tags, using `og-image.png`;
- adds a landing page where visitors pick a style.

One-time setup on GitHub:
1. Make the repo **Public**. Free Pages needs a public repo.
2. Go to **Settings → Pages → Source** and choose **GitHub Actions**.

The site goes live at `https://<your-username>.github.io/portfolios/`. To preview the build locally, run `node build.js`, then open `_site/`.

## Visitor counter (GoatCounter: free, no cookies)

The counter only runs on the self-hosted site. It is off in the claude.ai viewer, which blocks outside requests and doesn't let public visitors be counted.

1. Create a free account at https://www.goatcounter.com and pick a code, for example `jitendra`.
2. In each `index.html`, near the end, set `var GOATCOUNTER_CODE = 'jitendra';`.
3. Your dashboard at https://jitendra.goatcounter.com shows:
   - page views per portfolio
   - "Resume download" events

## Note

The resume PDF includes the phone number; the web pages don't.
