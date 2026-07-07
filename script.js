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
heart.style.zIndex = '999';

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
const audioEl = document.getElementById('audioEl');
let playing = false;

function togglePlay() {
  playing = !playing;
  document.getElementById('playBtn').textContent = playing ? '⏸' : '▶';
  document.querySelectorAll('.wave-bar').forEach((b) => {
    b.style.animationPlayState = playing ? 'running' : 'paused';
  });
  if (playing) audioEl.play().catch(() => {});
  else audioEl.pause();
}

// expose the toggle for inline onclick in module mode
window.togglePlay = togglePlay;

// --- Klik hati = ledakan partikel ---
heart.addEventListener('click', () => {
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnParticle, i * 70);
  }
});


/* =====================================================
   APP: Navigation, Gallery, Modal, Diary storage
===================================================== */

// Simple SPA navigation
const topnav = document.querySelector('.topnav');
const navLinks = Array.from(document.querySelectorAll('.topnav .navlink'));
const navIndicator = document.querySelector('.topnav .nav-indicator');

function updateNavIndicator(link) {
  if (!navIndicator || !link) return;
  const rect = link.getBoundingClientRect();
  const parentRect = link.parentElement.getBoundingClientRect();
  navIndicator.style.width = `${rect.width + 6}px`;
  navIndicator.style.transform = `translate(${rect.left - parentRect.left - 3}px, -50%)`;
}

navLinks.forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(n => n.classList.remove('active'));
    a.classList.add('active');
    const target = a.dataset.target;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(target);
    if (el) el.classList.add('active');
    if (target === 'memories') renderEntries();
    updateNavIndicator(a);
    if (topnav) {
      // no temporary animation on nav click
    }
  });
});

window.addEventListener('load', () => {
  const activeLink = navLinks.find((link) => link.classList.contains('active')) || navLinks[0];
  updateNavIndicator(activeLink);
});

window.addEventListener('resize', () => {
  const activeLink = navLinks.find((link) => link.classList.contains('active'));
  updateNavIndicator(activeLink);
});

// Build gallery grid from saved entries and fallback photos
function buildGallery() {
  buildGalleryFromEntries(loadEntries());
}

// Modal viewer
const imgModal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
document.getElementById('modalClose').addEventListener('click', closeModal);
imgModal.addEventListener('click', (e) => { if (e.target === imgModal) closeModal(); });
function openModal(p) {
  modalImg.src = p.src || '';
  modalCaption.textContent = p.label || '';
  imgModal.setAttribute('aria-hidden', 'false');
}
function closeModal() { imgModal.setAttribute('aria-hidden', 'true'); modalImg.src = ''; }

/* Diary storage (localStorage)
  Entries: [{id,title,body,date,created,photos:[dataUrl,...]}]
*/
const STORAGE_KEY = 'diaryEntries_v1';
function loadEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch (e) { return []; }
}
function saveEntries(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

function renderEntries() {
  const list = loadEntries();
  const container = document.getElementById('entriesList');
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<div class="entry">Belum ada memory. Tulis sesuatu di Diary.</div>';
    return;
  }
  list.slice().reverse().forEach((e) => {
    const el = document.createElement('div'); el.className = 'entry';
    // List view: only title and date
    el.innerHTML = `
      <h3>${escapeHtml(e.title)}</h3>
      <div class="meta">${escapeHtml(e.date || e.created)}</div>
    `;
    // small photo count indicator (optional)
    if (Array.isArray(e.photos) && e.photos.length) {
      const cnt = document.createElement('div'); cnt.className = 'meta'; cnt.style.fontSize = '12px'; cnt.style.marginTop = '6px'; cnt.textContent = `${e.photos.length} foto`;
      el.appendChild(cnt);
    }
    el.addEventListener('click', () => openEntry(e));
    container.appendChild(el);
  });
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]; }); }

// Handle diary form (supports localStorage fallback or Firebase when configured)
document.getElementById('diaryForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  console.log('diary submit invoked', { firebaseEnabled: window._firebaseEnabled, currentUser: window._currentUser, ownerUID: window.FIREBASE_OWNER_UID });
  const title = document.getElementById('entryTitle').value.trim();
  const body = document.getElementById('entryBody').value.trim();
  const dateVal = document.getElementById('entryDate').value;
  if (!title || !body) return alert('Masukkan judul dan isi diary.');
  const files = Array.from(document.getElementById('entryPhotos').files || []);
  // If Firebase not enabled, require local owner sign-in before allowing post
  if (!window._firebaseEnabled) {
    if (!window._localOwner) { alert('Hanya owner dapat memposting. Silakan sign in.'); return; }
  }

  // If Firebase is enabled and user is owner, upload to Storage + Firestore
  if (window._firebaseEnabled && window._currentUser && window.FIREBASE_OWNER_UID && window._currentUser.uid === window.FIREBASE_OWNER_UID) {
    console.log('Submitting via Firebase for owner', window._currentUser.uid);
    try {
      // upload files to storage
      const photoUrls = [];
      for (const f of files) {
        const fname = `${Date.now()}_${f.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
        const sref = window._storageRefFunc(`entries/${window._currentUser.uid}/${fname}`);
        await window._uploadBytesFunc(sref, f);
        const url = await window._getDownloadURLFunc(sref);
        photoUrls.push(url);
      }
      // save document
      await window._addDocFunc(window._collectionFunc(window._db, 'entries'), { title, body, date: dateVal, photos: photoUrls, ownerUid: window._currentUser.uid, created: Date.now() });
      document.getElementById('diaryForm').reset();
      photoPreviewEl.innerHTML = '';
      fileNamesEl.textContent = 'Belum ada foto';
      alert('Tersimpan ke server!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan ke server. Lihat console. ' + (err && err.message ? err.message : ''));
    }
    return;
  }

  console.log('Using local fallback save (Firebase not used or not owner)');
  // Fallback: localStorage (same as before)
  const readFile = (f) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(f);
  });
  Promise.all(files.map(readFile)).then((dataUrls) => {
    const entries = loadEntries();
    entries.push({ id: Date.now(), title, body, date: dateVal, created: new Date().toLocaleString(), photos: dataUrls });
    saveEntries(entries);
    document.getElementById('diaryForm').reset();
    buildGalleryFromEntries(entries);
    renderEntries();
    buildLandingFloat(entries);
    alert('Tersimpan (lokal)!');
  }).catch(() => { alert('Gagal membaca file.'); });
});

/* Entry viewer modal */
(function(){
  const modal = document.createElement('div'); modal.className = 'entry-modal'; modal.id = 'entryModal'; modal.setAttribute('aria-hidden','true');
  modal.innerHTML = `
    <div class="content">
      <button class="close-btn" id="entryClose">✕</button>
      <h2 id="entryTitleView"></h2>
      <div class="meta" id="entryDateView"></div>
      <img id="entryMainPhoto" src="" alt="" style="display:none;" />
      <div class="body" id="entryBodyView"></div>
      <div class="entry-images" id="entryPhotosView"></div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e)=>{ if (e.target===modal) closeEntry(); });
  document.getElementById('entryClose').addEventListener('click', closeEntry);
  window.openEntry = function(e){
    const m = document.getElementById('entryModal');
    document.getElementById('entryTitleView').textContent = e.title || '';
    document.getElementById('entryDateView').textContent = e.date || e.created || '';
    document.getElementById('entryBodyView').innerHTML = escapeHtml(e.body).replace(/\n/g,'<br/>');
    const photosEl = document.getElementById('entryPhotosView'); photosEl.innerHTML = '';
    const mainPhotoEl = document.getElementById('entryMainPhoto');
    if (Array.isArray(e.photos) && e.photos.length) {
      // show first photo large
      mainPhotoEl.src = e.photos[0];
      mainPhotoEl.style.display = '';
      // other photos as thumbnails (excluding first)
      e.photos.slice(1).forEach(durl => {
        const im = document.createElement('img'); im.className = 'entry-thumb'; im.src = durl; im.addEventListener('click', () => openModal({src:durl,label:e.title}));
        photosEl.appendChild(im);
      });
    } else {
      mainPhotoEl.src = '';
      mainPhotoEl.style.display = 'none';
    }
    m.setAttribute('aria-hidden','false');
  };
  function closeEntry(){ document.getElementById('entryModal').setAttribute('aria-hidden','true'); }
})();

// initialize
buildGalleryFromEntries(loadEntries());
renderEntries();
buildLandingFloat(loadEntries());

// File input preview and label update for diary form
const entryPhotosInput = document.getElementById('entryPhotos');
const fileNamesEl = document.querySelector('.file-names');
const photoPreviewEl = document.getElementById('photoPreview');
if (entryPhotosInput) {
  entryPhotosInput.addEventListener('change', (ev) => {
    const files = Array.from(ev.target.files || []);
    if (!files.length) {
      fileNamesEl.textContent = 'Belum ada foto';
      photoPreviewEl.setAttribute('aria-hidden','true');
      photoPreviewEl.innerHTML = '';
      return;
    }
    fileNamesEl.textContent = `${files.length} foto dipilih`;
    photoPreviewEl.setAttribute('aria-hidden','false');
    photoPreviewEl.innerHTML = '';
    files.slice(0,6).forEach((f) => {
      const r = new FileReader();
      r.onload = () => {
        const im = document.createElement('img'); im.className = 'preview-thumb'; im.src = r.result;
        photoPreviewEl.appendChild(im);
      };
      r.readAsDataURL(f);
    });
  });
}

// ---------------------
// Firebase integration (optional)
// Requires user to fill window.FIREBASE_CONFIG and window.FIREBASE_OWNER_UID in firebase-config.js
// ---------------------
let remoteEntries = [];

async function initFirebase() {
  if (!window.FIREBASE_CONFIG) return;
  try {
    const [{ initializeApp }, { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }, { getFirestore, collection, addDoc, query, orderBy, onSnapshot }, { getStorage, ref, uploadBytes, getDownloadURL }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'),
      import('https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js')
    ]);

    const app = initializeApp(window.FIREBASE_CONFIG);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    // expose helpers for submit handler
    window._firebaseEnabled = true;
    window._auth = auth;
    window._db = db;
    window._storage = storage;
    window._collectionFunc = collection;
    window._addDocFunc = addDoc;
    window._queryFunc = query;
    window._orderByFunc = orderBy;
    window._onSnapshotFunc = onSnapshot;
    window._storageRefFunc = (path) => ref(storage, path);
    window._uploadBytesFunc = uploadBytes;
    window._getDownloadURLFunc = getDownloadURL;

    const signInBtn = document.getElementById('signInBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const userHint = document.getElementById('userHint');

    signInBtn.addEventListener('click', async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (e) {
        console.error('signin', e);
        const msg = (e && e.message) ? e.message : String(e);
        alert('Gagal sign in: ' + msg);
        if (userHint) userHint.textContent = 'Sign-in error: ' + msg;
      }
    });

    signOutBtn.addEventListener('click', async () => { await signOut(auth); });

    onAuthStateChanged(auth, (user) => {
      window._currentUser = user || null;
      const isOwner = user && window.FIREBASE_OWNER_UID && user.uid === window.FIREBASE_OWNER_UID;
      if (user) {
        signInBtn.style.display = 'none';
        signOutBtn.style.display = '';
        userHint.textContent = isOwner ? '(owner)' : `(signed: ${user.email || user.uid})`;
      } else {
        signInBtn.style.display = '';
        signOutBtn.style.display = 'none';
        userHint.textContent = '';
      }
      // show/hide diary form (only owner can post)
      const diaryForm = document.getElementById('diaryForm');
      const diarySection = document.getElementById('diary');
      if (!diaryForm) return;
      if (isOwner) {
        diaryForm.style.display = '';
      } else {
        diaryForm.style.display = 'none';
        // show message and hint to sign-in if user not owner
        if (!diarySection.querySelector('.owner-note')) {
          const note = document.createElement('div'); note.className = 'owner-note'; note.style.color = '#b15a7a'; note.style.textAlign = 'center'; note.style.marginTop = '12px';
          note.textContent = 'Hanya owner yang dapat menulis diary. Silakan sign in jika Anda owner.';
          diarySection.appendChild(note);
        }
      }
    });

    // listen to entries collection
    const q = window._queryFunc(window._collectionFunc(db, 'entries'), window._orderByFunc('created', 'desc'));
    window._onSnapshotFunc(q, (snap) => {
      try {
        console.log('Firestore onSnapshot received', { size: snap.size });
        remoteEntries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log('remoteEntries sample', remoteEntries.slice(0,5));
        renderEntriesRemote();
        buildGalleryFromEntries(remoteEntries);
        buildLandingFloat(remoteEntries);
      } catch (e) {
        console.error('Error processing onSnapshot', e);
      }
    });
  } catch (err) {
    console.error('Firebase init error', err);
  }
}

function renderEntriesRemote() {
  const list = remoteEntries || [];
  const container = document.getElementById('entriesList');
  container.innerHTML = '';
  if (!list.length) { container.innerHTML = '<div class="entry">Belum ada memory.</div>'; return; }
  list.forEach((e) => {
    const el = document.createElement('div'); el.className = 'entry';
    el.innerHTML = `<h3>${escapeHtml(e.title)}</h3><div class="meta">${escapeHtml(e.date || e.created)}</div>`;
    if (Array.isArray(e.photos) && e.photos.length) {
      const cnt = document.createElement('div'); cnt.className = 'meta'; cnt.style.fontSize = '12px'; cnt.style.marginTop = '6px'; cnt.textContent = `${e.photos.length} foto`;
      el.appendChild(cnt);
    }
    el.addEventListener('click', () => openEntry(e));
    container.appendChild(el);
  });
}

function getGalleryPhotos(entries) {
  const photos = [];
  entries.forEach((e) => {
    if (Array.isArray(e.photos)) {
      e.photos.forEach((p) => photos.push({ src: p, label: e.title }));
    }
  });
  photos.push(...photoDefs);
  return photos;
}

function buildGalleryFromEntries(entries) {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';
  const photos = getGalleryPhotos(entries);
  photos.slice(0, 24).forEach((p) => {
    const card = document.createElement('div'); card.className = 'thumb-card';
    const img = document.createElement('img'); img.src = p.src || ''; img.alt = p.label || '';
    card.appendChild(img);
    const cap = document.createElement('div'); cap.className = 'thumb-caption'; cap.textContent = p.label || '';
    card.appendChild(cap);
    card.addEventListener('click', () => openModal(p));
    grid.appendChild(card);
  });
}

function buildLandingFloat(entries) {
  const container = document.getElementById('landingFloat');
  if (!container) return;
  container.innerHTML = '';
  const photos = getGalleryPhotos(entries);
  if (!photos.length) return;
  photos.slice(0, 12).forEach((p, idx) => {
    const img = document.createElement('img');
    img.className = 'floating-photo';
    img.src = p.src || '';
    img.alt = p.label || '';
    const x = Math.random() * 60 + 20;
    const y = Math.random() * 60 + 20;
    const speed = 12 + Math.random() * 8;
    const deg = Math.random() * 360;
    img.style.left = `${x}%`;
    img.style.top = `${y}%`;
    img.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
    img.style.animation = `floatPhoto ${speed}s ease-in-out infinite`;
    img.style.animationDelay = `${Math.random() * 3}s`;
    const xSign = x < 30 ? 1 : x > 70 ? -1 : (Math.random() < 0.5 ? -1 : 1);
    const ySign = y < 30 ? 1 : y > 70 ? -1 : (Math.random() < 0.5 ? -1 : 1);
    img.style.setProperty('--fx1', `${(Math.random() * 10 + 8) * xSign}px`);
    img.style.setProperty('--fy1', `${(Math.random() * 10 + 8) * ySign}px`);
    img.style.setProperty('--fx2', `${(Math.random() * 12 + 8) * xSign}px`);
    img.style.setProperty('--fy2', `${(Math.random() * 10 + 8) * ySign}px`);
    img.style.setProperty('--fx3', `${(Math.random() * 10 + 6) * xSign}px`);
    img.style.setProperty('--fy3', `${(Math.random() * 10 + 6) * ySign}px`);
    img.style.setProperty('--rot1', `${Math.random() * 24 - 12}deg`);
    img.style.setProperty('--rot2', `${Math.random() * 24 - 12}deg`);
    img.style.setProperty('--rot3', `${Math.random() * 24 - 12}deg`);
    container.appendChild(img);
  });
}

// start init
initFirebase();

// Local sign-in fallback when Firebase not configured
function initLocalAuthFallback() {
  const signInBtn = document.getElementById('signInBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const userHint = document.getElementById('userHint');
  const diaryForm = document.getElementById('diaryForm');
  const diarySection = document.getElementById('diary');

  // hide diary form by default unless owner
  if (diaryForm) diaryForm.style.display = 'none';

  if (!window.FIREBASE_CONFIG) {
    const localSignInForm = document.getElementById('localSignInForm');
    const localPassInput = document.getElementById('localPassInput');
    const localPassSubmit = document.getElementById('localPassSubmit');
    signInBtn.addEventListener('click', () => {
      localSignInForm.style.display = localSignInForm.style.display === 'none' ? 'flex' : 'none';
      localPassInput.focus();
    });
    localPassSubmit.addEventListener('click', () => {
      const pass = localPassInput.value.trim();
      if (!pass) return;
      if (window.LOCAL_OWNER_PASS && pass === window.LOCAL_OWNER_PASS) {
        window._localOwner = true;
        signInBtn.style.display = 'none';
        signOutBtn.style.display = '';
        userHint.textContent = '(owner local)';
        if (diaryForm) diaryForm.style.display = '';
        const note = diarySection.querySelector('.owner-note'); if (note) note.remove();
        localSignInForm.style.display = 'none';
      } else {
        alert('Passphrase salah.');
      }
    });

    signOutBtn.addEventListener('click', () => {
      window._localOwner = false;
      signInBtn.style.display = '';
      signOutBtn.style.display = 'none';
      userHint.textContent = '';
      if (diaryForm) diaryForm.style.display = 'none';
    });
  }
}

initLocalAuthFallback();

