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
// CAREER SNAPSHOT INTERACTIVITY
// ═══════════════════════════════════════════════════════

const snapshotBtn = document.querySelector('.snapshot-btn');
const snapshotList = document.getElementById('snapshot-list');

if (snapshotBtn && snapshotList) {
  snapshotBtn.addEventListener('click', () => {
    const isOpen = snapshotList.classList.toggle('open');
    snapshotList.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    snapshotBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) snapshotList.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!snapshotBtn.contains(e.target) && !snapshotList.contains(e.target) && snapshotList.classList.contains('open')) {
      snapshotList.classList.remove('open');
      snapshotList.setAttribute('aria-hidden', 'true');
      snapshotBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Keyboard support (Enter/Space)
  snapshotBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      snapshotBtn.click();
    }
  });
}

// Nav hamburger toggle
const nav = document.querySelector('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
if (nav && navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const expanded = nav.classList.contains('open');
    navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });
  // Close nav when link clicked
  navLinks.forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }));
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}


// ═══════════════════════════════════════════════════════
// GLOWING CURSOR EFFECT
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
// SKILL DETAIL MODAL INTERACTIVITY
// ═══════════════════════════════════════════════════════

const skillModal = document.getElementById('skill-modal');
const skillLogo = document.getElementById('skill-logo');
const skillTitle = document.getElementById('skill-modal-title');
const skillCapabilities = document.getElementById('skill-capabilities');
const skillGithubLink = document.getElementById('skill-github-link');

const skillsData = {
  "Python": {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    alt: "Python logo",
    capabilities: [
      "Build web backends (Flask / Django)",
      "Data analysis & automation (pandas, scripting)",
      "Scripting, tooling, and task automation"
    ]
  },
  "JavaScript": {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    alt: "JavaScript logo",
    capabilities: [
      "Interactive frontends (DOM, vanilla JS)",
      "Frameworks & libraries (React basics)",
      "Node.js scripts and small servers"
    ]
  },
  "HTML & CSS": {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    alt: "HTML/CSS",
    capabilities: [
      "Responsive layouts & semantic HTML",
      "Accessible markup and ARIA basics",
      "CSS styling, animations and layouts"
    ]
  },
  "Git & GitHub": {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    alt: "Git logo",
    capabilities: [
      "Version control workflows (branching, merging)",
      "Pull requests and code reviews",
      "Deployments using GitHub Pages"
    ]
  },
  "SQL": {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    alt: "SQL",
    capabilities: [
      "Write queries and joins",
      "Schema design and normalization",
      "Basic performance tuning"
    ]
  },
  "Java": {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    alt: "Java",
    capabilities: [
      "Object-oriented design and patterns",
      "Algorithms and data structures",
      "Console and small GUI applications"
    ]
  }
};

function openSkillModal(skillKey) {
  if (!skillModal) return;
  const data = skillsData[skillKey] || { logo: '', alt: skillKey, capabilities: ['No details available.'] };
  skillLogo.src = data.logo;
  skillLogo.alt = data.alt || skillKey;
  skillTitle.textContent = skillKey;
  skillCapabilities.innerHTML = data.capabilities.map(item => `<li>${item}</li>`).join('');
  // Link to filtered repos on your GitHub (search by skill name)
  skillGithubLink.href = `https://github.com/E-v-an?tab=repositories&q=${encodeURIComponent(skillKey)}`;

  skillModal.classList.add('open');
  skillModal.setAttribute('aria-hidden', 'false');
  // prevent background scroll while modal is open
  document.body.style.overflow = 'hidden';
  // focus close button for keyboard users
  const closeBtn = skillModal.querySelector('.skill-modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeSkillModal() {
  if (!skillModal) return;
  skillModal.classList.remove('open');
  skillModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Attach click/keyboard listeners to skill cards
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.skill || card.textContent.trim();
    openSkillModal(key);
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const key = card.dataset.skill || card.textContent.trim();
      openSkillModal(key);
    }
  });
});

// Close modal when clicking outside content, clicking close button, or pressing Escape
if (skillModal) {
  skillModal.addEventListener('click', (e) => {
    if (e.target === skillModal) closeSkillModal();
  });
  const closeBtn = skillModal.querySelector('.skill-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeSkillModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && skillModal.classList.contains('open')) {
      closeSkillModal();
    }
  });
}

// ═══════════════════════════════════════════════════════
// CERTIFICATE MODAL
// ═══════════════════════════════════════════════════════
const certModal = document.getElementById('cert-modal');
const certImg = document.getElementById('cert-img');

function openCertModal(src, alt) {
  if (!certModal) return;
  if (!src) {
    alert('Certificate image not found. Add the image to assets/images and set the card\'s data-cert-src attribute.');
    return;
  }
  certImg.src = src;
  certImg.alt = alt || 'Certificate';
  certModal.classList.add('open');
  certModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  if (!certModal) return;
  certModal.classList.remove('open');
  certModal.setAttribute('aria-hidden', 'true');
  certImg.src = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => openCertModal(card.dataset.certSrc, card.textContent.trim()));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCertModal(card.dataset.certSrc, card.textContent.trim()); }
  });
});

if (certModal) {
  certModal.addEventListener('click', (e) => { if (e.target === certModal) closeCertModal(); });
  const closeBtn = certModal.querySelector('.cert-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeCertModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && certModal.classList.contains('open')) closeCertModal(); });
}

// ═══════════════════════════════════════════════════════
// DEGREE (BSc) — YEAR CARDS AND UNITS
// ═══════════════════════════════════════════════════════
const degreeModal = document.getElementById('degree-modal');
const yearUnits = document.getElementById('year-units');
const bscDegreeBtn = document.getElementById('bsc-degree');

// Sample fallback data — replace or create assets/data/grades.json with your real results (see README below)
const sampleGradesData = {
  "1": [
    { "unit": "Intro to Programming", "score": "A" },
    { "unit": "Discrete Math", "score": "B+" },
    { "unit": "Computer Systems I", "score": "A-" }
  ],
  "2": [
    { "unit": "Data Structures", "score": "A" },
    { "unit": "Databases", "score": "B" },
    { "unit": "Operating Systems", "score": "B+" }
  ],
  "3": [
    { "unit": "Algorithms", "score": "A-" },
    { "unit": "Networks", "score": "B+" },
    { "unit": "Software Engineering", "score": "A" }
  ],
  "4": [
    { "unit": "Final Year Project", "score": "A" },
    { "unit": "Distributed Systems", "score": "B+" },
    { "unit": "AI Basics", "score": "A-" }
  ]
};

async function loadGradesData() {
  try {
    const resp = await fetch('assets/data/grades.json');
    if (resp.ok) return await resp.json();
  } catch (err) {
    console.warn('Could not fetch assets/data/grades.json — using sample data', err);
  }
  return sampleGradesData;
}

async function showYearUnits(year) {
  const data = await loadGradesData();
  const list = data[String(year)] || data[`Year ${year}`] || [];
  if (!yearUnits) return;
  if (!list.length) {
    yearUnits.innerHTML = '<p>No data available for that year. Add assets/data/grades.json with real results.</p>';
    return;
  }
  yearUnits.innerHTML = '<ul>' + list.map(u => `<li><strong>${u.unit}</strong> — ${u.score}</li>`).join('') + '</ul>';
}

function openDegreeModal() {
  if (!degreeModal) return;
  degreeModal.classList.add('open');
  degreeModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDegreeModal() {
  if (!degreeModal) return;
  degreeModal.classList.remove('open');
  degreeModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // clear selection
  degreeModal.querySelectorAll('.year-card').forEach(c => c.classList.remove('selected'));
  if (yearUnits) yearUnits.innerHTML = '';
}

if (bscDegreeBtn) {
  bscDegreeBtn.addEventListener('click', openDegreeModal);
  bscDegreeBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDegreeModal(); } });
}

if (degreeModal) {
  degreeModal.addEventListener('click', (e) => { if (e.target === degreeModal) closeDegreeModal(); });
  const closeBtn = degreeModal.querySelector('.degree-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeDegreeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && degreeModal.classList.contains('open')) closeDegreeModal(); });
  degreeModal.querySelectorAll('.year-card').forEach(card => {
    card.addEventListener('click', async () => {
      degreeModal.querySelectorAll('.year-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      await showYearUnits(card.dataset.year);
    });
    card.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); degreeModal.querySelectorAll('.year-card').forEach(c => c.classList.remove('selected')); card.classList.add('selected'); await showYearUnits(card.dataset.year); }
    });
  });
}

const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

if(cursorDot && cursorGlow){
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
}

const clickableElements = document.querySelectorAll('a, button, .btn, .btn-small, .skill-card, .project-card');
clickableElements.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ==========================================
// 3D LAPTOP BACKGROUND
// ==========================================

if (window.innerWidth > 768 && typeof THREE !== "undefined") {

    const canvas = document.getElementById("bg-canvas");

    //----------------------------------
    // Scene
    //----------------------------------
    const scene = new THREE.Scene();

    //----------------------------------
    // Camera
    //----------------------------------
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(0, 0.5, 7);

    //----------------------------------
    // Renderer
    //----------------------------------
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //----------------------------------
    // Orbit Controls
    //----------------------------------
    const controls = new THREE.OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 1.8;

    //----------------------------------
    // Lighting
    //----------------------------------

    // soft white light
    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        1.5
    );
    scene.add(ambientLight);

    // main directional light
    const directionalLight =
        new THREE.DirectionalLight(
            0xffffff,
            2
        );

    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const skyLight =
    new THREE.PointLight(
        0x87CEEB,
        4,
        30
    );

skyLight.position.set(-5, 2, 3);
scene.add(skyLight);

    // purple accent light (define before use)
    const purpleLight = new THREE.PointLight(0x7c3aef, 0.9, 40);
    purpleLight.position.set(-3, 1.6, 2);
    scene.add(purpleLight);

    // blue accent light
    const blueLight =
        new THREE.PointLight(
            0x00d4ff,
            3,
            30
        );

    blueLight.position.set(5, -2, 3);
    scene.add(blueLight);
        //----------------------------------
// CLOUD SYSTEM
//----------------------------------

const cloudGroup = new THREE.Group();
scene.add(cloudGroup);

const cloudTextureLoader = new THREE.TextureLoader();

// Simple cloud sprite texture (you can replace with custom PNG later)
const cloudTexture = cloudTextureLoader.load(
    "assets/images/cloud.png"
);

// Create multiple clouds
function createCloud(x, y, z, scale = 1) {
    const material = new THREE.SpriteMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.9
    });

    const cloud = new THREE.Sprite(material);

    cloud.position.set(x, y, z);
    cloud.scale.set(scale * 8, scale * 5, 1);

    cloudGroup.add(cloud);

    return cloud;
}

// Generate sky clouds
const clouds = [];

for (let i = 0; i < 20; i++) {
    const x = (Math.random() - 0.5) * 30;
    const y = Math.random() * 10 + 2;
    const z = (Math.random() - 0.5) * 20;

    const scale = Math.random() * 2 + 1;

    clouds.push(createCloud(x, y, z, scale));
}
    
    //----------------------------------
    // Load Laptop Model
    //----------------------------------
    let laptopModel;

    const loader = new THREE.GLTFLoader();

    loader.load(
        "assets/models/laptop.glb",

        function (gltf) {
            laptopModel = gltf.scene;

            //----------------------------------
            // MAKE LAPTOP BIGGER
            //----------------------------------
            laptopModel.scale.set(4.5, 4.5, 4.5);

            laptopModel.position.set(0, -0.5, 0);

            laptopModel.rotation.y = 0.5;

            scene.add(laptopModel);

            console.log("Laptop loaded successfully");
        },

        function (xhr) {
            if (xhr.total) {
             console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            }
        },

        function (error) {
            console.error(error);
        }
    );

    //----------------------------------
    // Scroll movement
    //----------------------------------
    let scrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
    });

    //----------------------------------
    // Animation loop
    //----------------------------------
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        if (laptopModel) {

            // slow rotation
            laptopModel.rotation.y += 0.002;

            // floating animation
            laptopModel.position.y =
                Math.sin(time * 1.5) * 0.2;

            // scroll movement
            const scrollProgress =
                scrollY /
                (document.body.scrollHeight -
                    window.innerHeight);

            laptopModel.position.x =
                Math.sin(scrollProgress * Math.PI) * 2;
        }

        controls.update();
//----------------------------------
// CLOUD ANIMATION
//----------------------------------

clouds.forEach((cloud, index) => {
    cloud.position.x += 0.003;

    // loop clouds back when they go too far
    if (cloud.position.x > 12) {
        cloud.position.x = -12;
    }

    cloud.material.opacity =
        0.4 + Math.sin(Date.now() * 0.0005 + index) * 0.1;
});
        renderer.render(scene, camera);
    }

    animate();

    //----------------------------------
    // Resize
    //----------------------------------
    window.addEventListener("resize", () => {
        camera.aspect =
            window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    });
}