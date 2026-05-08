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

// ─────────────────────────────────────────────
// LOAD REAL GLB LAPTOP MODEL
// ─────────────────────────────────────────────

let laptopModel;

const loader = new THREE.GLTFLoader();

loader.load(
  "C:\Users\USER\OneDrive\Desktop\Calvin\LIFE ADVANCEMENT\Github projects\Portfolio website\.sixth\assets\modelsassets/models/laptop.glb",

  function (gltf) {
    laptopModel = gltf.scene;

    // scale model
    laptopModel.scale.set(2, 2, 2);

    // position model
    laptopModel.position.set(0, 0, 0);

    // rotate for better angle
    laptopModel.rotation.x = 0.1;
    laptopModel.rotation.y = 0.4;

    // enable shadows
    laptopModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(laptopModel);

    console.log("Laptop model loaded successfully");
  },

  function (xhr) {
    console.log(
      (xhr.loaded / xhr.total) * 100 + "% loaded"
    );
  },

  function (error) {
    console.error("Error loading laptop model:", error);
  }
);

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
    
   if (laptopModel) {
  laptopModel.position.y = 1.5 - (scrollProgress * 6);

  laptopModel.position.x =
    Math.sin(scrollProgress * Math.PI * 1.5) * 4;

  laptopModel.rotation.y = time * 0.3;

  laptopModel.rotation.z =
    Math.sin(time * 0.5) * 0.03;

  laptopModel.position.y +=
    Math.sin(time * 2) * 0.08;
}
    
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