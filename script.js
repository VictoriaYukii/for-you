/* =====================================================
   DATA FOTO
   Isi `src` dengan nama file foto kamu.
   Taruh file foto satu folder dengan index.html.

   Contoh:
     src: 'foto1.jpg'
     src: 'foto-berdua.png'
     src: 'https://link-foto-online.com/foto.jpg'

   Kalau src dikosongkan (""), akan muncul emoji placeholder.
====================================================== */
const photoDefs = [
  { src: 'assets/images/foto1.jpeg', label: 'Foto 1', bg: 'linear-gradient(135deg,#ffd6e7,#ffaac7)', emoji: '📸' },
  { src: 'assets/images/foto2.jpeg', label: 'Foto 2', bg: 'linear-gradient(135deg,#ffe0f0,#ffc2dc)', emoji: '🌸' },
  { src: 'assets/images/foto3.jpeg', label: 'Foto 3', bg: 'linear-gradient(135deg,#fff3cc,#ffe08a)', emoji: '☀️' },
  { src: 'assets/images/foto4.jpeg', label: 'Foto 4', bg: 'linear-gradient(135deg,#e0d6ff,#c4b3f7)', emoji: '🌙' },
  { src: 'assets/images/foto5.jpeg', label: 'Foto 5', bg: 'linear-gradient(135deg,#d6f0ff,#a8dcf7)', emoji: '💫' },
  { src: 'assets/images/foto6.jpeg', label: 'Foto 6', bg: 'linear-gradient(135deg,#ffd6d6,#ffb0b0)', emoji: '🌺' },
];

/* =====================================================
   UKURAN KARTU FOTO
   Harus sama dengan width & height di .photo-card di style.css
====================================================== */
const CARD_W = 120;
const CARD_H = 76;

/* =====================================================
   ORBIT CONFIG
   cx, cy  = titik tengah scene (sesuai orbit-scene di CSS: 400x360)
   rx      = jari-jari horizontal elips
   ry      = jari-jari vertikal elips (lebih kecil = makin pipih)
   SPEED   = kecepatan orbit (derajat/frame, lebih kecil = lebih lambat)
====================================================== */
const cx    = 200;
const cy    = 180;
const rx    = 162;
const ry    = 60;
const SPEED = 0.22;

/* ====================================================
   JANGAN UBAH DI BAWAH INI
   (kecuali kamu mau custom lebih lanjut)
====================================================== */

const scene = document.getElementById('scene');
const heart = document.getElementById('mainHeart');

// --- Buat photo cards ---
const cards = photoDefs.map((p) => {
  const card = document.createElement('div');
  card.className = 'photo-card';

  if (p.src) {
    card.style.background = '#000';
    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.label;
    card.appendChild(img);
  } else {
    card.style.background = p.bg;
    card.innerHTML = `
      <span class="emoji-placeholder">${p.emoji}</span>
      <span class="photo-label">${p.label}</span>
    `;
  }

  scene.insertBefore(card, heart);
  return card;
});

// --- Wave bars musik ---
const waveBarsEl = document.getElementById('waveBars');
for (let i = 0; i < 6; i++) {
  const b = document.createElement('div');
  b.className = 'wave-bar';
  b.style.cssText = `
    --wdur: ${0.55 + i * 0.1}s;
    --wdelay: ${i * 0.08}s;
    height: ${4 + Math.random() * 8}px;
  `;
  waveBarsEl.appendChild(b);
}

// --- Sparkles background ---
const sparklesEl = document.getElementById('sparkles');
['✨','💖','🌟','💕','⭐','💗','🌸','💫','🎀','🩷'].forEach((em) => {
  const sp = document.createElement('div');
  sp.className = 'sp';
  sp.textContent = em;
  sp.style.cssText = `
    left: ${5 + Math.random() * 90}%;
    top: ${5 + Math.random() * 88}%;
    --sdur: ${1.6 + Math.random() * 2}s;
    --sdelay: ${Math.random() * 2}s;
  `;
  sparklesEl.appendChild(sp);
});

// --- Particle spawner ---
const particlesEl = document.getElementById('particles');

function spawnParticle() {
  const p = document.createElement('div');
  p.textContent = ['❤️','💕','💗','💖'][Math.floor(Math.random() * 4)];
  p.className = 'particle';
  const dx = (Math.random() - 0.5) * 70;
  p.style.cssText = `
    left: ${10 + Math.random() * 80}%;
    bottom: ${10 + Math.random() * 30}%;
    --dx: ${dx}px;
    --pdur: ${2.2 + Math.random() * 1.8}s;
  `;
  particlesEl.appendChild(p);
  setTimeout(() => p.remove(), 4500);
}

setInterval(spawnParticle, 1000);

// --- Music player ---
// ganti fungsi togglePlay
function togglePlay() {
  playing = !playing;
  document.getElementById('playBtn').textContent = playing ? '⏸' : '▶';
  document.querySelectorAll('.wave-bar').forEach((b) => {
    b.style.animationPlayState = playing ? 'running' : 'paused';
  });
  if (playing) audioEl.play().catch(() => {});
  else audioEl.pause();
}

// tambahkan ini di bawah fungsi togglePlay
document.addEventListener('DOMContentLoaded', () => {
  audioEl.play()
    .then(() => {
      playing = true;
      document.getElementById('playBtn').textContent = '⏸';
      document.querySelectorAll('.wave-bar').forEach((b) => {
        b.style.animationPlayState = 'running';
      });
    })
    .catch(() => {
      // browser blokir autoplay sebelum user interaksi — fallback: play saat pertama klik
      document.addEventListener('click', () => {
        if (!playing) togglePlay();
      }, { once: true });
    });
});

// --- Klik hati = ledakan partikel ---
heart.addEventListener('click', () => {
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnParticle, i * 70);
  }
});

// --- Orbit engine ---
const n = photoDefs.length;
let angleDeg = 0;
heart.style.zIndex = '10';

function animate() {
  angleDeg += SPEED;
  const base = angleDeg * Math.PI / 180;

  cards.forEach((card, i) => {
    const theta = base + (i / n) * 2 * Math.PI;
    const x = cx + rx * Math.cos(theta);
    const y = cy + ry * Math.sin(theta);

    card.style.left = (x - CARD_W / 2) + 'px';
    card.style.top  = (y - CARD_H / 2) + 'px';

    const sinVal = Math.sin(theta);

    // scale: depan lebih besar, belakang lebih kecil
    const scale = 0.78 + 0.26 * ((sinVal + 1) / 2);
    card.style.transform = `scale(${scale.toFixed(3)})`;

    // z-index: depan (sin >= 0) di ATAS hati, belakang di BAWAH
    card.style.zIndex = sinVal >= 0 ? '15' : '5';

    // opacity: belakang sedikit lebih redup
    card.style.opacity = (0.55 + 0.45 * ((sinVal + 1) / 2)).toFixed(3);
  });

  requestAnimationFrame(animate);
}

animate();
