document.getElementById('year').textContent = new Date().getFullYear();

document.body.classList.add('page-loaded');

// ==========================================================================
// Google Analytics + Cookie-Consent
// WICHTIG: Ersetze GA_MEASUREMENT_ID unten mit deiner echten GA4 Measurement-ID
// (Format "G-XXXXXXXXXX"), zu finden unter analytics.google.com in deiner Property.
// Analytics wird NUR geladen, wenn der Besucher im Cookie-Banner "Akzeptieren" klickt.
// ==========================================================================
const GA_MEASUREMENT_ID = 'G-C5ZKHMRC6G';

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
}

const cookieConsent = document.getElementById('cookieConsent');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');
const consentChoice = localStorage.getItem('cookieConsent');

if (consentChoice === 'accepted') {
  loadGoogleAnalytics();
} else if (!consentChoice && cookieConsent) {
  cookieConsent.classList.add('show');
}

if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieConsent.classList.remove('show');
    loadGoogleAnalytics();
  });
}

if (cookieDecline) {
  cookieDecline.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieConsent.classList.remove('show');
  });
}

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
  header.classList.toggle('scrolled', y > darkThreshold);

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
    const target = document.querySelector(link.getAttribute('href'));
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

