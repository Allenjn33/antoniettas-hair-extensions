document.getElementById('year').textContent = new Date().getFullYear();

document.body.classList.add('page-loaded');

// ==========================================================================
// Google Analytics + Cookie-Consent
// WICHTIG: Ersetze GA_MEASUREMENT_ID unten mit deiner echten GA4 Measurement-ID
// (Format "G-XXXXXXXXXX"), zu finden unter analytics.google.com in deiner Property.
// Analytics wird NUR geladen, wenn der Besucher im Cookie-Banner "Akzeptieren" klickt.
// ==========================================================================
const GA_MEASUREMENT_ID = 'G-C5ZKHMRC6G';
const GOOGLE_ADS_ID = 'AW-18436556217';

function loadGoogleAnalytics() {
  if (window.gaLoaded) return;
  window.gaLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  gtag('config', GOOGLE_ADS_ID);
}

function loadMap() {
  const box = document.getElementById('mapEmbed');
  if (!box || box.querySelector('iframe')) return;
  const frame = document.createElement('iframe');
  frame.src = box.dataset.mapSrc;
  frame.width = '100%';
  frame.height = '320';
  frame.style.border = '0';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  frame.title = 'Standort Antonietta Hair Extensions Studio auf Google Maps';
  box.replaceChildren(frame);
}
const mapLoadBtn = document.getElementById('mapLoad');
if (mapLoadBtn) mapLoadBtn.addEventListener('click', loadMap);

const cookieConsent = document.getElementById('cookieConsent');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');
const consentChoice = localStorage.getItem('cookieConsent');

// Neukundenrabatt-Popup: erscheint einmal, nachdem der Besucher die Cookie-Entscheidung
// getroffen hat (akzeptiert oder abgelehnt), höchstens alle 14 Tage erneut.
const offerPopup = document.getElementById('offerPopup');
const offerPopupClose = document.getElementById('offerPopupClose');
const offerPopupDismiss = document.getElementById('offerPopupDismiss');
const OFFER_POPUP_INTERVAL_DAYS = 14;

function maybeShowOfferPopup() {
  if (!offerPopup) return;
  const lastShown = localStorage.getItem('offerPopupShown');
  const daysSince = lastShown ? (Date.now() - Number(lastShown)) / 86400000 : Infinity;
  if (daysSince < OFFER_POPUP_INTERVAL_DAYS) return;
  setTimeout(() => {
    offerPopup.classList.add('show');
    localStorage.setItem('offerPopupShown', String(Date.now()));
  }, 600);
}

function closeOfferPopup() {
  if (offerPopup) offerPopup.classList.remove('show');
}

if (offerPopupClose) offerPopupClose.addEventListener('click', closeOfferPopup);
if (offerPopupDismiss) offerPopupDismiss.addEventListener('click', closeOfferPopup);

if (consentChoice === 'accepted') {
  loadGoogleAnalytics();
  loadMap();
  maybeShowOfferPopup();
} else if (!consentChoice && cookieConsent) {
  cookieConsent.classList.add('show');
} else if (consentChoice === 'declined') {
  maybeShowOfferPopup();
}

if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieConsent.classList.remove('show');
    loadGoogleAnalytics();
    loadMap();
    maybeShowOfferPopup();
  });
}

// Widerruf: GA deaktivieren und bereits gesetzte _ga-Cookies löschen
function revokeGoogleAnalytics() {
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  window[`ga-disable-${GOOGLE_ADS_ID}`] = true;
  const domains = ['', location.hostname, '.' + location.hostname.replace(/^www\./, '')];
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (!name.startsWith('_ga')) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? '; domain=' + d : ''}`;
    });
  });
}

if (cookieDecline) {
  cookieDecline.addEventListener('click', () => {
    const wasAccepted = localStorage.getItem('cookieConsent') === 'accepted';
    localStorage.setItem('cookieConsent', 'declined');
    cookieConsent.classList.remove('show');
    if (wasAccepted) revokeGoogleAnalytics();
    maybeShowOfferPopup();
  });
}

// "Cookie-Einstellungen" im Footer: Banner erneut öffnen, um Einwilligung zu ändern
document.querySelectorAll('.cookie-settings-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (cookieConsent) cookieConsent.classList.add('show');
  });
});

// Hero-Haarsträhnen: fast gleichzeitig, nur minimale Unterschiede in Tempo/Start
const heroStrands = document.querySelectorAll('.hero-strand');
const baseDuration = 8.5 + Math.random() * 2;
heroStrands.forEach((strand, i) => {
  const randomDuration = (baseDuration + (Math.random() * 0.8 - 0.4)) + 's';
  const randomDelay = (Math.random() * 0.5) + 's';
  const suffix = i === 0 ? '' : '-' + (i + 1);
  strand.style.setProperty('--hero-line-duration' + suffix, randomDuration);
  strand.style.setProperty('--hero-line-delay' + suffix, randomDelay);
});

// Mobile Menü Toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', menuToggle.classList.contains('active'));
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Baustellen-Banner Schließen-Button
const constructionBanner = document.querySelector('.construction-banner');
if (constructionBanner) {
  const closeBtn = constructionBanner.querySelector('button');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      constructionBanner.style.display = 'none';
    });
  }
}

// Scroll-reveal animations
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Header shrink + scroll progress bar
const header = document.getElementById('siteHeader');
const progressBar = document.getElementById('progressBar');
const heroBg = document.getElementById('heroBg');
const backToTop = document.getElementById('backToTop');
const leistungenSection = document.getElementById('leistungen');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  const darkThreshold = leistungenSection
    ? leistungenSection.offsetTop - header.offsetHeight
    : 80;
  if (header) header.classList.toggle('scrolled', y > darkThreshold);

  if (backToTop) {
    backToTop.classList.toggle('visible', y > 400);
  }

  if (progressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  if (heroBg) {
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
  }
}, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Sanft wandernder Scheinwerfer-Glow, verankert oben links, driftet leicht Richtung Mitte
const heroGlow = document.querySelector('.hero-glow');
if (heroGlow) {
  const baseLeft = 30;
  const baseTop = 20;
  const wanderGlow = () => {
    const left = baseLeft + (Math.random() * 20 - 8);
    const top = baseTop + (Math.random() * 16 - 6);
    const duration = 7 + Math.random() * 5;

    heroGlow.style.transitionDuration = `${duration}s`;
    heroGlow.style.left = `${left}%`;
    heroGlow.style.top = `${top}%`;

    setTimeout(wanderGlow, duration * 1000);
  };
  wanderGlow();
}

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Scroll-Spy: aktiven Nav-Link je nach sichtbarem Abschnitt markieren
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const spySections = Array.from(navLinks)
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (navLinks.length && spySections.length) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  spySections.forEach(section => spyObserver.observe(section));
}


// Vorher/Nachher-Slider
document.querySelectorAll('[data-ba]').forEach(root => {
  const slides = root.querySelectorAll('.ba-slide');
  const dots = root.querySelectorAll('.ba-dots button');
  let i = 0, timer = null;
  const show = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  };
  const stop = () => { clearInterval(timer); timer = null; };
  const start = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stop();
    timer = setInterval(() => show(i + 1), 4500);
  };
  root.querySelector('.ba-prev').addEventListener('click', () => { show(i - 1); start(); });
  root.querySelector('.ba-next').addEventListener('click', () => { show(i + 1); start(); });
  dots.forEach((d, k) => d.addEventListener('click', () => { show(k); start(); }));
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  let x0 = null;
  root.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
  root.addEventListener('touchend', e => {
    if (x0 !== null) {
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    }
    x0 = null; start();
  });
  start();
});

// Ablauf-Animation
const stepsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('steps-visible');
      stepsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.steps').forEach(el => stepsObserver.observe(el));

// Länge anpassen (Pop-up)
const lengthPopup = document.getElementById('lengthPopup');
if (lengthPopup) {
  const hair = document.getElementById('lengthHair');
  const line = document.getElementById('lengthLine');
  const label = document.getElementById('lengthLabel');
  const text = document.getElementById('lengthText');
  const cta = document.getElementById('lengthCta');
  const opts = lengthPopup.querySelectorAll('[data-len]');
  const data = {
    40: { y: 170, t: 'Bis knapp unter die Schultern: mehr Fülle und Struktur, gut zum Einstieg.' },
    50: { y: 202, t: 'Bis zur Brust: ein beliebter Mittelweg zwischen Länge und Alltagstauglichkeit.' },
    65: { y: 238, t: 'Bis zur Taille: maximale Länge für einen besonders dramatischen Look.' }
  };
  const setLen = len => {
    const d = data[len];
    hair.setAttribute('d', `M88 80 Q88 22 120 22 Q152 22 152 80 L164 ${d.y} Q120 ${d.y + 12} 76 ${d.y} Z`);
    line.setAttribute('y1', 22);
    line.setAttribute('y2', d.y);
    label.setAttribute('y', Math.round((22 + d.y) / 2 + 4));
    label.textContent = len + ' cm';
    text.textContent = d.t;
    opts.forEach(b => b.classList.toggle('is-active', b.dataset.len === String(len)));
    const msg = `Hallo, ich interessiere mich für Bonding Extensions in ${len} cm. Können wir einen Termin vereinbaren?`;
    cta.href = 'https://wa.me/4917662839112?text=' + encodeURIComponent(msg);
  };
  opts.forEach(b => b.addEventListener('click', () => setLen(b.dataset.len)));
  const closeLength = () => lengthPopup.classList.remove('show');
  document.querySelectorAll('[data-open-length]').forEach(b => b.addEventListener('click', () => { setLen(50); lengthPopup.classList.add('show'); }));
  document.getElementById('lengthClose').addEventListener('click', closeLength);
  lengthPopup.addEventListener('click', e => { if (e.target === lengthPopup) closeLength(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLength(); });
}
