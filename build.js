// Builds the static site for GitHub Pages into _site/:  node build.js
// Each portfolio's index.html is written without <!doctype>/<head>/<body> (the claude.ai artifact
// viewer adds those), so this wraps every page in a full document, moves its <title>/<link>/<style>
// into <head>, adds link-preview tags, copies assets, and writes a landing page that links all four.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, '_site');

const repo = process.env.GITHUB_REPOSITORY || '';            // e.g. "Jitendrasharma7375/portfolios"
const [owner, name] = repo.split('/');
const SITE_URL = (process.env.SITE_URL || (owner ? `https://${owner.toLowerCase()}.github.io/${name}/` : '')).replace(/\/?$/, '/');

const PORTFOLIOS = [
  { dir: 'kinetic', label: 'Kinetic', kind: 'Animated', blurb: 'Giant kinetic type, a hexagon portrait, a scroll-zoom showpiece and a pinned project reel.' },
  { dir: 'sketchbook', label: 'Sketchbook', kind: 'Illustrated', blurb: 'A hand-drawn road trip from Jaipur to Hyderabad that draws itself as you scroll.' },
  { dir: 'bughunt', label: 'Bug Hunt', kind: 'Funny', blurb: 'A comic-book developer who reacts to your scrolling. Squash the bugs to reveal the skills.' },
  { dir: 'levelup', label: 'Level Up', kind: '8-bit game', blurb: 'Scroll to run a pixel hero through four career worlds, ? blocks and two boss fights.' },
];
const SUMMARY = 'Jitendra Sharma, Software Developer at Smartdocs, Hyderabad. Java, Spring Boot, Angular and AI agents.';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const ICON = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,3 93,27 93,73 50,97 7,73 7,27" fill="#ff6a2b"/><text x="50" y="64" font-family="Arial,sans-serif" font-size="38" font-weight="700" text-anchor="middle" fill="#0b1322">JS</text></svg>');

function head({ title, description, url, image, extra = '' }) {
  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="icon" href="${ICON}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    url ? `<meta property="og:url" content="${esc(url)}">` : '',
    image ? `<meta property="og:image" content="${esc(image)}">` : '',
    `<meta name="twitter:card" content="summary_large_image">`,
    extra,
  ].filter(Boolean).join('\n');
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const p of PORTFOLIOS) {
  const src = fs.readFileSync(path.join(ROOT, p.dir, 'index.html'), 'utf8');
  // The leading run of <title>, <link>, <meta> and <style> tags belongs in <head>.
  const lead = src.match(/^(?:\s+|<title>[\s\S]*?<\/title>|<link\b[^>]*>|<meta\b[^>]*>|<style\b[^>]*>[\s\S]*?<\/style>)+/);
  const headTags = lead ? lead[0].trim() : '';
  const body = lead ? src.slice(lead[0].length) : src;
  const title = (headTags.match(/<title>([\s\S]*?)<\/title>/) || [, `Jitendra Sharma · ${p.label}`])[1];
  const url = SITE_URL ? SITE_URL + p.dir + '/' : '';
  const html = '<!doctype html>\n<html lang="en">\n<head>\n' +
    head({ title, description: `${p.blurb} ${SUMMARY}`, url, image: SITE_URL ? SITE_URL + 'og-image.png' : '' }) +
    '\n' + headTags + '\n</head>\n<body>\n' + body.trim() + '\n</body>\n</html>\n';
  fs.mkdirSync(path.join(OUT, p.dir), { recursive: true });
  fs.writeFileSync(path.join(OUT, p.dir, 'index.html'), html);
  copyDir(path.join(ROOT, p.dir, 'assets'), path.join(OUT, p.dir, 'assets'));
}

// Landing page: pick a style.
const cards = PORTFOLIOS.map((p, i) => `
    <a class="card c${i}" href="${p.dir}/">
      <span class="kind">${esc(p.kind)}</span>
      <span class="name">${esc(p.label)}</span>
      <span class="blurb">${esc(p.blurb)}</span>
      <span class="go">Open ${esc(p.label)} →</span>
    </a>`).join('');

const landing = `<!doctype html>
<html lang="en">
<head>
${head({ title: 'Jitendra Sharma · Portfolio', description: SUMMARY + ' Four portfolios, one developer: pick a style.', url: SITE_URL, image: SITE_URL ? SITE_URL + 'og-image.png' : '' })}
<title>Jitendra Sharma · Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;600;700;800&display=swap">
<style>
:root{color-scheme:dark;--ink:#0b1322;--ink2:#111b2e;--line:rgba(241,236,228,.14);--paper:#f1ece4;--mute:#95a1b6;--accent:#ff6a2b}
*{box-sizing:border-box}
body{margin:0;background:var(--ink);color:var(--paper);font:400 16px/1.6 Manrope,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
.wrap{max-width:1160px;margin:0 auto;padding:clamp(40px,8vw,96px) clamp(16px,4vw,48px) 48px}
.top{display:flex;align-items:center;gap:20px;flex-wrap:wrap}
.top img{width:96px;height:110px;object-fit:cover;object-position:50% 24%;clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)}
h1{margin:0;font:400 clamp(48px,9vw,112px)/.9 Anton,Impact,"Arial Narrow Bold",sans-serif;text-transform:uppercase;letter-spacing:.005em}
h1 span{color:var(--accent)}
.lede{margin:18px 0 0;max-width:56ch;color:var(--mute);font-size:clamp(16px,1.6vw,19px)}
.pick{margin:clamp(40px,6vw,64px) 0 16px;font:700 12px/1 Manrope,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.card{display:flex;flex-direction:column;gap:10px;min-height:250px;padding:24px;border:1px solid var(--line);border-radius:20px;background:var(--ink2);color:inherit;text-decoration:none;transition:transform .25s,border-color .25s}
.card:hover,.card:focus-visible{transform:translateY(-4px);border-color:var(--accent)}
.card:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
.kind{font:700 11px/1 Manrope,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:var(--accent)}
.name{font:400 40px/1 Anton,Impact,sans-serif;text-transform:uppercase}
.blurb{color:var(--mute);font-size:15px;flex:1}
.go{font-weight:700}
.c1 .kind{color:#f2b134}.c2 .kind{color:#ffd43b}.c3 .kind{color:#4fd6e8}
.foot{display:flex;flex-wrap:wrap;gap:12px 24px;margin-top:40px;padding-top:20px;border-top:1px solid var(--line);color:var(--mute);font-size:14px}
.foot a{color:var(--paper)}
@media (prefers-reduced-motion:reduce){.card{transition:none}.card:hover{transform:none}}
</style>
</head>
<body>
<main class="wrap">
  <div class="top">
    <img src="kinetic/assets/headshot.webp" width="96" height="110" alt="Jitendra Sharma">
    <h1>Jitendra<br><span>Sharma</span></h1>
  </div>
  <p class="lede">Software Developer at Smartdocs, Hyderabad. Java backend, Angular front, AI agents in between. One developer, four ways to meet him.</p>
  <p class="pick">Pick a style</p>
  <nav class="grid" aria-label="Portfolios">${cards}
  </nav>
  <p class="foot">
    <span>jitendra.sharma7375@gmail.com</span>
    <a href="https://github.com/jitendrasharma7375">GitHub</a>
    <a href="https://linkedin.com/in/jitendrasharma7375">LinkedIn</a>
    <a href="kinetic/assets/Jitendra_Sharma_Resume.pdf" download>Download resume (PDF)</a>
  </p>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), landing);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
if (fs.existsSync(path.join(ROOT, 'og-image.png'))) fs.copyFileSync(path.join(ROOT, 'og-image.png'), path.join(OUT, 'og-image.png'));
console.log('Built _site/ for', SITE_URL || '(no SITE_URL; link previews use relative paths)', '-', PORTFOLIOS.map(p => p.dir).join(', '));
