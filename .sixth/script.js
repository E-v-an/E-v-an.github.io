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

const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateGlow() {
  const easing = 0.15;
  glowX += (mouseX - glowX) * easing;
  glowY += (mouseY - glowY) * easing;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

const clickableElements = document.querySelectorAll('a, button, .btn, .btn-small, .skill-card, .project-card');
clickableElements.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});


// ═══════════════════════════════════════════════════════
// 3D LAPTOP BACKGROUND WITH SCROLL ANIMATION
// ═══════════════════════════════════════════════════════

// Only run if Three.js is loaded
if (typeof THREE !== 'undefined') {
  
  // Scene setup
  const canvas = document.getElementById('bg-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.position.z = 5;

  // ─── Create the 3D Laptop ───────────────────────────────
  
  const laptopGroup = new THREE.Group();

  // Laptop base (keyboard part)
  const baseGeometry = new THREE.BoxGeometry(3, 0.15, 2);
  const baseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,
    metalness: 0.6,
    roughness: 0.4
  });
  const laptopBase = new THREE.Mesh(baseGeometry, baseMaterial);
  laptopGroup.add(laptopBase);

  // Laptop screen
  const screenGeometry = new THREE.BoxGeometry(2.8, 1.8, 0.1);
  const screenMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0a0a0a,
    metalness: 0.8,
    roughness: 0.2
  });
  const laptopScreen = new THREE.Mesh(screenGeometry, screenMaterial);
  laptopScreen.position.set(0, 1.1, -0.95);
  laptopScreen.rotation.x = -0.2;
  laptopGroup.add(laptopScreen);

  // Screen display (glowing part)
  const displayGeometry = new THREE.PlaneGeometry(2.6, 1.6);
  const displayMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x6c63ff,
    opacity: 0.3,
    transparent: true
  });
  const display = new THREE.Mesh(displayGeometry, displayMaterial);
  display.position.set(0, 1.1, -0.85);
  display.rotation.x = -0.2;
  laptopGroup.add(display);

  // Dell logo (small accent on screen bezel)
  const logoGeometry = new THREE.CircleGeometry(0.08, 32);
  const logoMaterial = new THREE.MeshBasicMaterial({ color: 0x0066cc });
  const logo = new THREE.Mesh(logoGeometry, logoMaterial);
  logo.position.set(0, 0.15, -0.84);
  logo.rotation.x = -0.2;
  laptopGroup.add(logo);

  // Keyboard keys (small detail)
  const keyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2a2a2a,
    metalness: 0.3,
    roughness: 0.7
  });
  
  // Create a grid of keys
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 12; col++) {
      const keyGeo = new THREE.BoxGeometry(0.15, 0.02, 0.15);
      const key = new THREE.Mesh(keyGeo, keyMaterial);
      key.position.set(
        -0.9 + (col * 0.16), 
        0.09, 
        -0.5 + (row * 0.18)
      );
      laptopGroup.add(key);
    }
  }

  // Touchpad
  const touchpadGeo = new THREE.PlaneGeometry(1, 0.6);
  const touchpadMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,
    metalness: 0.5,
    roughness: 0.6
  });
  const touchpad = new THREE.Mesh(touchpadGeo, touchpadMat);
  touchpad.position.set(0, 0.08, 0.5);
  touchpad.rotation.x = -Math.PI / 2;
  laptopGroup.add(touchpad);

  scene.add(laptopGroup);

  // ─── Lighting ───────────────────────────────────────────
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
  frontLight.position.set(2, 3, 5);
  scene.add(frontLight);

  const backLight = new THREE.DirectionalLight(0x6c63ff, 0.3);
  backLight.position.set(-2, -1, -3);
  scene.add(backLight);

  // Rim light for that premium glow
  const rimLight = new THREE.PointLight(0x6c63ff, 1, 10);
  rimLight.position.set(0, 2, -2);
  scene.add(rimLight);

  // ─── Animation Variables ────────────────────────────────
  
  let scrollY = window.scrollY;
  
  // ─── Scroll Event Listener ──────────────────────────────
  
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // ─── Animation Loop ─────────────────────────────────────
  
  function animate() {
    requestAnimationFrame(animate);

    // Smooth floating motion
    const time = Date.now() * 0.0005;
    
    // Move laptop based on scroll position (goes down as you scroll down)
    const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);
    laptopGroup.position.y = 2 - (scrollProgress * 8);
    
    // Move it side to side across the screen as you scroll
    laptopGroup.position.x = Math.sin(scrollProgress * Math.PI * 2) * 3;
    
    // Gentle rotation
    laptopGroup.rotation.y = time * 0.5;
    laptopGroup.rotation.x = Math.sin(time * 0.3) * 0.1;
    
    // Slight bobbing up and down
    laptopGroup.position.y += Math.sin(time * 2) * 0.05;

    // Pulsing glow on the screen
    display.material.opacity = 0.2 + Math.sin(time * 3) * 0.1;

    renderer.render(scene, camera);
  }

  animate();

  // ─── Handle Window Resize ───────────────────────────────
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

}