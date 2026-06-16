/* ============================================================
   PLAYER + INTERACTIVITY
   ============================================================ */

(function () {
  'use strict';

  // ---------- State ----------
  let ytPlayer = null;
  let ytReady = false;
  let currentTimeInterval = null;
  const LECTURE_DIR = document.body.dataset.lecture || 'lecture-01';
  // Path from the current page up to the shared root assets/ folder.
  // Studies live in subfolders (e.g. /natural-law/, /gateway/) and set
  // data-asset-base="../" so slide images resolve to the root assets/.
  const ASSET_BASE = document.body.dataset.assetBase || '';

  // ---------- Helpers ----------
  function tsToSeconds(ts) {
    // "01:23:45" or "23:45" -> seconds
    const parts = ts.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
  }
  function secondsToTs(s) {
    s = Math.floor(s);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
  }
  function slideFilenameFromTs(ts) {
    // "00:13:14" -> "00-13-14.jpg"
    return ts.replace(/:/g, '-') + '.jpg';
  }

  // ---------- YouTube IFrame API ----------
  window.onYouTubeIframeAPIReady = function () {
    const iframe = document.getElementById('yt-player');
    if (!iframe) return;
    ytPlayer = new YT.Player('yt-player', {
      events: {
        onReady: () => {
          ytReady = true;
          startTimeTracking();
        },
      },
    });
  };

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }

  function seekTo(seconds) {
    if (!ytReady || !ytPlayer) return;
    ytPlayer.seekTo(seconds, true);
    ytPlayer.playVideo();
  }

  function startTimeTracking() {
    if (currentTimeInterval) clearInterval(currentTimeInterval);
    currentTimeInterval = setInterval(() => {
      if (!ytReady || !ytPlayer || !ytPlayer.getCurrentTime) return;
      const t = ytPlayer.getCurrentTime();
      updateNowPlaying(t);
    }, 500);
  }

  function updateNowPlaying(seconds) {
    const display = document.querySelector('.now-playing');
    if (display) display.textContent = secondsToTs(seconds);

    // Highlight active timestamp link (closest one <= current time)
    const tsLinks = document.querySelectorAll('.ts');
    let activeLink = null;
    tsLinks.forEach((link) => {
      const t = tsToSeconds(link.dataset.ts);
      if (t <= seconds) activeLink = link;
    });
    tsLinks.forEach((l) => l.classList.toggle('active', l === activeLink));

    // Update TOC active state
    updateTocActive();
  }

  // ---------- Timestamp Click Handler ----------
  document.addEventListener('click', (e) => {
    const ts = e.target.closest('.ts');
    if (ts) {
      e.preventDefault();
      seekTo(tsToSeconds(ts.dataset.ts));
    }
  });

  // ---------- Sticky Player Collapse on Scroll ----------
  function handleScroll() {
    const bar = document.querySelector('.player-bar');
    if (!bar) return;
    bar.classList.toggle('collapsed', window.scrollY > 200);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---------- Slide Popups (Gwern-style) ----------
  let popup = null;
  let popupTimer = null;

  function createPopup() {
    if (popup) return popup;
    popup = document.createElement('div');
    popup.className = 'slide-popup';
    popup.innerHTML = '<img alt=""><div class="caption"><span class="ts-cap"></span><span>click to expand</span></div>';
    document.body.appendChild(popup);
    return popup;
  }

  function showPopup(ref) {
    createPopup();
    const ts = ref.dataset.ts;
    const filename = slideFilenameFromTs(ts);
    const img = popup.querySelector('img');
    const cap = popup.querySelector('.ts-cap');
    img.src = `${ASSET_BASE}assets/slides/${LECTURE_DIR}/${filename}`;
    img.alt = `Slide at ${ts}`;
    cap.textContent = ts;

    // Position near the ref but keep in viewport
    const rect = ref.getBoundingClientRect();
    const popupWidth = 480;
    let left = rect.left + window.scrollX;
    if (left + popupWidth > window.innerWidth - 16) {
      left = window.innerWidth - popupWidth - 16;
    }
    if (left < 16) left = 16;
    const top = rect.bottom + window.scrollY + 8;

    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.classList.add('visible');
  }

  function hidePopup() {
    if (popup) popup.classList.remove('visible');
  }

  document.addEventListener('mouseover', (e) => {
    const ref = e.target.closest('.slide-ref');
    if (ref) {
      clearTimeout(popupTimer);
      showPopup(ref);
    }
  });
  document.addEventListener('mouseout', (e) => {
    const ref = e.target.closest('.slide-ref');
    if (ref) {
      popupTimer = setTimeout(hidePopup, 200);
    }
    if (popup && popup.contains(e.relatedTarget)) {
      clearTimeout(popupTimer);
    }
  });
  document.addEventListener('mouseover', (e) => {
    if (popup && popup.contains(e.target)) clearTimeout(popupTimer);
  });
  document.addEventListener('mouseout', (e) => {
    if (popup && popup.contains(e.target) && !popup.contains(e.relatedTarget)) {
      popupTimer = setTimeout(hidePopup, 200);
    }
  });

  // Click slide-ref or popup -> seek video + open lightbox
  document.addEventListener('click', (e) => {
    const ref = e.target.closest('.slide-ref');
    if (ref) {
      e.preventDefault();
      seekTo(tsToSeconds(ref.dataset.ts));
      openLightbox(ref.dataset.ts);
    }
    if (popup && popup.contains(e.target) && e.target.tagName === 'IMG') {
      const ts = popup.querySelector('.ts-cap').textContent;
      openLightbox(ts);
    }
  });

  // ---------- Lightbox ----------
  let lightbox = null;
  function createLightbox() {
    if (lightbox) return lightbox;
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<img alt=""><div class="lightbox-caption"></div>';
    document.body.appendChild(lightbox);
    lightbox.addEventListener('click', () => lightbox.classList.remove('visible'));
    return lightbox;
  }
  function openLightbox(ts) {
    createLightbox();
    const img = lightbox.querySelector('img');
    const cap = lightbox.querySelector('.lightbox-caption');
    img.src = `${ASSET_BASE}assets/slides/${LECTURE_DIR}/${slideFilenameFromTs(ts)}`;
    cap.textContent = `Slide at ${ts}  ·  click anywhere to close`;
    lightbox.classList.add('visible');
    hidePopup();
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('visible')) {
      lightbox.classList.remove('visible');
    }
  });

  // ---------- TOC Active State ----------
  function updateTocActive() {
    const headings = document.querySelectorAll('.outline h2[id]');
    if (!headings.length) return;
    const playerHeight = document.querySelector('.player-bar')?.offsetHeight || 0;
    const offset = playerHeight + 100;
    let active = null;
    headings.forEach((h) => {
      const rect = h.getBoundingClientRect();
      if (rect.top - offset <= 0) active = h;
    });
    document.querySelectorAll('.toc a').forEach((a) => {
      a.classList.toggle('active', active && a.getAttribute('href') === '#' + active.id);
    });
  }
  window.addEventListener('scroll', updateTocActive, { passive: true });

  // ---------- Theme Toggle ----------
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  document.addEventListener('click', (e) => {
    if (e.target.closest('.theme-toggle')) {
      const current = document.documentElement.dataset.theme;
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('theme', next);
      e.target.closest('.theme-toggle').textContent = next === 'light' ? 'DARK MODE' : 'LIGHT MODE';
    }
  });
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.textContent = document.documentElement.dataset.theme === 'light' ? 'DARK MODE' : 'LIGHT MODE';
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    loadYouTubeAPI();
    handleScroll();
    updateTocActive();
  });
})();
