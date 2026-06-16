# Natural Law — Study Notes

Live site: https://danielleackerman.github.io/natural-law-study/

A static HTML study site for Mark Passio’s three-part lecture series Natural Law: The Real Law of Attraction.

This project turns the lectures into granular, timestamped study outlines with synchronized YouTube playback, slide references, hover previews, lightbox slide viewing, and a structured table of contents.

The root `index.html` is a study library that links to each study. Every study is a self-contained subfolder that shares one root `assets/` folder (css, js, slides). Studies live at:

- `natural-law/` — the original Mark Passio study (landing + three lectures)
- `gateway/` — The Gateway Experience — Wave 1: Discovery (Monroe Institute Hemi-Sync®)
- `_TEMPLATE/` — a blank study skeleton; copy it to add the next study

Adding a study: copy `_TEMPLATE/` to a new lowercase-hyphenated folder, fill in the placeholders, then paste one `<a class="lecture-card">` block into the root `index.html`. The `_TEMPLATE/` folder is underscore-prefixed so GitHub Pages (Jekyll) keeps it out of the published site.

## What this study covers

This study presents Natural Law as an objective moral law governing human behavior. Across the three lectures, the material argues that freedom, order, and human flourishing depend on knowledge, understanding, conscience, and action aligned with moral truth.

## Lecture 01

Lecture 01 introduces the study as an initiation into hidden or esoteric knowledge. It distinguishes the real law of attraction from New Age versions by arguing that desired conditions do not manifest through thought or feeling alone; they require knowledge, understanding, and right action.

Major topics:

- Teachability
- Institutional limiters of consciousness
- The meaning of occult knowledge
- Natural Law as objective truth
- Nescience vs. ignorance
- Truth vs. perception
- Consciousness, thought, emotion, and action

## Lecture 02

Lecture 02 explores human consciousness, brain structure, moral decision-making, imbalance, and Natural Law principles.

Major topics:

- R-complex, limbic system, and neocortex
- Left-brain and right-brain imbalance
- Master mentality and slave mentality
- Intellect vs. true intelligence
- The Seven Hermetic Principles
- The Lost Principle of Care
- The Five Expressions of Natural Law
- Right action vs. wrong action

## Lecture 03

Lecture 03 applies the Natural Law framework to rights, government, coercion, conscience, and moral responsibility.

Major topics:

- No victim, no crime
- Rights as non-delegable
- Taxation, prohibition, licensing, and permits
- Force vs. violence
- Conscience
- Statism and order-following
- The Lost Word
- The Great Work
- The Quantum Shift

## Site features

- Three lecture pages with granular outlines
- Embedded YouTube player
- Clickable timestamps
- Timestamped slide references
- Hover slide popups
- Lightbox slide viewing
- Sticky table of contents
- Dark/light mode toggle
- Static HTML with no build system required

## Project structure

- index.html (study library / hub)
- natural-law/
  - index.html (study landing)
  - lecture-01.html
  - lecture-02.html
  - lecture-03.html
- gateway/
  - index.html (Gateway Experience — Wave 1: Discovery)
- _TEMPLATE/
  - index.html (skeleton for new studies; not published)
- assets/css/main.css
- assets/js/player.js
- assets/slides/lecture-01/
- assets/slides/lecture-02/
- assets/slides/lecture-03/

Pages in study subfolders load shared assets with `../assets/...` and set
`data-asset-base="../"` on `<body>` so the player resolves slide images
against the root `assets/slides/` folder.

## Local preview

Run:

python3 -m http.server 8000

Then open:

open http://localhost:8000/

If port 8000 is busy, use:

python3 -m http.server 8080
open http://localhost:8080/

## GitHub Pages

Published from the main branch using GitHub Pages.

Live site: https://danielleackerman.github.io/natural-law-study/
