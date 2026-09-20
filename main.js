/* ═══════════════════════════════════════════════════════════════
  FIESTA JUMPS — MAIN JS v3
  No dependencies · WordPress-ready · Full feature set
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── DOM refs ──────────────────────────────────────────────── */
  const ptCurtain = document.getElementById('ptCurtain');
  const siteHeader = document.getElementById('siteHeader');
  const burgerBtn = document.getElementById('burgerBtn');
  const mobDrawer = document.getElementById('mobDrawer');
  const cartBtn = document.getElementById('cartBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartCount = document.getElementById('cartCount');
  const revTrack = document.getElementById('revTrack');
  const revPrev = document.getElementById('revPrev');
  const revNext = document.getElementById('revNext');
  const revDots = document.getElementById('revDots');
  const heroLocText = document.getElementById('heroLocText');
  const mapGeoNote = document.getElementById('mapGeoNote');
  const mapGeoText = document.getElementById('mapGeoText');

  /* ══════════════════════════════════════════════════════════════
    PAGE TRANSITION — Overlay div fade (Framer-style)
    Uses a dedicated #fj-overlay div instead of html opacity.
    This prevents the blank-page flash on mobile Safari/Chrome
    that happens when opacity is set on <html> or <body>.

    On load:    overlay fades OUT (page appears from black)
    On click:   overlay fades IN  (page disappears to black)
    On back:    pageshow event resets overlay instantly
  ═══════════════════════════════════════════════════════════════ */
  /* ══ LIVE PRICES: Google Sheet, read straight from the browser ═
     Your price sheet is fetched as CSV on every page (no server needed, so it
     works on localhost, GitHub Pages and WordPress alike) and the numbers on
     the product cards + the Details popup are swapped for the sheet's.

     How a sheet row finds its product card:
       1. "Web ID" column (optional). Type the product's id there, i.e. the
          value after ?item= in its Get Quote link. Several ids can share one
          row, separated by commas.
       2. Otherwise the row's Item Name is looked up in PRICE_NAME_MAP below.
     Products with no matching row simply keep the price already in the HTML,
     and if the sheet can't be reached nothing changes at all.
  ════════════════════════════════════════════════════════════ */
  // "Fiesta Jumps Prices (website)": one flat tab holding every product on the site. It must be shared
  // as "Anyone with the link: Viewer". Only its first tab is read.
  const PRICE_SHEET_ID = '1m6kAjiEGG3M5-mG4sRrAWLy7DDX4WWNn_roi5En_icU';
  const PRICE_SHEET_URL =
    'https://docs.google.com/spreadsheets/d/' + PRICE_SHEET_ID + '/gviz/tq?tqx=out:csv';
  const PRICE_CACHE_KEY = 'fj-sheet-prices';
  const PRICE_REFRESH_MS = 5 * 60 * 1000;

  // sheet Item Name (lowercase)  ->  product ids on the site
  const PRICE_NAME_MAP = {
    // classic bounce houses
    'rainbow castle': ['rainbow-castle-bounce-house'],
    'red castle bounce house': ['red-castle-bounce-house'],
    'tropical bouncer': ['tropical-bounce-house'],
    'pink castle': ['pink-castle'],
    'tropical bounce house': ['tropical-bouncer-large'],
    'rainbow castle bounce house': ['rainbow-castle-large-bouncer', 'rainbow-castle-large'],
    'unicorn bounce house': ['unicorn-bounce-house-largee'],
    'pink castle bounce house': ['pink-castle-large-bounce-house', 'pink-castle-large'],
    'lava castle w/ basketball hoop': ['lava-castle-16x16-w-basket-ball-hoop', 'lava-castle'],
    'white castle': ['white-castle-bouncer'],
    // combos
    'pink mini combo #1': ['pink-mini-combo-1'],
    'pink mini combo #2': ['pink-mini-combo-2'],
    'tropical mini combo': ['tropical-mini-combo'],
    'sports combo': ['sports-mini-combo'],
    'hot air balloon mini combo': ['hot-air-balloon-mini-combo-2'],
    'castle combo': ['castle-medium-combo'],
    'tropical medium combo': ['tropical-medium-combo'],
    'dalmation 5-in-1 combo': ['dalmatian-5-in-1-combo'],
    'blue gray castle 5-in-1 combo': ['blue-grey-castle-5in1-combo'],
    'candy kidzone': ['candy-kidzone'],
    'princess kidzone': ['princess-kidzone'],
    'giant combo 3 in 1': ['giant-3in1-combo'],
    'tropical water combo': ['tropical-water-combo'],
    // slides
    'king croc 28 ft dual slide': ['king-croc-28-ft-dual-slide'],
    '27 ft super dual slide': ['27-super-dual-slide'],
    "24' super dual slide": ['24-ft-dual-slide'],
    'climb & slide': ['climb-slide'],
    'tropical water slide': ['tropical-water-slide'],
    'giant dual water slides': ['giant-dual-water-slides'],
    // obstacle courses
    'mini obstacle course': ['mini-obstacle-course-35-ft'],
    'wacky mini obstacle course': ['35-ft-wacky-obstacle-course'],
    'high voltage mini obstacle course': ['high-voltage-mini-obstacle-course'],
    'ocean obstacle course': ['50-ft-ocean-obstacle-course'],
    'obstacle course (55 ft)': ['55-ft-obstacle-course'],
    'obstacle course (65 ft)': ['65ft-obstacle-course'],
    '75 ft obstacle course': ['75-ft-obstacle-course'],
    '85 ft obstacle challenge course': ['85-ft-obstacle-challenge-course'],
    '100 ft ultimate obstacle challenge': ['100-ft-ultimate-obstacle-challenge'],
    '150 ft mega obstacle challenge': ['150-ft-ultra-obstacle'],
    // interactive + carnival games
    'dunk tank': ['dunk-tank'],
    'water tag maze (incl. water guns & vests for 6 players)': ['water-tag-maze'],
    'velcro wall': ['velcro-wall'],
    'lazer tag maze (incl. lazer guns & vests for 6 players)': ['lazer-tag-maze'],
    'basketball shootout (incl. 4 basketballs)': ['basketball-shootout'],
    'boxing ring (incl. 4 jumbo boxing gloves & headgear)': ['boxing-ring'],
    'football throw (incl. 2 footballs)': ['football-throw'],
    'bungee run': ['bungee-run'],
    'sumo suits with mat': ['sumo-suits-with-mat'],
    'joust gladiator arena (incl. 2 joust sticks & 2 headgears)': ['joust-gladiator-arena'],
    'floor is lava wrecking ball': ['lava-is-floor-wrecking-ball'],
    'play-a-round golf (3-hole mini golf)': ['play-around-golf-3-holes'],
    'mechanical bull': ['mechanical-bull-with-mat'],
    'stand the bottle (floor table, one bottle, two sticks)': ['stand-the-bottle'],
    'jumping frog (floor table, game table, launcher, rubber mallet, two frogs)': ['jumping-frog'],
    'hole in one (floor table, two golf balls, golf club)': ['hole-in-one'],
    '3 milk cans (canopy, walls, floor table, stand, 3 milk cans, 2 soft balls)': ['3-milk-cans'],
    'basket toss (floor table, basket stand, two balls)': ['basket-toss'],
    'marvels game (2 floor tables, 4 game tables & marbles)': ['marvels-game'],
    // tents
    'instant pop up white canopy 10x10': ['instant-pop-up-white-canopy-10x10'],
    'carnival canopy red/white 10x10': ['carnival-canopy-red-white-9x9'],
    'white canopy 20x20 (walls included)': ['white-canopy-20x20-walls-included'],
    'white canopy 20x30 (walls included)': ['white-canopy-20-x-30-walls-included'],
    // concessions + foam
    'cotton candy machine': ['cotton-candy-machine'],
    'popcorn machine': ['pop-corn-machine'],
    'snow cone machine': ['snow-cone-machine'],
    'extra 50 servings supplies': ['additional-50-serving-supplies-for-concession-machine-2'],
    'foam cannon (incl. 2 foam bottles, enough for 2 hours)': ['foamtastik-cannon'],

    // products that are not in the sheet yet: paste price-sheet/rows-to-add.tsv under the last row and these go live too
    "hot air balloon bouncer large": ["hot-air-balloon-bouncer-large-2", "hot-air-balloon"],
    "mini castle 9'x9'": ["mini-castle"],
    "red castle large": ["red-castle-large"],
    "sports large bouncer": ["sports-large-bouncer"],
    "under the sea large bouncer": ["under-the-sea-large-bouncer"],
    "castle mini combo": ["castle-mini-combo"],
    "crayons mini combo": ["crayons-mini-combo"],
    "wacky castle 5-in-1 combo": ["wacky-castle-5in1-combo"],
    "concession station": ["concession-station"],
    "15ft high striker": ["15ft-high-striker"],
    "6 ft kiddie striker": ["6-ft-kiddie-striker-2"],
    "rock & joust": ["rock-joust"],
    "50 ft wacky obstacle course": ["50-ft-wacky-obstacle-course"],
    "50ft high voltage obstacle course": ["50-ft-high-voltage-obstacle-course"],
    "90ft high voltage obstacle challenge": ["90-ft-high-voltage-obstacle-challenge"],
    "retro mirror booth": ["retro-mirror-booth"],
    "trackless train (12-18 passengers)": ["trackless-train-12-18-passengers"],
    "trackless train (18-24 passengers)": ["trackless-train-18-24-passengers"],
    "generator 3500 watts": ["generator-3500-watts"],
    "generator 8000 watts": ["generator-8000-watts"],
    "fully staffed attendants for inflatables (minimum 4hrs)": ["fully-staffed-attendants-for-inflatables"],
    "cocktail tables / high table": ["cocktail-tables"],
    "folding chairs": ["folding-chairs"],
    "kid chair": ["kid-chair"],
    "kids table": ["kids-table"],
    "linen": ["linen"],
    "long table": ["long-table"],
    "resin chair": ["resin-chair"],
    "round table": ["round-table"],
    "white canopy 20x30 tent": ["white-canopy-20x30-tent"],
    "white canopy 20x40 tent": ["white-canopy-20x40-tent"],
    "basic package: save $56.00": ["basic-package-save-56-00"],
    "deluxe package save $100": ["deluxe-package-save-100"],
    "corporate package save $150": ["corporate-package-save-150"],
    "wet package deals save $126": ["wet-package-deals-save-126"]
  };

  function parseSheetCsv(text) {
    const rows = [];
    let row = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQ) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
        } else cur += ch;
      } else if (ch === '"') inQ = true;
      else if (ch === ',') { row.push(cur); cur = ''; }
      else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (ch !== '\r') cur += ch;
    }
    if (cur.length || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }

  // CSV text  ->  { product id: dollars }
  function sheetPricesBySlug(csv) {
    const table = parseSheetCsv(csv);
    // Column positions come from whichever row says "Price" (Google's own header line, or a
    // repeated "Item Name / Price" row inside a tab). Without one, the usual layout applies:
    // name in column A, price in column C. A flat layout with "Category" first also works.
    let nameCol = 0;
    let priceCol = 2;
    let idCol = -1;
    const out = {};
    for (let r = 0; r < table.length; r++) {
      const row = table[r];
      if (row.some(c => /^price$/i.test((c || '').trim()))) {
        priceCol = row.findIndex(c => /^price$/i.test((c || '').trim()));
        idCol = row.findIndex(c => /web\s*id/i.test(c || ''));
        const n = row.findIndex(c => /item\s*name/i.test(c || ''));
        nameCol = n >= 0 ? n : 0;
        continue;
      }
      const name = (row[nameCol] || '').replace(/\s+/g, ' ').trim();
      const price = Number(String(row[priceCol] || '').replace(/[^0-9.]/g, ''));
      if (!name || !price) continue; // section titles, blank prices: leave the page as it is
      const ids = (idCol >= 0 ? String(row[idCol] || '').split(/[,;\s]+/) : [])
        .concat(PRICE_NAME_MAP[name.toLowerCase()] || [])
        .filter(Boolean);
      ids.forEach(id => { out[id.toLowerCase()] = Math.round(price); });
    }
    return out;
  }

  function applySheetPrices(bySlug) {
    let applied = 0;
    document.querySelectorAll('[data-book*="item="], a[href*="item="]').forEach(el => {
      const m = (el.getAttribute('data-book') || el.getAttribute('href') || '').match(/[?&]item=([^&]+)/);
      if (!m) return;
      const price = bySlug[decodeURIComponent(m[1]).toLowerCase()];
      if (price == null) return;
      applied++;
      if (el.hasAttribute('data-price')) el.setAttribute('data-price', 'from $' + price);
      const card = el.closest('.pcard, .pc');
      if (!card) return;
      // swap only the number so the emoji / "· 12-18 passengers" text around it survives
      card.querySelectorAll('.pcard-tag--warm, .pc-size, .pcard-tag--green').forEach(tag => {
        // green tags also hold "Save $56" style badges, so only touch the ones that read "From $..."
        if (tag.classList.contains('pcard-tag--green') && !/^\s*from\s*\$/i.test(tag.textContent)) return;
        tag.textContent = tag.textContent.replace(/\$\s?[\d,]+(?:\.\d+)?/, () => '$' + price);
      });
    });
    document.documentElement.dataset.pricesApplied = String(applied);
  }

  function initLivePrices() {
    // Same-tab cache: the next page shows the latest prices instantly instead of
    // flashing the old ones while the sheet loads again.
    let cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(PRICE_CACHE_KEY)); } catch (e) { }
    if (cached && cached.prices) applySheetPrices(cached.prices);

    // If the sheet can't be reached, every product keeps the price already in the HTML.
    const load = () => {
      fetch(PRICE_SHEET_URL, { cache: 'no-store' })
        .then(r => (r.ok ? r.text() : ''))
        .catch(() => '')
        .then(csv => {
          const prices = sheetPricesBySlug(csv);
          if (!Object.keys(prices).length) return;
          applySheetPrices(prices);
          try { sessionStorage.setItem(PRICE_CACHE_KEY, JSON.stringify({ t: Date.now(), prices })); } catch (e) { }
        });
    };

    if (!cached || Date.now() - cached.t > PRICE_REFRESH_MS / 5) load();
    setInterval(load, PRICE_REFRESH_MS); // an open tab picks up sheet edits
  }

  function initPageTransitions() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches;
    const DARK = '#1C1410';
    const outMs = reduce ? 0 : 280;

    // Enter/refresh: remove first-paint boot cover (no late overlay pop)
    const reveal = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.classList.remove('fj-booting');
        });
      });
    };
    if (document.documentElement.classList.contains('fj-booting')) {
      reveal();
    }

    // Exit navigation overlay (created lazily, starts hidden)
    let overlay = document.getElementById('fj-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'fj-overlay';
      document.body.appendChild(overlay);
    }
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: DARK,
      zIndex: '99999',
      opacity: '0',
      display: 'none',
      pointerEvents: 'none',
      transition: reduce ? 'none' : 'opacity 0.28s ease',
      willChange: 'opacity',
    });

    window.addEventListener('pageshow', (e) => {
      if (!e.persisted) return;
      document.documentElement.classList.remove('fj-booting');
      overlay.style.transition = 'none';
      overlay.style.opacity = '0';
      overlay.style.display = 'none';
    });

    // Safety: never leave boot cover stuck
    setTimeout(() => {
      document.documentElement.classList.remove('fj-booting');
      document.getElementById('fj-boot-style')?.remove();
    }, 1200);

    const prefetched = new Set();
    let isNavigating = false;

    function isInternal(href, target) {
      if (!href || target === '_blank') return false;
      if (
        href.startsWith('#') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:')
      ) return false;
      if (
        href.startsWith('http') &&
        !href.startsWith(window.location.origin)
      ) return false;
      return true;
    }

    function getHref(link) {
      const raw = link.getAttribute('href') || '';
      return window.FJ_ROUTER ? window.FJ_ROUTER.resolve(raw) : raw;
    }

    function prefetchUrl(url) {
      if (!url || prefetched.has(url)) return;
      if (window.FJ_ROUTER?.isNodeServer) {
        const slug = url.replace(window.location.origin, '');
        if (!window.FJ_ROUTER.map[slug]) return;
      }
      prefetched.add(url);
      const l = document.createElement('link');
      l.rel = 'prefetch';
      l.as = 'document';
      l.href = url;
      document.head.appendChild(l);
    }

    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a.fj-link');
      if (!link) return;
      const h = getHref(link);
      if (isInternal(h, link.target)) prefetchUrl(h);
    }, { passive: true });

    document.addEventListener('touchstart', (e) => {
      const link = e.target.closest('a.fj-link');
      if (!link) return;
      const h = getHref(link);
      if (isInternal(h, link.target)) prefetchUrl(h);
    }, { passive: true });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a.fj-link');
      if (!link || isNavigating) return;
      const h = getHref(link);
      if (!isInternal(h, link.target)) return;

      e.preventDefault();
      isNavigating = true;

      overlay.style.display = 'block';
      overlay.style.transition = reduce ? 'none' : 'opacity 0.28s ease';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.opacity = '1';
        });
      });

      fetch(h, { credentials: 'same-origin', cache: 'force-cache' })
        .catch(() => null);

      setTimeout(() => {
        window.location.href = h;
      }, outMs + 20);
    });
  }

  /* ══ STICKY HEADER ══════════════════════════════════════════ */
  function initHeader() {
    if (!siteHeader) return;
    const update = () => siteHeader.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ══ MEGA DROPDOWN ══════════════════════════════════════════ */
  function initDropdowns() {
    const items = document.querySelectorAll('.hdr-nav-item.has-drop');
    const timers = {};
    const repositioners = [];

    items.forEach((item, i) => {
      const btn = item.querySelector('.hdr-nav-btn');
      const panel = item.querySelector('.drop-panel');

      // Anchor the panel under its own button (so the mouse never has far to
      // travel and the hover-out timer doesn't fire before it gets there),
      // but clamp it so it still can't run off either edge of the viewport.
      const positionPanel = () => {
        if (!panel || !btn) return;
        const margin = 16;
        const btnRect = btn.getBoundingClientRect();
        const half = panel.offsetWidth / 2;
        const min = half + margin;
        const max = window.innerWidth - half - margin;
        const center = Math.max(min, Math.min(btnRect.left + btnRect.width / 2, max));
        panel.style.left = `${center}px`;
      };
      repositioners.push({ item, positionPanel });

      const open = () => {
        clearTimeout(timers[i]);
        closeAll();
        item.classList.add('drop-open');
        btn && btn.setAttribute('aria-expanded', 'true');
        positionPanel();
      };
      const close = () => {
        clearTimeout(timers[i]);
        timers[i] = setTimeout(() => {
          item.classList.remove('drop-open');
          btn && btn.setAttribute('aria-expanded', 'false');
        }, 130);
      };

      item.addEventListener('mouseenter', () => { clearTimeout(timers[i]); open(); });
      item.addEventListener('mouseleave', close);
      item.querySelector('.drop-panel')?.addEventListener(
        'mouseenter',
        () => clearTimeout(timers[i])
      );

      // Keyboard
      btn && btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.classList.contains('drop-open') ? close() : open();
        }
        if (e.key === 'Escape') closeAll();
      });
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.hdr-nav-item.has-drop')) closeAll();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeAll();
    });
    window.addEventListener('resize', debounce(() => {
      repositioners.forEach(({ item, positionPanel }) => {
        if (item.classList.contains('drop-open')) positionPanel();
      });
    }, 100), { passive: true });

    function closeAll() {
      items.forEach((item, i) => {
        clearTimeout(timers[i]);
        item.classList.remove('drop-open');
        item.querySelector('.hdr-nav-btn')?.setAttribute('aria-expanded', 'false');
      });
    }
  }

  /* ══ MOBILE BURGER ══════════════════════════════════════════ */
  function initMobileNav() {
    if (!burgerBtn || !mobDrawer) return;
    let open = false;

    // The drawer is position:fixed and fills down to the bottom of the
    // screen with no gap — but "where the header ends" shifts (the
    // announcement bar showing or not, web fonts swapping in and reflowing
    // the header a moment after open, etc.), so it's re-measured every
    // frame for as long as the drawer stays open rather than just once.
    let rafId = null;
    const positionDrawer = () => {
      const top = siteHeader.getBoundingClientRect().bottom;
      mobDrawer.style.top = `${top}px`;
      mobDrawer.style.height = `${window.innerHeight - top}px`;
    };
    const trackPosition = () => {
      positionDrawer();
      if (open) rafId = requestAnimationFrame(trackPosition);
    };

    burgerBtn.addEventListener('click', () => {
      open = !open;
      burgerBtn.classList.toggle('open', open);
      burgerBtn.setAttribute('aria-expanded', open);
      mobDrawer.classList.toggle('open', open);
      mobDrawer.setAttribute('aria-hidden', !open);
      if (open) { trackPosition(); lockBodyScroll(); }
      else { cancelAnimationFrame(rafId); unlockBodyScroll(); }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (open && !e.target.closest('.site-header')) {
        open = false;
        burgerBtn.classList.remove('open');
        mobDrawer.classList.remove('open');
        mobDrawer.setAttribute('aria-hidden', 'true');
        cancelAnimationFrame(rafId);
        unlockBodyScroll();
      }
    });
  }

  /* ══ CART SIDEBAR ═══════════════════════════════════════════ */
  function initCart() {
    const openCart = () => {
      if (!cartSidebar || !cartOverlay) return;
      cartSidebar.classList.add('open');
      cartOverlay.classList.add('open');
      cartSidebar.setAttribute('aria-hidden', 'false');
      lockBodyScroll();
    };
    const closeCart = () => {
      if (!cartSidebar || !cartOverlay) return;
      cartSidebar.classList.remove('open');
      cartOverlay.classList.remove('open');
      cartSidebar.setAttribute('aria-hidden', 'true');
      unlockBodyScroll();
    };

    cartBtn && cartBtn.addEventListener('click', openCart);
    cartCloseBtn && cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay && cartOverlay.addEventListener('click', closeCart);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && cartSidebar?.classList.contains('open')) closeCart();
    });

    // EventHawk cart count listener
    window.addEventListener('eventhawk:cartUpdated', e => {
      const n = e.detail?.itemCount ?? 0;
      if (cartCount) {
        cartCount.textContent = n;
        // bounce animation
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => { cartCount.style.transform = ''; }, 220);
      }
    });
  }

  /* ══ DRAG / SWIPE HELPER ════════════════════════════════════
     One pointer-events implementation shared by every carousel: mouse
     click-and-drag, touch and pen all take the same path, so the track
     follows the pointer 1:1 and hands back the release velocity for a
     natural flick. Vertical touch gestures are left to the browser
     (touch-action: pan-y on the track), so page scrolling never gets stuck.

       onStart()                      drag just began (past a 6px dead zone)
       onMove(dx)                     total horizontal distance since press
       onEnd({ dx, vx, cancelled })   vx = release speed in px/ms (+ = right)
  ════════════════════════════════════════════════════════════ */
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function attachDrag(el, { onStart, onMove, onEnd }) {
    const DEAD_ZONE = 6;
    let pid = null;
    let sx = 0;
    let sy = 0;
    let active = false;
    let samples = [];

    function finish(cancelled) {
      if (pid === null) return;
      const id = pid;
      const wasActive = active;
      pid = null;
      active = false;
      try { el.releasePointerCapture(id); } catch (e) { }
      el.classList.remove('is-dragging');
      if (!wasActive) return;

      // Speed over the last ~100ms of the gesture
      const last = samples[samples.length - 1];
      const first = samples.find(s => last.t - s.t <= 100) || last;
      const vx = last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0;

      // A drag must not also count as a click on whatever is under the pointer
      const swallow = ev => { ev.preventDefault(); ev.stopPropagation(); };
      el.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => el.removeEventListener('click', swallow, { capture: true }), 0);

      onEnd({ dx: last.x - sx, vx, cancelled });
    }

    el.addEventListener('pointerdown', e => {
      if (pid !== null) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pid = e.pointerId;
      sx = e.clientX;
      sy = e.clientY;
      active = false;
      samples = [{ x: e.clientX, t: e.timeStamp }];
    });

    el.addEventListener('pointermove', e => {
      if (e.pointerId !== pid) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (!active) {
        if (Math.abs(dx) < DEAD_ZONE && Math.abs(dy) < DEAD_ZONE) return;
        if (Math.abs(dy) > Math.abs(dx)) { pid = null; return; } // vertical — page scroll
        active = true;
        try { el.setPointerCapture(pid); } catch (err) { }
        el.classList.add('is-dragging');
        onStart();
      }
      samples.push({ x: e.clientX, t: e.timeStamp });
      if (samples.length > 12) samples.shift();
      onMove(dx);
    });

    el.addEventListener('pointerup', e => { if (e.pointerId === pid) finish(false); });
    el.addEventListener('pointercancel', e => { if (e.pointerId === pid) finish(true); });
  }

  /* ══ HERO CAROUSELS — drag, flick & seamless infinite loop ═══
     Every .hero-carousel on the site (home gallery, trackless-train
     gallery) runs through this one function.

     Layout: [clone of last] [1] [2] … [N] [clone of first]. Sliding onto a
     clone and then silently jumping to its twin is what makes the loop
     endless — the jump is invisible because both look identical.

     Position is tracked in px (translate3d) so it can be read back mid-flight:
     a click, swipe or arrow press while the track is still gliding picks it
     up exactly where it is instead of being ignored or snapping.
  ════════════════════════════════════════════════════════════ */
  function initHeroCarousels() {
    document.querySelectorAll('.hero-carousel').forEach(initHeroCarousel);
  }

  function initHeroCarousel(carousel) {
    const track = carousel.querySelector('.hc-track');
    if (!track) return;
    const origSlides = Array.from(track.querySelectorAll('.hc-slide'));
    const total = origSlides.length;
    if (total < 2) return;

    const prevBtn = carousel.querySelector('.hc-prev');
    const nextBtn = carousel.querySelector('.hc-next');
    const dotsEl = carousel.querySelector('.hc-dots');

    const EASE_OUT = 'cubic-bezier(.22, .8, .26, 1)';  // decelerates like a real flick
    const EASE_IO = 'cubic-bezier(.65, 0, .35, 1)';    // arrows, dots, autoplay
    const AUTO_DELAY = 4500;
    const SLIDE_MS = 550;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let current = 1;        // index in the extended track (0 and total+1 are clones)
    let curX = 0;           // last px offset applied to the track
    let animating = false;
    let dragging = false;
    let hovering = false;
    let dragBase = 0;
    let settleTimer = null;
    let autoTimer = null;

    // ── Clones for the seamless wrap ──
    const cloneFirst = origSlides[0].cloneNode(true);
    const cloneLast = origSlides[total - 1].cloneNode(true);
    cloneFirst.setAttribute('aria-hidden', 'true');
    cloneLast.setAttribute('aria-hidden', 'true');
    track.appendChild(cloneFirst);
    track.insertBefore(cloneLast, origSlides[0]);

    const slideW = () => track.clientWidth || carousel.clientWidth;

    function place(px, ms, ease) {
      curX = px;
      if (ms) void track.offsetWidth; // commit any un-animated jump first so the transition starts from it
      track.style.transition = ms ? `transform ${ms}ms ${ease}` : 'none';
      track.style.transform = `translate3d(${px}px, 0, 0)`;
    }

    // ── Dots (one per REAL slide) ──
    const dots = [];
    if (dotsEl) {
      dotsEl.innerHTML = '';
      origSlides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'hc-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          if (animating) freeze();
          snapTo(i + 1, reduce ? 0 : SLIDE_MS, EASE_IO);
          startAuto();
        });
        dotsEl.appendChild(dot);
        dots.push(dot);
      });
    }

    function updateDots() {
      const real = current <= 0 ? total : current > total ? 1 : current;
      dots.forEach((d, i) => d.classList.toggle('active', i === real - 1));
    }

    // After gliding onto a clone, silently jump to its identical twin
    function settle() {
      clearTimeout(settleTimer);
      animating = false;
      if (current <= 0) {
        current = total;
        place(-current * slideW(), 0);
      } else if (current > total) {
        current = 1;
        place(-current * slideW(), 0);
      }
    }

    function snapTo(idx, ms, ease) {
      clearTimeout(settleTimer);
      current = idx;
      animating = ms > 0;
      place(-idx * slideW(), ms, ease);
      updateDots();
      // transitionend does the real work; the timer is only a safety net
      if (animating) settleTimer = setTimeout(settle, ms + 200);
      else settle();
    }

    track.addEventListener('transitionend', e => {
      if (e.target === track && e.propertyName === 'transform') settle();
    });

    // Stop wherever the track visually is right now (mid-glide) and fold the
    // position back onto the real slides so it can be moved on from there.
    function freeze() {
      clearTimeout(settleTimer);
      if (!animating) return;
      animating = false;
      const w = slideW();
      const x = new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
      let p = -x / w;                                     // fractional slide index
      if (p < 0.5) p += total;
      else if (p >= total + 0.5) p -= total;
      place(-p * w, 0);
      current = Math.round(p);
    }

    function step(dir) {
      // Mid-glide onto a clone can't be retargeted — fold it onto the real slides first
      if (animating && (current <= 0 || current > total)) freeze();
      else if (!animating && (current <= 0 || current > total)) settle();
      snapTo(current + dir, reduce ? 0 : SLIDE_MS, EASE_IO);
    }

    prevBtn && prevBtn.addEventListener('click', () => { step(-1); startAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { step(1); startAuto(); });

    // ── Click-and-drag / touch swipe ──
    attachDrag(track, {
      onStart() {
        stopAuto();
        if (animating) freeze();
        dragging = true;
        dragBase = curX;
      },
      onMove(dx) {
        const w = slideW();
        place(dragBase + clamp(dx, -w, w), 0);
      },
      onEnd({ dx, vx, cancelled }) {
        dragging = false;
        const w = slideW();
        const shown = dragBase + clamp(dx, -w, w);
        // Where the flick would land if it kept its speed for another ~180ms
        const projected = dx + vx * 180;
        let dir = 0;
        if (!cancelled && Math.abs(projected) > w * 0.22) dir = projected < 0 ? 1 : -1;
        const dist = Math.abs(-(current + dir) * w - shown);
        const ms = reduce || dist < 1 ? 0 : clamp(dist / Math.max(Math.abs(vx), 0.9), 240, 600);
        snapTo(current + dir, ms, EASE_OUT);
        startAuto();
      }
    });

    // ── Horizontal trackpad / tilt-wheel: one slide per gesture ──
    let lastWheel = 0;
    carousel.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) < 8 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      const fresh = now - lastWheel > 150; // inertia keeps events flowing — count each swipe once
      lastWheel = now;
      if (!fresh || dragging) return;
      step(e.deltaX > 0 ? 1 : -1);
      startAuto();
    }, { passive: false });

    // ── Auto-play: full delay after ANY interaction, paused while hovered/dragged ──
    function stopAuto() { clearInterval(autoTimer); autoTimer = null; }
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => {
        if (!animating && !dragging && !hovering && !document.hidden) step(1);
      }, AUTO_DELAY);
    }
    // pointerType check: a touch tap must not leave autoplay "hovered" forever
    carousel.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hovering = true; });
    carousel.addEventListener('pointerleave', e => {
      if (e.pointerType !== 'mouse') return;
      hovering = false;
      startAuto();
    });

    // Keep the slide aligned if the width changes (rotate phone, resize window)
    window.addEventListener('resize', () => {
      if (dragging) return;
      clearTimeout(settleTimer);
      animating = false;
      if (current <= 0) current = total;
      else if (current > total) current = 1;
      place(-current * slideW(), 0);
    });

    place(-current * slideW(), 0);
    startAuto();
  } // end initHeroCarousel

  /* ══ REVIEWS CAROUSEL — fixed offset & reachable dots ═══════
    Bug fixes:
    1. Gap measured from getComputedStyle (not hardcoded 18px)
    2. Each dot maps to one card position — all dots reachable
    3. Auto-advances by one card at a time, wraps correctly
  ════════════════════════════════════════════════════════════ */
  function initReviews() {
    if (!revTrack) return;
    let cards = Array.from(revTrack.querySelectorAll('.rev-card'));
    if (!cards.length) return;

    let idx = 0;
    let autoTimer = null;
    const REV_EASE = 'cubic-bezier(.22, .8, .26, 1)'; // decelerates like a real flick

    function getVisible() {
      if (window.innerWidth <= 580) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    // Measure gap from CSS so it's always accurate
    function getGap() {
      const gap = parseFloat(
        getComputedStyle(revTrack).gap ||
        getComputedStyle(revTrack).columnGap || '18'
      );
      return isNaN(gap) ? 18 : gap;
    }

    function getMax() {
      // Each dot should be reachable — max = total cards - visible
      return Math.max(0, cards.length - getVisible());
    }

    // Build dots: one dot per possible stop position (0 to max)
    function buildDots() {
      if (!revDots) return;
      revDots.innerHTML = '';
      const max = getMax();
      for (let i = 0; i <= max; i++) {
        const dot = document.createElement('button');
        dot.className = 'rev-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Reviews page ${i + 1}`);
        const pos = i; // capture
        dot.addEventListener('click', () => { goTo(pos); resetRevAuto(); });
        revDots.appendChild(dot);
      }
    }

    function goTo(n) {
      const max = getMax();
      idx = Math.min(max, Math.max(0, n));
      const cardW = cards[0].offsetWidth;
      const gap = getGap();
      revTrack.style.transition = `transform .55s ${REV_EASE}`;
      revTrack.style.transform = `translate3d(-${idx * (cardW + gap)}px, 0, 0)`;
      revDots?.querySelectorAll('.rev-dot').forEach((d, i) =>
        d.classList.toggle('active', i === idx)
      );
    }

    // Wrap-around: after last position go back to 0
    function next() {
      const max = getMax();
      goTo(idx >= max ? 0 : idx + 1);
    }
    function prev() {
      const max = getMax();
      goTo(idx <= 0 ? max : idx - 1);
    }

    revNext && revNext.addEventListener('click', () => { next(); resetRevAuto(); });
    revPrev && revPrev.addEventListener('click', () => { prev(); resetRevAuto(); });

    // Click-and-drag / touch swipe — the track follows the pointer, then glides
    // to the nearest card (a fast flick can carry across several)
    let dragBase = 0;
    const cardStep = () => cards[0].offsetWidth + getGap();
    const trackX = () => new DOMMatrixReadOnly(getComputedStyle(revTrack).transform).m41;

    attachDrag(revTrack, {
      onStart() {
        clearInterval(autoTimer);
        dragBase = trackX();            // also catches the track mid-glide
        revTrack.style.transition = 'none';
        revTrack.style.transform = `translate3d(${dragBase}px, 0, 0)`;
      },
      onMove(dx) {
        const min = -getMax() * cardStep();
        let x = dragBase + dx;
        // rubber-band past either end
        if (x > 0) x *= 0.35;
        else if (x < min) x = min + (x - min) * 0.35;
        revTrack.style.transform = `translate3d(${x}px, 0, 0)`;
      },
      onEnd({ dx, vx, cancelled }) {
        goTo(cancelled ? idx : Math.round(-(dragBase + dx + vx * 180) / cardStep()));
        resetRevAuto();
      }
    });

    function startRevAuto() {
      autoTimer = setInterval(() => {
        if (!document.hidden) next(); // skip if tab is not visible
      }, 5000);
    }
    function resetRevAuto() {
      clearInterval(autoTimer); // kill current countdown
      startRevAuto();           // fresh full 5s countdown from now
    }

    const section = revTrack.closest('.reviews-section');
    section?.addEventListener('mouseenter', () => clearInterval(autoTimer));
    section?.addEventListener('mouseleave', resetRevAuto); // reset (not start) so timers never stack

    // Rebuild on resize so dots + offsets stay accurate
    window.addEventListener('resize', debounce(() => {
      buildDots();
      goTo(0);
    }, 200));

    // Live reviews replace the static cards (see initReviewDots) — re-read
    // them and rebuild the dots instead of re-running initReviews, which
    // would stack a second set of listeners and timers.
    document.addEventListener('revRefresh', () => {
      cards = Array.from(revTrack.querySelectorAll('.rev-card'));
      if (!cards.length) return;
      buildDots();
      goTo(0);
    });

    buildDots();
    startRevAuto();
  }

  /* ══ TRAIN GALLERY THUMBS ═══════════════════════════════════ */
  function initTrainGallery() {
    const main = document.querySelector('.tg-main img');
    const thumbs = document.querySelectorAll('.tg-thumb');
    if (!main || !thumbs.length) return;
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        main.src = thumb.dataset.full || thumb.src;
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }

  /* ══ SCROLL ANIMATIONS (AOS-lite) ══════════════════════════ */
  function initScrollAnim() {
    const els = document.querySelectorAll('[data-aos]');
    if (!els.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const delay = el.style.getPropertyValue('--d') || '0ms';
          el.style.transitionDelay = delay;
          el.classList.add('aos-in');
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
  }

  /* ══ RENTAL TAB SWITCHER ════════════════════════════════════ */
  function initRentalTabs() {
    const tabs = document.querySelectorAll('.rtab');
    const panels = document.querySelectorAll('.rtab-panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
        // Smooth scroll to the section top on mobile
        if (window.innerWidth < 900) {
          document.getElementById('rentals')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }

  // Global so cat-card onclick="switchTab('classic')" works
  window.switchTab = function (tabId) {
    const tabs = document.querySelectorAll('.rtab');
    const panels = document.querySelectorAll('.rtab-panel');
    tabs.forEach(t => {
      const active = t.dataset.tab === tabId;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
    });
    panels.forEach(p => {
      p.classList.toggle('active', p.id === 'tab-' + tabId);
    });
  };

  /* ══ GOOGLE REVIEWS LIVE SCORE ══════════════════════════════
    Fetches the live rating + review count from Google Places API.

    HOW TO ACTIVATE:
    1. Go to: https://console.cloud.google.com/
    2. Create a project → enable "Places API (New)"
    3. Create an API key → restrict it to your domain
    4. Paste the key into GOOGLE_PLACES_API_KEY below
    5. Confirm your Place ID at:
        https://developers.google.com/maps/documentation/places/web-service/place-id
        (search "Fiesta Jumps Santa Barbara" and copy the Place ID)

    COST: Google gives $200/month free credit (~6,000 Place Details calls).
    At normal traffic levels this will be $0/month.

    If no API key is set, the section shows the hardcoded fallback values
    already in the HTML (4.9 / "Google Reviews") — still looks correct.
  ════════════════════════════════════════════════════════════ */
  const GOOGLE_PLACES_API_KEY = 'google_api_key'; // ← paste your key here e.g. 'AIzaSy...'
  const GOOGLE_PLACE_ID = 'google_id'; // ← confirm your Place ID

  async function fetchGoogleRating() {
    if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) return;

    try {
      // Request rating + review count + 5 newest reviews in one API call
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}?languageCode=en`,
        {
          headers: {
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            // reviews field returns up to 5 most relevant/recent reviews
            'X-Goog-FieldMask': 'rating,userRatingCount,reviews'
          }
        }
      );

      if (!res.ok) throw new Error(`Places API ${res.status}`);
      const data = await res.json();

      const rating = data.rating;
      const count = data.userRatingCount;
      const reviews = data.reviews || []; // array of up to 5 reviews

      if (!rating) return;

      // ── 1. Update score number ──────────────────────────────
      const rounded = Math.round(rating * 10) / 10;
      const scoreLive = document.getElementById('revScoreLive');
      const countLive = document.getElementById('revCountLive');
      const starsDisp = document.getElementById('revStarsDisplay');
      const liveBadge = document.getElementById('revLiveBadge');

      if (scoreLive) scoreLive.textContent = rounded.toFixed(1);
      if (countLive) countLive.textContent = `· ${count.toLocaleString()} Google Reviews`;

      // ── 2. Partial-fill star bar ────────────────────────────
      if (starsDisp) {
        const pct = (rating / 5) * 100;
        starsDisp.innerHTML = `
          <span class="rev-stars-partial" aria-label="${Number(rounded).toFixed(1)} out of 5 stars">
            ★★★★★
            <span class="rev-stars-fill" style="width:${Number(pct).toFixed(2)}%">★★★★★</span>
          </span>`;
      }

      // ── 3. Show live badge ──────────────────────────────────
      if (liveBadge) liveBadge.style.display = 'inline-flex';

      // ── 4. Render live review cards ─────────────────────────
      // Takes up to 5 reviews from the API and replaces the static HTML cards
      if (reviews.length > 0) {
        renderLiveReviews(reviews);
      }

      // ── 5. Cache everything for 1 hour ─────────────────────
      localStorage.setItem('fj_rating', JSON.stringify({
        rating, count, reviews, cachedAt: Date.now()
      }));

    } catch (err) {
      console.warn('Google Places fetch failed:', err.message);
      // Static fallback cards in HTML remain visible — no action needed
    }
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeHttpUrl(url) {
    try {
      const u = new URL(String(url || ""), window.location.origin);
      if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
    } catch (_) { /* ignore */ }
    return '#';
  }

  // Avatar background colors — cycles through for each reviewer
  const AVATAR_COLORS = [
    '#EF4444', '#10B981', '#F59E0B', '#3B82F6',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
  ];

  function renderLiveReviews(reviews) {
    const track = document.getElementById('revTrack');
    if (!track) return;

    // Build star string from rating number (e.g. 4 → ★★★★☆)
    function starsFromRating(n) {
      const full = Math.round(n);
      return '★'.repeat(full) + '☆'.repeat(5 - full);
    }

    // Format relative time from Google's relativePublishTimeDescription
    // Google returns a string like "a week ago", "2 months ago" — use it directly
    function timeAgo(review) {
      return review.relativePublishTimeDescription || '';
    }

    // Build initials from author name
    function initials(name) {
      if (!name) return '?';
      const parts = name.trim().split(' ');
      return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0][0].toUpperCase();
    }

    // Clear existing static cards
    track.innerHTML = '';

    // Render each live review card
    reviews.forEach((review, i) => {
      const name = escapeHtml(review.authorAttribution?.displayName || 'Google Reviewer');
      const text = escapeHtml(review.text?.text || '');
      const rating = Number(review.rating) || 5;
      const time = escapeHtml(timeAgo(review));
      const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
      const initial = escapeHtml(
        initials(review.authorAttribution?.displayName || 'Google Reviewer')
      );
      const stars = starsFromRating(rating);
      const profile = safeHttpUrl(review.authorAttribution?.uri);

      const card = document.createElement('div');
      card.className = 'rev-card';
      card.innerHTML = `
        <div class="rev-top">
          <a href="${profile}" target="_blank" rel="noopener noreferrer"
             style="text-decoration:none;display:flex;align-items:center;gap:12px">
            <div class="rev-avatar" style="background:${color}">${initial}</div>
            <div class="rev-info">
              <strong>${name}</strong>
              <span class="rev-verified">✓ Google Review</span>
              <p class="rev-date">${time}</p>
            </div>
          </a>
        </div>
        <div class="rev-stars-row" style="color:#F59E0B">${stars}</div>
        <p class="rev-text">${text}</p>
        <span class="rev-source">Posted on Google</span>
      `;
      track.appendChild(card);
    });

    // Re-initialize the carousel dots now that cards are replaced
    initReviewDots();
  }

  /* Called after live reviews replace the static cards — tells the slider
     built in initReviews to pick up the new cards and rebuild its dots. */
  function initReviewDots() {
    document.dispatchEvent(new CustomEvent('revRefresh'));
  }

  function initGoogleRating() {
    // Check localStorage cache first (1 hour TTL)
    try {
      const cached = JSON.parse(localStorage.getItem('fj_rating') || 'null');
      if (cached && (Date.now() - cached.cachedAt) < 3_600_000) {
        // Apply cached score
        const rounded = Math.round(cached.rating * 10) / 10;
        const scoreLive = document.getElementById('revScoreLive');
        const countLive = document.getElementById('revCountLive');
        const starsDisp = document.getElementById('revStarsDisplay');
        const liveBadge = document.getElementById('revLiveBadge');

        if (scoreLive) scoreLive.textContent = rounded.toFixed(1);
        if (countLive) countLive.textContent = `· ${cached.count.toLocaleString()} Google Reviews`;
        if (starsDisp) {
          const pct = (cached.rating / 5) * 100;
          starsDisp.innerHTML =
            `<span class="rev-stars-partial"
              aria-label="${Number(rounded).toFixed(1)} out of 5 stars">
              ★★★★★
              <span class="rev-stars-fill"
                style="width:${Number(pct).toFixed(2)}%">★★★★★</span>
            </span>`;
        }
        if (liveBadge) liveBadge.style.display = 'inline-flex';

        // Also render cached review cards if available
        if (cached.reviews && cached.reviews.length > 0) {
          renderLiveReviews(cached.reviews);
        }
        return; // cache hit — skip API call
      }
    } catch (_) { /* localStorage blocked */ }

    // No valid cache — fetch live from API
    fetchGoogleRating();
  }

  /* ══ GEOLOCATION — AUTO-SET CITY ════════════════════════════
     Uses the browser Geolocation API (requires user permission).
     On approval: reverse-geocodes to a city name, then:
     - Updates the hero location pill
     - Shows a note near the map
     - Pre-fills the EventHawk booking form city field
     This mirrors how Walmart / Instacart auto-detect your location.
  ════════════════════════════════════════════════════════════ */
  const SERVICE_CITIES = [
    'Santa Barbara', 'Montecito', 'Carpinteria',
    'Goleta', 'Santa Ynez', 'Los Olivos', 'Buellton', 'Isla Vista'
  ];

  async function initGeolocation() {
    if (!navigator.geolocation) return;

    // Only request if user hasn't already denied
    const perm = await navigator.permissions?.query({ name: 'geolocation' }).catch(() => null);
    if (perm?.state === 'denied') return;

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocode using the free OpenStreetMap Nominatim API
          const res = await fetch(
            'https://nominatim.openstreetmap.org/reverse' +
            `?lat=${latitude}&lon=${longitude}` +
            '&format=json&accept-language=en',
            { headers: { 'Accept': 'application/json' } }
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            null;

          if (city) {
            // Update hero location pill
            if (heroLocText) heroLocText.textContent = city + ', CA';

            // Check if it's a service area
            const inArea = SERVICE_CITIES.some(c => city.toLowerCase().includes(c.toLowerCase()));
            if (inArea && mapGeoNote && mapGeoText) {
              mapGeoNote.style.display = 'flex';
              mapGeoText.textContent =
                `We detected your location (${city}) and we deliver to your area!`;
            }

            // Store for booking form pre-fill
            sessionStorage.setItem('fj_city', city);
            sessionStorage.setItem('fj_lat', latitude);
            sessionStorage.setItem('fj_lng', longitude);
          }
        } catch (_) { /* Geocoding failed silently */ }
      },
      () => { /* User denied — do nothing */ },
      { timeout: 8000, maximumAge: 600000 }
    );
  }

  /* Pre-fill EventHawk booking form city on booking pages */
  function prefillBookingCity() {
    const city = sessionStorage.getItem('fj_city');
    if (!city) return;
    // Wait for EventHawk widget to render
    const tryFill = () => {
      const cityField =
        document.querySelector('[name="city"]') ||
        document.querySelector('[placeholder*="city" i]') ||
        document.querySelector('[placeholder*="City" i]');
      if (cityField && !cityField.value) {
        cityField.value = city;
        cityField.dispatchEvent(new Event('input', { bubbles: true }));
        cityField.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };
    // Try immediately and after a short delay for async widgets
    tryFill();
    setTimeout(tryFill, 1500);
    setTimeout(tryFill, 3500);
  }

  /* ══ SMOOTH ANCHOR SCROLL ═══════════════════════════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href.length <= 1) return; // bare "#" (e.g. modal triggers) — not an in-page anchor
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = (siteHeader?.offsetHeight ?? 0) + 16;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ══ DARK MODE TOGGLE ═══════════════════════════════════════
     Theme is set early (before paint) by an inline snippet in
     <head> — see index.html / classic-bounce-houses.html. This
     just wires up the button so the user can flip it and persist
     the choice in localStorage. */
  function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const root = document.documentElement;

    const setPressed = () => {
      btn.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark');
    };
    setPressed();

    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('fj-theme', next); } catch (e) { }
      setPressed();
    });
  }

  /* ══ ANNOUNCEMENTS BAR — seamless, position-preserving marquee ═
     Every page here is a full reload, so a plain CSS animation restarts from
     zero on each navigation, and the old setup() also restarted it whenever a
     font finished loading or the window resized (alt-tab out of fullscreen).
     Now:
       • One Web Animation drives the loop; its currentTime IS the position.
       • Re-measuring (fonts, resize) swaps the animation for a new one at the
         SAME position — nothing ever restarts from 0.
       • The position is saved when the page is left and resumed on the next
         page, advanced by the time spent in between, so it looks like the bar
         never stopped — one continuous "gif loop" across the whole site.
  ════════════════════════════════════════════════════════════ */
  function initAnnBar() {
    const bar = document.querySelector('.ann-bar');
    const track = document.querySelector('.ann-track');
    if (!bar || !track) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canAnimate = typeof track.animate === 'function';
    const SPEED = 42;            // px per second — calm production speed
    const KEY = 'fj-ann-pos';
    const RESUME_WINDOW = 15000; // only credit the gap between pages if it was short

    let group = track.querySelector('.ann-group');
    if (!group) {
      // Legacy markup fallback: wrap existing children once
      group = document.createElement('div');
      group.className = 'ann-group';
      while (track.firstChild) group.appendChild(track.firstChild);
      track.appendChild(group);
    }

    let anim = null;
    let loopPx = 0;      // exact width of one group = length of one full loop
    let hovering = false;

    const loopMs = () => (loopPx / SPEED) * 1000;

    // Current position inside the loop, in px (null until the first build)
    function currentPx() {
      if (!anim || !loopPx) return null;
      const t = Number(anim.currentTime) || 0;
      return ((t % loopMs()) / loopMs()) * loopPx;
    }

    // Where the previous page left off, advanced by however long the page
    // change took, as if the bar had kept moving the whole time.
    function restoredPx(loop) {
      try {
        const s = JSON.parse(sessionStorage.getItem(KEY));
        if (!s || typeof s.f !== 'number') return 0;
        let px = s.f * loop;
        const gap = Date.now() - s.t;
        if (s.run && gap >= 0 && gap < RESUME_WINDOW) px += (gap / 1000) * SPEED;
        return px;
      } catch (e) { return 0; }
    }

    function savePosition() {
      const px = currentPx();
      if (px === null) return;
      try {
        sessionStorage.setItem(KEY, JSON.stringify({ f: px / loopPx, t: Date.now(), run: !hovering }));
      } catch (e) { }
    }

    function build(startPx) {
      if (anim) { anim.cancel(); anim = null; }
      while (track.children.length > 1) track.removeChild(track.lastChild);

      const one = group.getBoundingClientRect().width;
      if (!one) return;

      // Enough copies that the visible strip is always covered, wherever the loop is
      const need = Math.max(2, Math.ceil(bar.clientWidth / one) + 1);
      for (let n = 1; n < need; n++) {
        const clone = group.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }

      // Loop length = distance from the 1st group to the 2nd, unrounded, so the
      // seam is exact to the sub-pixel and never drifts or ticks
      loopPx = track.children[1].getBoundingClientRect().left - group.getBoundingClientRect().left;

      if (reduceMotion || !canAnimate) return; // static strip

      anim = track.animate(
        [
          { transform: 'translate3d(0, 0, 0)' },
          { transform: `translate3d(${-loopPx}px, 0, 0)` }
        ],
        { duration: loopMs(), iterations: Infinity, easing: 'linear' }
      );
      anim.currentTime = ((startPx % loopPx) / SPEED) * 1000;
      if (hovering) anim.pause();
    }

    // Idempotent: does nothing unless the width of a group changed (fonts/emoji
    // settling) or a wider window needs more copies — and even then keeps the
    // position, so it can be called as often as needed without a visible seam.
    function refresh() {
      const one = group.getBoundingClientRect().width;
      if (!one) return;
      const need = Math.max(2, Math.ceil(bar.clientWidth / one) + 1);
      if (loopPx && Math.abs(one - loopPx) < 0.5 && track.children.length >= need) return;
      const px = currentPx();
      build(px === null ? restoredPx(one) : px);
    }

    refresh();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh).catch(() => { });
    }
    window.addEventListener('resize', debounce(refresh, 120));
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(debounce(refresh, 120)).observe(bar);
    }

    // Save on every way of leaving: navigation, tab switch, app switch on mobile
    window.addEventListener('pagehide', savePosition);
    document.addEventListener('visibilitychange', () => { if (document.hidden) savePosition(); });

    // Pause while a mouse is over the bar. pointerType check: on touch screens a
    // tap would otherwise leave it "hovered" (paused) until the next tap elsewhere.
    bar.addEventListener('pointerenter', e => {
      if (e.pointerType !== 'mouse') return;
      hovering = true;
      if (anim) anim.pause();
    });
    bar.addEventListener('pointerleave', e => {
      if (e.pointerType !== 'mouse') return;
      hovering = false;
      if (anim) anim.play();
    });
  }

  /* ══ UTIL ═══════════════════════════════════════════════════ */
  /* body { overflow: hidden } alone doesn't stop touch-drag scrolling on
    mobile Safari/Chrome — it only blocks mouse-wheel scroll on desktop.
    Pinning body with position:fixed (and restoring scroll position after)
     is what actually locks the background while a drawer/sidebar is open. */
  let lockedScrollY = 0;
  function lockBodyScroll() {
    lockedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }
  function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    // { behavior: 'instant' } is required here — html has scroll-behavior:
    // smooth globally, so the two-argument scrollTo(0, y) form would animate
    // from the top back down, looking like the whole page reset and re-scrolled.
    window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'instant' });
  }

  function debounce(fn, wait) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  }

  /* ══ PRODUCT MODAL ══════════════════════════════════════════ */
  function initProductModal() {
    const overlay = document.getElementById('prodModalOverlay');
    const closeBtn = document.getElementById('prodModalClose');
    if (!overlay) return;

    const mEmoji = document.getElementById('prodModalEmoji');
    const mPhoto = document.getElementById('prodModalPhoto');
    const mTitle = document.getElementById('prodModalTitle');
    const mBadge = document.getElementById('prodModalBadge');
    const mDesc = document.getElementById('prodModalDesc');
    const mIncludes = document.getElementById('prodModalIncludes');
    const mIncludesText = document.getElementById('prodModalIncludesText');
    const mDims = document.getElementById('prodModalDims');
    const mArea = document.getElementById('prodModalArea');
    const mCap = document.getElementById('prodModalCap');
    const mPower = document.getElementById('prodModalPower');
    const mPrice = document.getElementById('prodModalPrice');
    const mCta = document.getElementById('prodModalCta');
    const mRequirement = document.getElementById('prodModalRequirement');

    function openModal(data) {
      if (mPhoto && data.image) {
        mPhoto.src = data.image;
        mPhoto.alt = data.title || '';
        mPhoto.hidden = false;
        if (mEmoji) mEmoji.style.display = 'none';
      } else {
        if (mPhoto) {
          mPhoto.removeAttribute('src');
          mPhoto.hidden = true;
        }
        if (mEmoji) {
          mEmoji.style.display = '';
          mEmoji.textContent = data.emoji || '🏰';
        }
      }
      if (mTitle) mTitle.textContent = data.title || '';

      if (mBadge) {
        if (data.badge) {
          mBadge.textContent = data.badge;
          mBadge.style.display = 'inline-block';
        } else {
          mBadge.style.display = 'none';
        }
      }

      if (mDesc) mDesc.textContent = data.desc || '';

      if (mIncludes && mIncludesText) {
        if (data.includes) {
          mIncludesText.textContent = data.includes;
          mIncludes.style.display = 'flex';
        } else {
          mIncludes.style.display = 'none';
        }
      }

      if (mDims) mDims.textContent = data.dims || 'N/A';
      if (mArea) mArea.textContent = data.area || 'N/A';
      if (mCap) mCap.textContent = data.cap || 'N/A';
      if (mPower) mPower.textContent = data.power || 'N/A';
      if (mPrice) mPrice.textContent = data.price || 'N/A';
      if (mCta) mCta.href = data.book || '#';
      if (mRequirement) {
        mRequirement.textContent =
          data.requirement ||
          'Electric outlet within 50 feet of setup area';
      }

      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      lockBodyScroll();
    }

    function closeModal() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      unlockBodyScroll();
    }

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.js-open-modal');
      if (trigger) {
        e.preventDefault();
        // Category-wide defaults (e.g. data-cap="5-6 kids" on the whole
        // .products-grid) fill in any field a specific product doesn't set
        // itself — set it once per page instead of repeating it per card.
        const grid = trigger.closest('.products-grid');
        const data = grid ? { ...grid.dataset, ...trigger.dataset } : trigger.dataset;
        openModal(data);
      }
    });

    closeBtn && closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ══ INIT ═══════════════════════════════════════════════════ */
  /* Catalog filter pills — noun via #filterCount[data-count-noun] (default: unit) */
  function initFilterPills() {
    const pills = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.pcard[data-filter]');
    const countEl = document.getElementById('filterCount');
    if (!pills.length || !cards.length) return;

    const noun = (countEl && countEl.getAttribute('data-count-noun')) || 'unit';

    function setCount(vis) {
      if (!countEl) return;
      const label = vis === 1 ? noun : noun + 's';
      countEl.textContent = vis + ' ' + label + ' available';
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');

        const f = pill.dataset.filter;
        let vis = 0;
        cards.forEach(function (card) {
          const cats = card.dataset.filter || '';
          const show = f === 'all' || cats.split(' ').includes(f);
          card.style.display = show ? '' : 'none';
          if (show) vis++;
        });
        setCount(vis);
      });
    });
  }

  function init() {
    initPageTransitions();
    initHeader();
    initDropdowns();
    initMobileNav();
    initCart();
    initHeroCarousels();
    initReviews();
    initTrainGallery();
    initScrollAnim();
    initRentalTabs();       // tab switcher
    initProductModal();     // product modal
    initGoogleRating();
    initGeolocation();
    prefillBookingCity();
    initSmoothScroll();
    initAnnBar();
    initThemeToggle();
    initFilterPills();
    initLivePrices();
    initPartnerLogoFallbacks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

function initPartnerLogoFallbacks() {
  document.querySelectorAll('img.partner-logo').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
      var fb = img.nextElementSibling;
      if (fb) fb.style.display = 'flex';
    });
  });
}
