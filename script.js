function randomInSphere(count, radius) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function initStars() {
  const container = document.getElementById('stars-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 600;
  const starCount = isMobile ? 1500 : 5000;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(randomInSphere(starCount, 1.2), 3)
  );

  const stars = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0x58a6ff, // matches --accent-color
      size: 0.002,
      sizeAttenuation: true,
      transparent: true,
      depthWrite: false,
    })
  );
  stars.rotation.z = Math.PI / 4;
  scene.add(stars);

  // Always render at least one static frame so the starfield is visible
  // even when animation is skipped for reduced-motion users.
  renderer.render(scene, camera);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (prefersReducedMotion) renderer.render(scene, camera);
  });

  if (prefersReducedMotion) return;

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    stars.rotation.x -= delta / 10;
    stars.rotation.y -= delta / 15;
    renderer.render(scene, camera);
  }

  animate();
}

initStars();

function initI18n() {
  const STORAGE_KEY = 'preferredLang';
  const toggleBtn = document.getElementById('lang-toggle');
  const translatable = document.querySelectorAll('[data-tr]');
  const titles = {
    en: 'Muhsin Rezai Shiraze — Portfolio',
    tr: 'Muhsin Rezai Shiraze — Portfolyo',
  };

  // Cache the original (English) text before any swapping happens.
  translatable.forEach((el) => {
    el.dataset.en = el.textContent;
  });

  function detectDefaultLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'tr') return stored;

    const browserLangs = navigator.languages || [navigator.language || ''];
    const isTurkish = browserLangs.some((l) => l.toLowerCase().startsWith('tr'));
    return isTurkish ? 'tr' : 'en';
  }

  function applyLang(lang) {
    translatable.forEach((el) => {
      el.textContent = lang === 'tr' ? el.dataset.tr : el.dataset.en;
    });
    document.documentElement.lang = lang;
    document.title = titles[lang] || titles.en;
    if (toggleBtn) toggleBtn.textContent = lang === 'tr' ? 'EN' : 'TR';
    localStorage.setItem(STORAGE_KEY, lang);
  }

  let currentLang = detectDefaultLang();
  applyLang(currentLang);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'tr' ? 'en' : 'tr';
      applyLang(currentLang);
    });
  }
}

initI18n();

function initClickImpact() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const SPARK_COUNT = 14;
  const CLICKABLE_SELECTOR = 'a, button';

  function spawnRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  function spawnSparks(x, y) {
    for (let i = 0; i < SPARK_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 90;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      const spark = document.createElement('div');
      spark.className = 'click-spark';
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty('--dx', `${dx}px`);
      spark.style.setProperty('--dy', `${dy}px`);
      spark.style.animationDelay = `${Math.random() * 0.05}s`;
      document.body.appendChild(spark);
      spark.addEventListener('animationend', () => spark.remove());
    }
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest(CLICKABLE_SELECTOR)) return;
    spawnRipple(e.clientX, e.clientY);
    spawnSparks(e.clientX, e.clientY);
  });
}

initClickImpact();
