document.getElementById('year').textContent = new Date().getFullYear();

document.body.classList.add('page-loaded');

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

// Variierende Animation-Dauer für Underline-Striche
document.querySelectorAll('.section h2, .termin-section h1').forEach(el => {
  const randomDuration = (2.8 + Math.random() * 1.4) + 's';
  el.style.setProperty('--line-duration', randomDuration);
});

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

// Formular per Formspree senden (echter Versand im Hintergrund, kein Mail-Programm nötig)
function sendFormspreeForm(form, noteEl, successText, calendarBuilder) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet...';
    }
    if (noteEl) {
      noteEl.textContent = '';
    }

    const calendarData = calendarBuilder ? calendarBuilder() : null;
    const calendarLink = calendarData ? calendarData.link : null;

    const formData = new FormData(form);
    if (calendarLink) {
      formData.append('Termin zum Google Kalender hinzufügen', calendarLink);
    }
    // Hinweis: Formspree erlaubt im kostenlosen Plan keine Datei-Anhänge (z.B. .ics),
    // deshalb bleibt es beim anklickbaren Kalender-Link als Textfeld.

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then((response) => {
        if (response.ok) {
          form.reset();
          Array.from(form.children).forEach(el => el.style.display = 'none');

          const success = document.createElement('p');
          success.className = 'form-success';
          success.textContent = successText;
          form.appendChild(success);

          if (calendarLink) {
            const calLink = document.createElement('a');
            calLink.href = calendarLink;
            calLink.target = '_blank';
            calLink.rel = 'noopener';
            calLink.className = 'btn btn-dark calendar-link';
            calLink.textContent = 'Zum Google Kalender hinzufügen';
            form.appendChild(calLink);
          }
        } else {
          throw new Error('Formspree error');
        }
      })
      .catch(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
        if (noteEl) {
          noteEl.textContent = 'Senden hat leider nicht geklappt. Schreib uns direkt an info@antoniettas.de.';
          noteEl.classList.add('form-error');
        }
      });
  });
}

const terminForm = document.getElementById('terminForm');
if (terminForm) {
  sendFormspreeForm(
    terminForm,
    document.getElementById('terminFormNote'),
    'Danke für deine Nachricht! Wir melden uns so schnell wie möglich bei dir.'
  );
}

const bookingDatum = document.getElementById('bookingDatum');
if (bookingDatum) {
  bookingDatum.min = new Date().toISOString().split('T')[0];
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  sendFormspreeForm(
    bookingForm,
    document.getElementById('bookingFormNote'),
    'Danke für deine Terminanfrage! Wir bestätigen sie persönlich bei dir.',
    () => {
      const name = document.getElementById('bookingName').value;
      const telefon = document.getElementById('bookingTelefon').value;
      const email = document.getElementById('bookingEmail').value;
      const leistung = document.getElementById('bookingLeistung').value || 'Termin';
      const anliegen = document.getElementById('bookingAnliegen').value;
      const nachricht = document.getElementById('bookingNachricht').value;
      const datum = document.getElementById('bookingDatum').value;
      const uhrzeit = document.getElementById('bookingUhrzeit').value;
      if (!datum || !uhrzeit) return null;

      const start = new Date(`${datum}T${uhrzeit}`);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      const fmtGoogle = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0];

      const title = `${leistung} – ${name}`;
      const details = [
        `Kundin: ${name}`,
        `Telefon: ${telefon}`,
        `E-Mail: ${email}`,
        `Leistung: ${leistung}`,
        `Art der Anfrage: ${anliegen}`,
        `Nachricht: ${nachricht || '-'}`
      ].join('\n');
      const location = 'Nieder-Saulheimer Str. 45, 55291 Saulheim';

      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${fmtGoogle(start)}/${fmtGoogle(end)}`,
        details: details,
        location: location,
        ctz: 'Europe/Berlin'
      });
      const link = `https://calendar.google.com/calendar/render?${params.toString()}`;

      return { link };
    }
  );
}
