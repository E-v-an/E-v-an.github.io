// Native section links scroll vertically and keep their URL fragments.

const contactForm = document.querySelector('#contact-form');
const contactMessage = document.querySelector('#contact-message');
const wordCount = document.querySelector('#word-count');
const talkToggle = document.querySelector('#talk-toggle');
const talkOptions = document.querySelector('#talk-options');
const maxMessageWords = 500;

if (contactForm instanceof HTMLFormElement &&
    contactMessage instanceof HTMLTextAreaElement &&
    wordCount instanceof HTMLElement) {
  const getMessageWords = () => contactMessage.value.trim().split(/\s+/).filter(Boolean);

  contactMessage.addEventListener('input', () => {
    const words = getMessageWords();
    if (words.length > maxMessageWords) {
      contactMessage.value = words.slice(0, maxMessageWords).join(' ');
    }
    wordCount.textContent = `${getMessageWords().length} / ${maxMessageWords} words`;
  });

  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const message = contactMessage.value.trim();
    if (!message) return;

    window.location.href = `https://wa.me/254742308701?text=${encodeURIComponent(message)}`;
  });
}


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
const domainsBtn = document.querySelector('.domains-btn');
const focusBtn = document.querySelector('.focus-btn');
const focusPanel = document.getElementById('focus-panel');

function setSidePanelExpanded(panel, expanded) {
  const content = panel.querySelector('.side-panel-content');
  const handle = panel.querySelector('.side-panel-handle');
  const closeButton = panel.querySelector('.side-panel-close');
  if (!(content instanceof HTMLElement) ||
      !(handle instanceof HTMLButtonElement) ||
      !(closeButton instanceof HTMLButtonElement)) return;

  panel.classList.toggle('expanded', expanded);
  content.inert = !expanded;
  content.setAttribute('aria-hidden', String(!expanded));
  handle.setAttribute('aria-expanded', String(expanded));
  closeButton.tabIndex = expanded ? 0 : -1;

  const projectList = content.querySelector('.project-list');
  if (projectList) {
    projectList.classList.toggle('open', expanded);
    projectList.setAttribute('aria-hidden', String(!expanded));
  }
}

function closeSidePanel(button, panel, restoreFocus = false) {
  panel.classList.remove('open', 'expanded');
  panel.inert = true;
  panel.setAttribute('aria-hidden', 'true');
  button.setAttribute('aria-expanded', 'false');
  setSidePanelExpanded(panel, false);

  if (restoreFocus) button.focus({ preventScroll: true });
}

function toggleSidePanel(button, panel) {
  if (!(button instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) return;

  const opening = !panel.classList.contains('open');
  if (!opening) {
    closeSidePanel(button, panel);
    return;
  }

  panel.classList.add('open');
  panel.inert = false;
  panel.setAttribute('aria-hidden', 'false');
  button.setAttribute('aria-expanded', 'true');
  setSidePanelExpanded(panel, false);
  panel.querySelector('.side-panel-handle')?.focus({ preventScroll: true });
}

function setupSidePanel(button, panel) {
  if (!(button instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) return;

  const handle = panel.querySelector('.side-panel-handle');
  const closeButton = panel.querySelector('.side-panel-close');
  if (!(handle instanceof HTMLButtonElement) || !(closeButton instanceof HTMLButtonElement)) return;

  button.addEventListener('click', () => toggleSidePanel(button, panel));
  handle.addEventListener('click', () => setSidePanelExpanded(panel, !panel.classList.contains('expanded')));
  closeButton.addEventListener('click', () => closeSidePanel(button, panel, true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('open')) {
      closeSidePanel(button, panel, true);
    }
  });

  let touchStartX = null;
  panel.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') touchStartX = event.clientX;
  });
  panel.addEventListener('pointerup', event => {
    if (touchStartX === null) return;

    const swipeDistance = event.clientX - touchStartX;
    touchStartX = null;
    if (swipeDistance < -40) setSidePanelExpanded(panel, true);
    if (swipeDistance > 40 && panel.classList.contains('expanded')) {
      setSidePanelExpanded(panel, false);
    }
  });

  panel.addEventListener('wheel', event => {
    if (event.deltaX > 12) setSidePanelExpanded(panel, true);
    if (event.deltaX < -12 && panel.classList.contains('expanded')) {
      setSidePanelExpanded(panel, false);
    }
  }, { passive: true });

  document.addEventListener('pointerdown', event => {
    const target = event.target;
    if (target instanceof Node &&
        panel.classList.contains('open') &&
        !panel.contains(target) &&
        !button.contains(target)) {
      closeSidePanel(button, panel);
    }
  });
}

setupSidePanel(snapshotBtn, document.getElementById('snapshot-inline'));
setupSidePanel(domainsBtn, document.getElementById('domains-inline'));
setupSidePanel(focusBtn, focusPanel);
setupSidePanel(talkToggle, talkOptions);

// Nav hamburger toggle
const nav = document.querySelector('nav');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-links a');
if (nav && navToggle && navMenu) {
  const syncNavState = (expanded) => {
    nav.classList.toggle('open', expanded);
    navToggle.setAttribute('aria-expanded', String(expanded));
    navMenu.setAttribute('aria-hidden', String(!expanded));
  };

  navToggle.addEventListener('click', () => {
    const expanded = nav.classList.contains('open');
    syncNavState(!expanded);
  });

  // Close nav when link clicked
  navLinks.forEach(a => a.addEventListener('click', () => {
    syncNavState(false);
  }));

  // Close on outside click
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof Node && !nav.contains(target) && nav.classList.contains('open')) {
      syncNavState(false);
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
      "Interactive user interfaces (DOM, vanilla JS)",
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
  const easing = 0.45;
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
    }, { passive: true });

    //----------------------------------
    // Animation loop
    //----------------------------------
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        if (laptopModel) {
            const scrollProgress = scrollY /
                Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

            // slow rotation
            laptopModel.rotation.y += 0.002;

            // floating animation
            laptopModel.position.y =
                Math.sin(time * 1.5) * 0.2 + scrollProgress * 1.2;

            // scroll movement
            laptopModel.position.x =
                1.8 + Math.sin(scrollProgress * Math.PI) * 0.6;
        }

        controls.update();
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

// ==========================================
// SCROLL-DRIVEN STORM BACKGROUND
// ==========================================

(() => {
  const stormTint = document.getElementById('storm-tint');
  const rainCanvas = document.getElementById('rain-canvas');
  const lightningFlash = document.getElementById('lightning-flash');
  const lightningBolt = document.getElementById('lightning-bolt-path');
  const lightningGlow = document.getElementById('lightning-bolt-glow');
  const lightningBranches = document.getElementById('lightning-branch-path');
  const lightningBranchGlow = document.getElementById('lightning-branch-glow');

  if (!(stormTint instanceof HTMLElement) ||
      !(rainCanvas instanceof HTMLCanvasElement) ||
      !(lightningFlash instanceof HTMLElement) ||
      !(lightningBolt instanceof SVGPathElement) ||
      !(lightningGlow instanceof SVGPathElement) ||
      !(lightningBranches instanceof SVGPathElement) ||
      !(lightningBranchGlow instanceof SVGPathElement)) {
    console.error('Storm effects could not start because required page elements are missing.');
    return;
  }

  const rainContext = rainCanvas.getContext('2d', { alpha: true });
  if (!rainContext) {
    console.error('Storm rain could not start because a 2D canvas context is unavailable.');
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  const rainStart = 0.35;
  const lightningStart = 0.72;
  let viewportWidth = 0;
  let viewportHeight = 0;
  let pixelRatio = 1;
  let rainDrops = [];
  let scrollProgress = 0;
  let rainIntensity = 0;
  let lightningIntensity = 0;
  let rainFrameId = 0;
  let progressFrameId = 0;
  let lastRainFrame = 0;
  let nextLightningAt = 0;
  let lightningStartedAt = -Infinity;
  let lightningPeak = 0;
  let stormAudioContext = null;
  let windSource = null;
  let windFilter = null;
  let windGain = null;
  let thunderBus = null;
  let audioUnlocking = false;
  let cloudTileWidth = 0;
  let cloudImageHeight = 0;
  let cloudVerticalPosition = 0.38;
  let cloudDriftOffset = 0;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const cloudEdgeProfile = [
    [0, 1390], [40, 1389], [80, 1386], [120, 1380], [160, 1383],
    [200, 1381], [240, 1380], [280, 1376], [320, 1379], [360, 1374],
    [400, 1374], [440, 1374], [480, 1377], [520, 1378], [560, 1377],
    [600, 1385], [640, 1388], [680, 1401], [720, 1428], [760, 1442],
    [800, 1432], [840, 1426], [880, 1417], [920, 1399], [960, 1393],
    [1000, 1383], [1040, 1382], [1080, 1379], [1120, 1374], [1160, 1375],
    [1200, 1381], [1240, 1379], [1280, 1385], [1320, 1387], [1360, 1383],
    [1400, 1384], [1440, 1377], [1480, 1392], [1520, 1406], [1560, 1421],
    [1600, 1449], [1640, 1456], [1680, 1446], [1720, 1425], [1760, 1416],
    [1800, 1415], [1840, 1421], [1880, 1434], [1920, 1435], [1960, 1430],
    [2000, 1409], [2040, 1391], [2080, 1380], [2120, 1373], [2160, 1365],
    [2200, 1371], [2240, 1370], [2280, 1390], [2320, 1413], [2360, 1436],
    [2400, 1455], [2440, 1456], [2480, 1454], [2520, 1440], [2560, 1417],
    [2600, 1405], [2640, 1404], [2680, 1402], [2720, 1425], [2760, 1444],
    [2800, 1465], [2840, 1473], [2880, 1481], [2920, 1487], [2960, 1479],
    [3000, 1465], [3040, 1466], [3080, 1469], [3120, 1478], [3160, 1482],
    [3200, 1483], [3240, 1460], [3280, 1447], [3320, 1425], [3360, 1411],
    [3400, 1399], [3440, 1380], [3480, 1375], [3520, 1377], [3560, 1372],
    [3600, 1372], [3640, 1372], [3680, 1378], [3720, 1382], [3760, 1382],
    [3800, 1380], [3840, 1390]
  ];

  function updateCloudLayerPosition() {
    const cloudGrowth = clamp((scrollProgress - 0.1) / 0.8);
    const nextImageHeight = viewportHeight * (0.47 + cloudGrowth * 0.4);
    const containerHeight = viewportHeight * 1.16;
    const nextVerticalPosition = (viewportHeight * 0.63 - nextImageHeight) /
      (containerHeight - nextImageHeight);

    if (Math.abs(nextImageHeight - cloudImageHeight) > 0.5) {
      document.body.style.setProperty('--cloud-height', `${nextImageHeight}px`);
    }
    if (Math.abs(nextVerticalPosition - cloudVerticalPosition) > 0.001) {
      document.body.style.setProperty('--cloud-position-y', `${nextVerticalPosition * 100}%`);
    }
    cloudImageHeight = nextImageHeight;
    cloudVerticalPosition = nextVerticalPosition;

    const cloudStyle = window.getComputedStyle(document.body, '::after');
    const [imageWidth] = cloudStyle.backgroundSize
      .split(',')[0]
      .trim()
      .split(/\s+/)
      .map(Number.parseFloat);
    const [positionX] = cloudStyle.backgroundPosition
      .split(',')[0]
      .trim()
      .split(/\s+/);
    cloudTileWidth = imageWidth || Math.max(viewportWidth * 1.5, viewportHeight * 1.7);
    const positionValue = Number.parseFloat(positionX) || 0;
    cloudDriftOffset = positionX.endsWith('%')
      ? (viewportWidth * 1.16 - cloudTileWidth) * positionValue / 100
      : positionValue;
  }

  function getCloudBottomY(viewportX) {
    const imageX = ((viewportX + viewportWidth * 0.08 - cloudDriftOffset) % cloudTileWidth + cloudTileWidth) % cloudTileWidth;
    const sourceX = imageX / cloudTileWidth * 3840;
    let segmentIndex = 0;
    while (segmentIndex < cloudEdgeProfile.length - 2 && sourceX > cloudEdgeProfile[segmentIndex + 1][0]) {
      segmentIndex += 1;
    }

    const previousY = cloudEdgeProfile[
      segmentIndex === 0 ? cloudEdgeProfile.length - 2 : segmentIndex - 1
    ][1];
    const startY = cloudEdgeProfile[segmentIndex][1];
    const endY = cloudEdgeProfile[segmentIndex + 1][1];
    const nextY = cloudEdgeProfile[
      segmentIndex === cloudEdgeProfile.length - 2 ? 1 : segmentIndex + 2
    ][1];
    const startX = cloudEdgeProfile[segmentIndex][0];
    const endX = cloudEdgeProfile[segmentIndex + 1][0];
    const progress = clamp((sourceX - startX) / (endX - startX));
    const progressSquared = progress * progress;
    const progressCubed = progressSquared * progress;
    const sourceY = 0.5 * (
      2 * startY +
      (-previousY + endY) * progress +
      (2 * previousY - 5 * startY + 4 * endY - nextY) * progressSquared +
      (-previousY + 3 * startY - 3 * endY + nextY) * progressCubed
    );
    const imageTop = -viewportHeight * 0.08 + (viewportHeight * 1.16 - cloudImageHeight) * cloudVerticalPosition;
    return imageTop + sourceY / 1505 * cloudImageHeight;
  }

  function drawLightningBolt() {
    let x = randomBetween(6, 94);
    let y = getCloudBottomY(x / 100 * viewportWidth) / viewportHeight * 100;
    const mainBranch = [[x, y]];
    const sideBranches = [];

    while (y < 100) {
      const step = randomBetween(2.5, 5.5);
      y = Math.min(100, y + step);
      x = clamp(x + randomBetween(-3, 3), 18, 82);
      mainBranch.push([x, y]);
    }

    for (let index = 2; index < mainBranch.length - 1; index += 2) {
      if (Math.random() > 0.62) continue;

      const [branchX, branchY] = mainBranch[index];
      const direction = Math.random() < 0.5 ? -1 : 1;
      const length = randomBetween(6, 12);
      const branchMidY = Math.min(100, branchY + randomBetween(2, 5));
      sideBranches.push([
        [branchX, branchY],
        [branchX + direction * length * 0.55, branchMidY],
        [clamp(branchX + direction * length, 8, 92), Math.min(100, branchMidY + randomBetween(3, 7))]
      ]);
    }

    const toPath = points => `M ${points.map(([pointX, pointY]) => `${pointX} ${pointY}`).join(' L ')}`;
    const mainPath = toPath(mainBranch);
    const branchPath = sideBranches.map(toPath).join(' ');
    lightningBolt.setAttribute('d', mainPath);
    lightningGlow.setAttribute('d', mainPath);
    lightningBranches.setAttribute('d', branchPath);
    lightningBranchGlow.setAttribute('d', branchPath);
    const flashX = mainBranch[0][0];
    const flashY = mainBranch[0][1];
    const cloudFlashY = Math.max(12, flashY - randomBetween(8, 18));
    lightningFlash.style.setProperty('--lightning-x', `${flashX}%`);
    lightningFlash.style.setProperty('--lightning-y', `${cloudFlashY}%`);
  }

  function makeRainOrigin(x) {
    return getCloudBottomY(x) + randomBetween(-1.5, 1.5);
  }

  function makeRainDrop() {
    const x = Math.random() * viewportWidth;
    return {
      x,
      y: makeRainOrigin(x),
      length: randomBetween(10, 18),
      speed: randomBetween(520, 760)
    };
  }

  function resizeRainCanvas() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    updateCloudLayerPosition();
    rainCanvas.width = Math.max(1, Math.round(viewportWidth * pixelRatio));
    rainCanvas.height = Math.max(1, Math.round(viewportHeight * pixelRatio));
    rainContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const dropCount = Math.min(550, Math.max(120, Math.round(viewportWidth * 0.36)));
    rainDrops = Array.from({ length: dropCount }, makeRainDrop);
  }

  function startWindAudio() {
    if (!stormAudioContext || windSource) return;

    const sampleRate = stormAudioContext.sampleRate;
    const sampleCount = Math.ceil(sampleRate * 4);
    const noiseSamples = new Float32Array(sampleCount);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;
    for (let index = 0; index < sampleCount; index += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      b6 = white * 0.115926;
      noiseSamples[index] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    }

    const crossfadeLength = Math.floor(sampleRate * 0.08);
    const loopLength = sampleCount - crossfadeLength;
    const buffer = stormAudioContext.createBuffer(1, loopLength, sampleRate);
    const samples = buffer.getChannelData(0);
    const crossfadeStart = sampleCount - crossfadeLength * 2;
    for (let index = 0; index < loopLength; index += 1) {
      if (index < crossfadeStart) {
        samples[index] = noiseSamples[index + crossfadeLength];
      } else {
        const crossfadeIndex = index - crossfadeStart;
        const blend = crossfadeIndex / (crossfadeLength - 1);
        samples[index] =
          noiseSamples[sampleCount - crossfadeLength + crossfadeIndex] * (1 - blend) +
          noiseSamples[crossfadeIndex] * blend;
      }
    }

    const source = stormAudioContext.createBufferSource();
    const filter = stormAudioContext.createBiquadFilter();
    const volume = stormAudioContext.createGain();
    const now = stormAudioContext.currentTime;

    source.buffer = buffer;
    source.loop = true;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, now);
    filter.Q.setValueAtTime(0.35, now);
    volume.gain.setValueAtTime(0.0001, now);

    source.connect(filter);
    filter.connect(volume);
    volume.connect(stormAudioContext.destination);
    source.start();
    windSource = source;
    windFilter = filter;
    windGain = volume;
  }

  function updateWindAudio() {
    if (!stormAudioContext || stormAudioContext.state !== 'running' || !windFilter || !windGain) return;

    const now = stormAudioContext.currentTime;
    const targetVolume = 0.0001 + Math.pow(rainIntensity, 1.5) * 0.075;
    windGain.gain.setTargetAtTime(targetVolume, now, 0.45);
    windFilter.frequency.setTargetAtTime(750 + rainIntensity * 1500, now, 0.55);
  }

  function createThunderBus(context) {
    const compressor = context.createDynamicsCompressor();
    const now = context.currentTime;
    compressor.threshold.setValueAtTime(-16, now);
    compressor.knee.setValueAtTime(18, now);
    compressor.ratio.setValueAtTime(5, now);
    compressor.attack.setValueAtTime(0.004, now);
    compressor.release.setValueAtTime(0.65, now);
    compressor.connect(context.destination);
    return compressor;
  }

  function scheduleThunderVoice(context, startAt, preset, intensity) {
    const duration = randomBetween(preset.duration - 0.2, preset.duration + 0.25);
    const buffer = context.createBuffer(
      1,
      Math.ceil(context.sampleRate * duration),
      context.sampleRate
    );
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] = Math.random() * 2 - 1;
    }

    const source = context.createBufferSource();
    const rumbleFilter = context.createBiquadFilter();
    const rumbleGain = context.createGain();
    const subRumble = context.createOscillator();
    const subGain = context.createGain();
    const level = intensity * randomBetween(0.92, 1.12);

    source.buffer = buffer;
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(
      preset.cutoff * randomBetween(0.92, 1.08),
      startAt
    );
    rumbleFilter.Q.setValueAtTime(preset.resonance, startAt);
    rumbleGain.gain.setValueAtTime(0.0001, startAt);
    rumbleGain.gain.linearRampToValueAtTime(
      preset.rumble * level,
      startAt + preset.attack
    );
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    source.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(thunderBus);

    if (preset.crack > 0) {
      const crackFilter = context.createBiquadFilter();
      const crackGain = context.createGain();
      crackFilter.type = 'bandpass';
      crackFilter.frequency.setValueAtTime(preset.crackFrequency, startAt);
      crackFilter.Q.setValueAtTime(0.6, startAt);
      crackGain.gain.setValueAtTime(0.0001, startAt);
      crackGain.gain.linearRampToValueAtTime(preset.crack * level, startAt + 0.025);
      crackGain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.42);
      source.connect(crackFilter);
      crackFilter.connect(crackGain);
      crackGain.connect(thunderBus);
    }

    subRumble.type = 'sine';
    subRumble.frequency.setValueAtTime(
      preset.subStart * randomBetween(0.94, 1.06),
      startAt
    );
    subRumble.frequency.exponentialRampToValueAtTime(
      preset.subEnd * randomBetween(0.94, 1.06),
      startAt + duration * 0.72
    );
    subGain.gain.setValueAtTime(0.0001, startAt);
    subGain.gain.linearRampToValueAtTime(preset.subLevel * level, startAt + 0.12);
    subGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    subRumble.connect(subGain);
    subGain.connect(thunderBus);

    source.start(startAt);
    source.stop(startAt + duration);
    subRumble.start(startAt);
    subRumble.stop(startAt + duration);
  }

  function scheduleThunderSequence() {
    if (!stormAudioContext || stormAudioContext.state !== 'running') return;

    const context = stormAudioContext;
    if (!thunderBus) thunderBus = createThunderBus(context);
    const startAt = context.currentTime;
    const intensity = 0.8 + clamp(lightningIntensity) * 0.2;
    const voices = [
      {
        delay: 0.5,
        duration: 3.5,
        cutoff: 260,
        resonance: 0.7,
        attack: 0.06,
        rumble: 0.56,
        crack: 0.2,
        crackFrequency: 900,
        subStart: 48,
        subEnd: 27,
        subLevel: 0.24
      },
      {
        delay: 3,
        duration: 4,
        cutoff: 360,
        resonance: 0.55,
        attack: 0.28,
        rumble: 0.46,
        crack: 0.06,
        crackFrequency: 560,
        subStart: 58,
        subEnd: 32,
        subLevel: 0.2
      },
      {
        delay: 5,
        duration: 3.2,
        cutoff: 190,
        resonance: 0.8,
        attack: 0.48,
        rumble: 0.52,
        crack: 0.025,
        crackFrequency: 420,
        subStart: 36,
        subEnd: 21,
        subLevel: 0.28
      }
    ];

    voices.forEach(voice => {
      scheduleThunderVoice(context, startAt + voice.delay, voice, intensity);
    });
  }

  function stopStormAudio() {
    if (stormAudioContext) {
      const context = stormAudioContext;
      stormAudioContext = null;
      windSource = null;
      windFilter = null;
      windGain = null;
      thunderBus = null;
      void context.close().catch(error => {
        console.error('Storm audio could not be closed cleanly.', error);
      });
    }
  }

  function removeAudioUnlockListeners() {
    window.removeEventListener('pointerdown', unlockStormAudio);
    window.removeEventListener('keydown', unlockStormAudio);
    window.removeEventListener('wheel', unlockStormAudio);
  }

  function installAudioUnlockListeners() {
    if (reducedMotion.matches || stormAudioContext) return;
    if (typeof AudioContextConstructor !== 'function') {
      console.error('Automatic storm audio is unavailable because Web Audio is not supported.');
      return;
    }

    window.addEventListener('pointerdown', unlockStormAudio);
    window.addEventListener('keydown', unlockStormAudio);
    window.addEventListener('wheel', unlockStormAudio, { passive: true });
  }

  async function unlockStormAudio() {
    if (reducedMotion.matches || stormAudioContext || audioUnlocking) return;

    let context;
    audioUnlocking = true;
    try {
      context = new AudioContextConstructor();
      await context.resume();
      if (context.state !== 'running') {
        throw new Error('The audio context did not enter the running state.');
      }

      stormAudioContext = context;
      thunderBus = createThunderBus(context);
      startWindAudio();
      updateWindAudio();
      removeAudioUnlockListeners();
    } catch (error) {
      if (context) {
        void context.close().catch(closeError => {
          console.error('Storm audio context could not be closed after activation failed.', closeError);
        });
      }
      stormAudioContext = null;
      windSource = null;
      windFilter = null;
      windGain = null;
      thunderBus = null;
      console.error('Automatic storm audio could not be enabled.', error);
    } finally {
      audioUnlocking = false;
    }
  }

  function updateLightning(timestamp) {
    if (lightningIntensity <= 0 || reducedMotion.matches) {
      nextLightningAt = 0;
      lightningStartedAt = -Infinity;
      lightningFlash.style.opacity = '0';
      document.body.style.setProperty('--cloud-flash', '0');
      return;
    }

    if (!nextLightningAt) {
      nextLightningAt = timestamp + randomBetween(1400, 3200);
    } else if (timestamp >= nextLightningAt) {
      lightningStartedAt = timestamp;
      lightningPeak = 0.78 + lightningIntensity * 0.18;
      scheduleThunderSequence();
      nextLightningAt = timestamp + randomBetween(10500, 16000);
      drawLightningBolt();
    }

    const elapsed = timestamp - lightningStartedAt;
    let flashOpacity = 0;
    if (elapsed >= 0 && elapsed < 35) {
      flashOpacity = lightningPeak * (elapsed / 35);
    } else if (elapsed < 90) {
      flashOpacity = lightningPeak * (1 - (elapsed - 35) / 55) * 0.82;
    } else if (elapsed >= 105 && elapsed < 130) {
      flashOpacity = lightningPeak * 0.58 * ((elapsed - 105) / 25);
    } else if (elapsed >= 130 && elapsed < 215) {
      flashOpacity = lightningPeak * 0.58 * (1 - (elapsed - 130) / 85);
    }
    lightningFlash.style.opacity = String(clamp(flashOpacity));
    document.body.style.setProperty('--cloud-flash', String(flashOpacity * 0.55));

  }

  function stopRainAnimation() {
    if (rainFrameId) {
      cancelAnimationFrame(rainFrameId);
      rainFrameId = 0;
    }
    lastRainFrame = 0;
    rainContext.clearRect(0, 0, viewportWidth, viewportHeight);
    lightningFlash.style.opacity = '0';
    document.body.style.setProperty('--cloud-flash', '0');
  }

  function drawRain(timestamp) {
    rainFrameId = 0;
    if (document.hidden || reducedMotion.matches || rainIntensity <= 0) {
      stopRainAnimation();
      return;
    }

    updateCloudLayerPosition();
    if (!lastRainFrame) {
      rainDrops.forEach(drop => {
        drop.y = makeRainOrigin(drop.x);
      });
    }

    const delta = lastRainFrame ? Math.min((timestamp - lastRainFrame) / 1000, 0.05) : 0;
    lastRainFrame = timestamp;
    rainContext.clearRect(0, 0, viewportWidth, viewportHeight);
    rainContext.beginPath();

    const visibleDropCount = Math.round(rainDrops.length * Math.pow(rainIntensity, 0.58));
    const windSpeed = 70 + rainIntensity * 260;
    const rainSpeedScale = 0.8 + rainIntensity * 0.8;
    const dropLengthScale = 0.85 + rainIntensity * 0.9;
    for (let index = 0; index < visibleDropCount; index += 1) {
      const drop = rainDrops[index];
      drop.x += windSpeed * delta;
      drop.y += drop.speed * rainSpeedScale * delta;

      if (drop.y > viewportHeight + 20 || drop.x > viewportWidth + 20) {
        drop.x = randomBetween(-20, viewportWidth);
        drop.y = makeRainOrigin(drop.x);
      }

      rainContext.moveTo(drop.x, drop.y);
      const verticalSpeed = drop.speed * rainSpeedScale;
      rainContext.lineTo(
        drop.x + windSpeed / verticalSpeed * drop.length * dropLengthScale,
        drop.y + drop.length * dropLengthScale
      );
    }
    rainContext.strokeStyle = `rgba(157, 177, 190, ${0.18 + rainIntensity * 0.25})`;
    rainContext.lineWidth = 0.65 + rainIntensity * 0.45;
    rainContext.stroke();

    updateLightning(timestamp);
    rainFrameId = requestAnimationFrame(drawRain);
  }

  function updateStorm() {
    progressFrameId = 0;
    const scrollableDistance = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    scrollProgress = clamp(window.scrollY / scrollableDistance);

    updateCloudLayerPosition();
    const stormStrength = clamp((scrollProgress - 0.15) / 0.75);
    rainIntensity = clamp((scrollProgress - rainStart) / (0.9 - rainStart));
    lightningIntensity = clamp((scrollProgress - lightningStart) / (1 - lightningStart));
    stormTint.style.opacity = String(stormStrength * 0.52);
    rainCanvas.style.opacity = String(rainIntensity);
    document.body.classList.toggle('storm-deep', stormStrength >= 0.58);
    updateWindAudio();

    if (rainIntensity > 0 && !reducedMotion.matches && !document.hidden && !rainFrameId) {
      rainFrameId = requestAnimationFrame(drawRain);
    } else if (rainIntensity <= 0 || reducedMotion.matches || document.hidden) {
      stopRainAnimation();
      nextLightningAt = 0;
      lightningStartedAt = -Infinity;
      if (reducedMotion.matches && stormAudioContext) {
        stopStormAudio();
      }
    }
  }

  function queueStormUpdate() {
    if (document.hidden) {
      if (progressFrameId) {
        cancelAnimationFrame(progressFrameId);
      }
      updateStorm();
      return;
    }

    if (!progressFrameId) {
      progressFrameId = requestAnimationFrame(updateStorm);
    }
  }

  window.addEventListener('scroll', queueStormUpdate, { passive: true });
  window.addEventListener('resize', () => {
    resizeRainCanvas();
    queueStormUpdate();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopRainAnimation();
      stopStormAudio();
    } else {
      installAudioUnlockListeners();
      queueStormUpdate();
    }
  });
  window.addEventListener('pagehide', stopStormAudio);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      removeAudioUnlockListeners();
      stopStormAudio();
    } else {
      installAudioUnlockListeners();
    }
    updateStorm();
  });

  installAudioUnlockListeners();
  resizeRainCanvas();
  updateStorm();
})();