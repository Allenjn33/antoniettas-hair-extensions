document.getElementById('year').textContent = new Date().getFullYear();

// Terminbuchung: keine Termine in der Vergangenheit wählbar
const terminDatum = document.getElementById('termin-datum');
if (terminDatum) {
  terminDatum.min = new Date().toISOString().split('T')[0];
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

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';

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
