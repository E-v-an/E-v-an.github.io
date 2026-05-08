// ═══════════════════════════════════════════════════════
// SMOOTH SCROLLING
// ═══════════════════════════════════════════════════════

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// ═══════════════════════════════════════════════════════
// FADE-IN ANIMATIONS ON SCROLL
// ═══════════════════════════════════════════════════════

const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});


// ═══════════════════════════════════════════════════════
// GLOWING CURSOR EFFECT
// ═══════════════════════════════════════════════════════

// Get the cursor elements
const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

// Track mouse position
let mouseX = 0;
let mouseY = 0;

// Track cursor glow position (with delay for smooth trailing effect)
let glowX = 0;
let glowY = 0;

// Update mouse position on mouse move
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Move the dot immediately to follow the cursor exactly
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

// Animate the glow circle to follow with a smooth delay
function animateGlow() {
  // Smooth easing - the glow gradually catches up to the cursor
  const easing = 0.15;
  
  glowX += (mouseX - glowX) * easing;
  glowY += (mouseY - glowY) * easing;
  
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  
  // Keep animating
  requestAnimationFrame(animateGlow);
}

// Start the animation loop
animateGlow();


// Make cursor bigger when hovering over clickable elements
const clickableElements = document.querySelectorAll('a, button, .btn, .btn-small, .skill-card, .project-card');

clickableElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-hover');
  });
  
  el.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-hover');
  });
});