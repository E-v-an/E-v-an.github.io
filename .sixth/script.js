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
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true,  // Transparent background
    antialias: true  // Smooth edges
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Better performance
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  camera.position.z = 6;
  camera.position.y = 0.5;

  // ─── Create Premium Materials ───────────────────────────
  
  // Aluminum body material (like real Dell laptops)
  const aluminumMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2a2a2a,
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 1.5
  });

  // Screen bezel (matte black plastic)
  const bezelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0a0a0a,
    metalness: 0.3,
    roughness: 0.8
  });

  // Screen display (glossy with slight reflection)
  const screenMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a3a,
    metalness: 0.95,
    roughness: 0.05,
    emissive: 0x1a1a3a,
    emissiveIntensity: 0.2
  });

  // Keyboard keys
  const keyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,
    metalness: 0.1,
    roughness: 0.9
  });

  // Glowing Dell logo
  const logoMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0066cc,
    emissive: 0x0066cc,
    emissiveIntensity: 0.6,
    metalness: 0.8,
    roughness: 0.2
  });

  // ─── Build the Laptop ───────────────────────────────────
  
  const laptopGroup = new THREE.Group();

  // === BOTTOM SECTION (Keyboard/Touchpad) ===

  // Main base with rounded edges
  const baseShape = new THREE.Shape();
  const baseWidth = 3.0;
  const baseDepth = 1.8;
  const cornerRadius = 0.08;
  
  baseShape.moveTo(-baseWidth/2 + cornerRadius, -baseDepth/2);
  baseShape.lineTo(baseWidth/2 - cornerRadius, -baseDepth/2);
  baseShape.quadraticCurveTo(baseWidth/2, -baseDepth/2, baseWidth/2, -baseDepth/2 + cornerRadius);
  baseShape.lineTo(baseWidth/2, baseDepth/2 - cornerRadius);
  baseShape.quadraticCurveTo(baseWidth/2, baseDepth/2, baseWidth/2 - cornerRadius, baseDepth/2);
  baseShape.lineTo(-baseWidth/2 + cornerRadius, baseDepth/2);
  baseShape.quadraticCurveTo(-baseWidth/2, baseDepth/2, -baseWidth/2, baseDepth/2 - cornerRadius);
  baseShape.lineTo(-baseWidth/2, -baseDepth/2 + cornerRadius);
  baseShape.quadraticCurveTo(-baseWidth/2, -baseDepth/2, -baseWidth/2 + cornerRadius, -baseDepth/2);
  
  const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 };
  const baseGeometry = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
  const laptopBase = new THREE.Mesh(baseGeometry, aluminumMaterial);
  laptopBase.rotation.x = -Math.PI / 2;
  laptopBase.position.y = 0;
  laptopBase.castShadow = true;
  laptopGroup.add(laptopBase);

  // Keyboard area (slightly recessed)
  const keyboardAreaGeo = new THREE.BoxGeometry(2.8, 0.02, 1.6);
  const keyboardArea = new THREE.Mesh(keyboardAreaGeo, new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,
    metalness: 0.2,
    roughness: 0.8
  }));
  keyboardArea.position.set(0, 0.08, -0.05);
  laptopGroup.add(keyboardArea);

  // Individual keys with realistic spacing
  const keyWidth = 0.12;
  const keyHeight = 0.12;
  const keyGap = 0.02;
  const rows = 5;
  const cols = 14;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const keyGeo = new THREE.BoxGeometry(keyWidth, 0.04, keyHeight, 1, 1, 1);
      const key = new THREE.Mesh(keyGeo, keyMaterial);
      
      const xPos = -1.0 + (col * (keyWidth + keyGap));
      const zPos = -0.8 + (row * (keyHeight + keyGap));
      
      key.position.set(xPos, 0.11, zPos);
      key.castShadow = true;
      laptopGroup.add(key);
    }
  }

  // Spacebar (wider key)
  const spacebarGeo = new THREE.BoxGeometry(1.2, 0.04, keyHeight);
  const spacebar = new THREE.Mesh(spacebarGeo, keyMaterial);
  spacebar.position.set(0, 0.11, 0.48);
  spacebar.castShadow = true;
  laptopGroup.add(spacebar);

  // Touchpad with realistic detail
  const touchpadGeo = new THREE.BoxGeometry(1.1, 0.01, 0.7);
  const touchpadMat = new THREE.MeshStandardMaterial({ 
    color: 0x252525,
    metalness: 0.4,
    roughness: 0.3
  });
  const touchpad = new THREE.Mesh(touchpadGeo, touchpadMat);
  touchpad.position.set(0, 0.09, 0.45);
  laptopGroup.add(touchpad);

  // Touchpad buttons
  const buttonGeo = new THREE.BoxGeometry(0.5, 0.01, 0.08);
  const leftButton = new THREE.Mesh(buttonGeo, keyMaterial);
  leftButton.position.set(-0.27, 0.09, 1.08);
  laptopGroup.add(leftButton);
  
  const rightButton = new THREE.Mesh(buttonGeo, keyMaterial);
  rightButton.position.set(0.27, 0.09, 1.08);
  laptopGroup.add(rightButton);

  // === TOP SECTION (Screen) ===

  // Screen back panel (aluminum)
  const screenBackGeo = new THREE.BoxGeometry(3.0, 1.95, 0.08);
  const screenBack = new THREE.Mesh(screenBackGeo, aluminumMaterial);
  screenBack.position.set(0, 1.2, -0.85);
  screenBack.rotation.x = -0.15;
  screenBack.castShadow = true;
  laptopGroup.add(screenBack);

  // Screen bezel (black frame around display)
  const bezelGeo = new THREE.BoxGeometry(2.92, 1.87, 0.05);
  const bezel = new THREE.Mesh(bezelGeo, bezelMaterial);
  bezel.position.set(0, 1.2, -0.77);
  bezel.rotation.x = -0.15;
  laptopGroup.add(bezel);

  // Actual display screen
  const displayGeo = new THREE.BoxGeometry(2.7, 1.65, 0.02);
  const display = new THREE.Mesh(displayGeo, screenMaterial);
  display.position.set(0, 1.2, -0.74);
  display.rotation.x = -0.15;
  laptopGroup.add(display);

  // Screen glow overlay (animated)
  const glowGeo = new THREE.PlaneGeometry(2.7, 1.65);
  const glowMat = new THREE.MeshBasicMaterial({ 
    color: 0x6c63ff,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });
  const screenGlow = new THREE.Mesh(glowGeo, glowMat);
  screenGlow.position.set(0, 1.2, -0.72);
  screenGlow.rotation.x = -0.15;
  laptopGroup.add(screenGlow);

  // Dell logo on lid (glowing blue circle)
  const logoGeo = new THREE.CircleGeometry(0.06, 32);
  const logo = new THREE.Mesh(logoGeo, logoMaterial);
  logo.position.set(0, 1.95, -1.08);
  logo.rotation.x = -0.15;
  laptopGroup.add(logo);

  // Hinge (connects base to screen)
  const hingeGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.0, 16);
  const hingeMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.3
  });
  const hinge = new THREE.Mesh(hingeGeo, hingeMat);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, 0.15, -0.85);
  laptopGroup.add(hinge);

  // Webcam (small detail on top bezel)
  const webcamGeo = new THREE.CircleGeometry(0.02, 16);
  const webcamMat = new THREE.MeshStandardMaterial({ 
    color: 0x0a0a0a,
    metalness: 0.8,
    roughness: 0.2
  });
  const webcam = new THREE.Mesh(webcamGeo, webcamMat);
  webcam.position.set(0, 2.0, -0.93);
  webcam.rotation.x = -0.15;
  laptopGroup.add(webcam);

  // Add some USB ports on the side (tiny details)
  const portGeo = new THREE.BoxGeometry(0.02, 0.06, 0.12);
  const portMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  
  for (let i = 0; i < 3; i++) {
    const port = new THREE.Mesh(portGeo, portMat);
    port.position.set(1.6, 0.06, -0.5 + (i * 0.15));
    laptopGroup.add(port);
  }

  scene.add(laptopGroup);

  // ─── Professional Lighting Setup ────────────────────────
  
  // Ambient light (soft overall illumination)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // Main key light (from upper left)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(5, 8, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 50;
  scene.add(keyLight);

  // Fill light (softer, from right)
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
  fillLight.position.set(-3, 3, 2);
  scene.add(fillLight);

  // Rim light (purple accent from behind)
  const rimLight = new THREE.PointLight(0x6c63ff, 1.5, 15);
  rimLight.position.set(0, 3, -5);
  scene.add(rimLight);

  // Bottom bounce light (subtle uplighting)
  const bounceLight = new THREE.PointLight(0x4444ff, 0.3, 10);
  bounceLight.position.set(0, -2, 0);
  scene.add(bounceLight);

  // ─── Animation Variables ────────────────────────────────
  
  let scrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // ─── Smooth Animation Loop ──────────────────────────────
  
  function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.0003;
    const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);
    
    // Vertical movement based on scroll (slower, smoother)
    laptopGroup.position.y = 1.5 - (scrollProgress * 6);
    
    // Horizontal wave motion (wider, slower arc)
    laptopGroup.position.x = Math.sin(scrollProgress * Math.PI * 1.5) * 4;
    
    // Gentle continuous rotation
    laptopGroup.rotation.y = time * 0.3;
    laptopGroup.rotation.z = Math.sin(time * 0.5) * 0.03;
    
    // Subtle floating bob
    laptopGroup.position.y += Math.sin(time * 2) * 0.08;
    
    // Pulsing screen glow
    screenGlow.material.opacity = 0.12 + Math.sin(time * 4) * 0.06;
    
    // Breathing logo glow
    logoMaterial.emissiveIntensity = 0.5 + Math.sin(time * 2.5) * 0.3;

    // Subtle camera sway for cinematic feel
    camera.position.x = Math.sin(time * 0.5) * 0.3;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // ─── Responsive Resize Handler ──────────────────────────
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

}