# Natural Law — Study Notes

Static HTML study site for a three-part lecture series. Built for GitHub Pages.

## Structure

```
.
├── index.html              # Landing page (links to all three lectures)
├── lecture-01.html         # Lecture 01 outline page
├── lecture-02.html         # Lecture 02 outline page
├── lecture-03.html         # Lecture 03 outline page
└── assets/
    ├── css/main.css        # Shared styling (source of truth)
    ├── js/player.js        # YouTube sync + popups + lightbox + TOC
    └── slides/
        ├── lecture-01/     # Timestamped JPGs: HH-MM-SS.jpg
        ├── lecture-02/
        └── lecture-03/
```

## Features

- **Sticky YouTube player** at the top of each lecture page, collapses on scroll.
- **Clickable timestamps** — click any `[00:13:14]` to seek the video.
- **Now-playing indicator** in the player metadata tracks the current time.
- **Gwern-style slide popups** — hover any `slide` link to preview, click to seek + lightbox.
- **Sticky TOC sidebar** with active-section highlighting.
- **Dark/light mode toggle**, persists via localStorage.
- **Keyboard:** Esc closes lightbox.

## Authoring outlines

Each outline item uses one of these tags as a label:

| Tag | Color | Meaning |
|---|---|---|
| `CORE` | accent | speaker's main point |
| `DETAIL` | muted | specific data, example, sub-point |
| `LOGIC` | amber | step in a "why" chain |
| `TANGENT` | muted italic | side-quest the speaker takes |
| `NUANCE` | muted | aside, caveat |
| `QUOTE` | muted | verbatim quotation |

Inline elements:
- `<a class="ts" data-ts="00:13:14">00:13:14</a>` — clickable timestamp
- `<a class="slide-ref" data-ts="00:13:14">slide</a>` — popup-triggering slide reference
- `<span class="power">"Divine Call"</span>` — speaker's exact "power word"

Slide filenames must match the `data-ts` value with `:` replaced by `-`, e.g. `00:13:14` → `00-13-14.jpg`.

## Deploy

1. Commit and push to a GitHub repo.
2. Settings → Pages → Source: `main` branch, `/` root.
3. Done.
