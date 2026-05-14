/* =========================================================
   DHWANIT PANCHAL — Portfolio Script
   ========================================================= */

/* ---------- 1. LOADER ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
  }, 800);
});

/* ---------- 2. CUSTOM CURSOR ---------- */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

window.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursorDot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
});

function animateRing() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  cursorRing.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .skill-card, .project-card, .service-card, .highlight-card, input, textarea')
  .forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });

/* ---------- 3. NAVBAR SCROLL & MOBILE MENU ---------- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ---------- 4. SCROLL REVEAL ---------- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ---------- 5. ANIMATED COUNTERS ---------- */
const counters = document.querySelectorAll('.counter');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const start = performance.now();
      const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target) + (target === 100 ? '' : '+');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + (target === 100 ? '' : '+');
      };
      requestAnimationFrame(step);
      countObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => countObs.observe(c));

/* ---------- 6. MAGNETIC BUTTONS ---------- */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ---------- 7. VANILLA TILT (3D card hover) ---------- */
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max: 12,
    speed: 500,
    glare: true,
    'max-glare': 0.2,
    perspective: 1000
  });
}

/* ---------- 8. CONTACT FORM ---------- */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', e => {
  e.preventDefault();
  status.textContent = '✓ Message sent! I will get back to you soon.';
  status.style.color = '#22d3ee';
  form.reset();
  setTimeout(() => (status.textContent = ''), 5000);
});

/* =========================================================
   9. THREE.JS — HERO PARTICLE FIELD
   ========================================================= */
(function heroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const particleCount = 900;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i*3]     = (Math.random() - 0.5) * 14;
    positions[i*3 + 1] = (Math.random() - 0.5) * 14;
    positions[i*3 + 2] = (Math.random() - 0.5) * 14;

    const c = new THREE.Color();
    c.setHSL(0.5 + Math.random() * 0.3, 1, 0.6);
    colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Floating rings / cubes
  const objects = [];
  for (let i = 0; i < 5; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.5 + Math.random() * 0.4, 0.04, 16, 60),
      new THREE.MeshBasicMaterial({
        color: i % 2 ? 0x00f5ff : 0x8b5cf6,
        transparent: true,
        opacity: 0.4,
        wireframe: false
      })
    );
    ring.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*6, (Math.random()-0.5)*4);
    ring.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    scene.add(ring);
    objects.push(ring);
  }

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.0008;
    points.rotation.x += 0.0004;

    objects.forEach((o, i) => {
      o.rotation.x += 0.005 + i*0.001;
      o.rotation.y += 0.006;
    });

    camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* =========================================================
   10. THREE.JS — INTERACTIVE 3D OBJECT (AI ORB)
   ========================================================= */
(function objScene() {
  const canvas = document.getElementById('objCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const pl1 = new THREE.PointLight(0x00f5ff, 2, 10); pl1.position.set(3, 2, 3); scene.add(pl1);
  const pl2 = new THREE.PointLight(0x8b5cf6, 2, 10); pl2.position.set(-3, -2, 2); scene.add(pl2);

  // Wireframe icosahedron (futuristic orb)
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x0a0d1a,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00f5ff,
      emissiveIntensity: 0.3
    })
  );
  scene.add(core);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.25, 1),
    new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.5 })
  );
  scene.add(wire);

  const outer = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.02, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6 })
  );
  outer.rotation.x = Math.PI / 2;
  scene.add(outer);

  const outer2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.1, 0.015, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.6 })
  );
  outer2.rotation.x = Math.PI / 3;
  scene.add(outer2);

  // Mouse interaction
  let tX = 0, tY = 0;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    tX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    tY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  function loop() {
    requestAnimationFrame(loop);
    core.rotation.x += 0.004;
    core.rotation.y += 0.006;
    wire.rotation.x -= 0.003;
    wire.rotation.y -= 0.005;
    outer.rotation.z += 0.005;
    outer2.rotation.z -= 0.004;

    scene.rotation.y += (tX * 0.5 - scene.rotation.y) * 0.05;
    scene.rotation.x += (tY * 0.5 - scene.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }
  loop();
})();

/* ---------- 11. GSAP HERO INTRO ---------- */
if (typeof gsap !== 'undefined') {
  gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 1, delay: 1 });
  gsap.from('.hero-title', { y: 50, opacity: 0, duration: 1.2, delay: 1.1 });
  gsap.from('.hero-tagline', { y: 30, opacity: 0, duration: 1, delay: 1.3 });
  gsap.from('.hero-sub', { y: 30, opacity: 0, duration: 1, delay: 1.4 });
  gsap.from('.hero-buttons', { y: 30, opacity: 0, duration: 1, delay: 1.5 });
  gsap.from('.scroll-indicator', { opacity: 0, duration: 1, delay: 2 });
} 
