document.getElementById('year').textContent = new Date().getFullYear();

document.body.classList.add('page-loaded');

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

// Kontaktformular: öffnet eine vorausgefüllte E-Mail (bis ein echtes Formular-Backend angebunden ist)
const terminForm = document.getElementById('terminForm');
if (terminForm) {
  terminForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('terminName').value;
    const telefon = document.getElementById('terminTelefon').value;
    const email = document.getElementById('terminEmail').value;
    const nachricht = document.getElementById('terminNachricht').value;

    const body = [
      `Name: ${name}`,
      `Telefon: ${telefon || '-'}`,
      `E-Mail: ${email}`,
      `Nachricht: ${nachricht}`
    ].join('\n');

    const subject = `Nachricht von ${name}`;
    window.location.href = `mailto:info@antoniettas.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// Terminanfrage-Formular (termin.html): öffnet eine vorausgefüllte E-Mail
const bookingDatum = document.getElementById('bookingDatum');
if (bookingDatum) {
  bookingDatum.min = new Date().toISOString().split('T')[0];
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('bookingName').value;
    const telefon = document.getElementById('bookingTelefon').value;
    const email = document.getElementById('bookingEmail').value;
    const leistung = document.getElementById('bookingLeistung').value;
    const datum = document.getElementById('bookingDatum').value;
    const uhrzeit = document.getElementById('bookingUhrzeit').value;
    const anliegen = document.getElementById('bookingAnliegen').value;
    const nachricht = document.getElementById('bookingNachricht').value;

    const body = [
      `Name: ${name}`,
      `Telefon: ${telefon || '-'}`,
      `E-Mail: ${email}`,
      `Leistung: ${leistung}`,
      `Art der Anfrage: ${anliegen}`,
      `Wunschdatum: ${datum}`,
      `Wunschuhrzeit: ${uhrzeit}`,
      `Nachricht: ${nachricht || '-'}`
    ].join('\n');

    const subject = `Terminanfrage von ${name}`;
    window.location.href = `mailto:info@antoniettas.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
