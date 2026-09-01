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

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  header.classList.toggle('scrolled', y > 40);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';

  if (heroBg) {
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
  }
}, { passive: true });

// Wandernder Scheinwerfer-Glow im Hero (rund, mit zufälligen Bewegungen/Timing)
const heroGlow = document.querySelector('.hero-glow');
if (heroGlow) {
  const wanderGlow = () => {
    const left = 10 + Math.random() * 70;
    const top = 15 + Math.random() * 55;
    const scale = 0.75 + Math.random() * 0.7;
    const duration = 5 + Math.random() * 6;

    heroGlow.style.transitionDuration = `${duration}s`;
    heroGlow.style.left = `${left}%`;
    heroGlow.style.top = `${top}%`;
    heroGlow.style.transform = `translate(-50%, -50%) scale(${scale})`;

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
