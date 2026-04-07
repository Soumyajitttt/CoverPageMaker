/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const $  = id => document.getElementById(id);
const gv = id => ($(id) ? $(id).value.trim() : '');

let currentTheme = 'minimal';
let imgTimer     = null;
let lastCollege  = '';

/* ─────────────────────────────────────────
   LIVE UPDATE
───────────────────────────────────────── */
function liveUpdate() {
  const college = gv('f-college') || 'YOUR INSTITUTION NAME';
  const name    = gv('f-name')    || 'Student Name';
  const subj    = gv('f-subject');
  const dept    = gv('f-dept');
  const roll    = gv('f-roll');
  const reg     = gv('f-reg');
  const paper   = gv('f-paper');
  const divVal  = gv('f-div');
  const sec     = gv('f-sec');
  const year    = gv('f-year');
  const teacher = gv('f-teacher');
  const acad    = gv('f-acad');

  /* College header */
  $('p-college').textContent = college.toUpperCase();

  /* Subject */
  $('p-subj-label').textContent = subj ? 'PROJECT FILE —' : '';
  $('p-subj-title').textContent = subj ? subj.toUpperCase() : 'SUBJECT / PROJECT TITLE';

  /* Name (always visible) */
  $('p-name').textContent = name.toUpperCase();

  /* Optional fields */
  setRow('r-roll',    'p-roll',    roll.toUpperCase());
  setRow('r-reg',     'p-reg',     reg.toUpperCase());
  setRow('r-paper',   'p-paper',   paper.toUpperCase());
  setRow('r-dept',    'p-dept',    dept.toUpperCase());
  setRow('r-year',    'p-year',    year.toUpperCase());
  setRow('r-teacher', 'p-teacher', teacher.toUpperCase());
  setRow('r-acad',    'p-acad',    acad);

  const divSec = [divVal, sec].filter(Boolean).join(' / ');
  setRow('r-div', 'p-div', divSec.toUpperCase());

  /* Bottom bar */
  $('p-bl').textContent = (dept || college.split(' ').slice(0, 3).join(' ')).toUpperCase() || '—';
  $('p-br').textContent = (year || acad || '—').toUpperCase();

  /* Image: manual URL takes priority over auto-fetch */
  const manualUrl = gv('f-photourl');
  if (!manualUrl) {
    const c = gv('f-college');
    if (c.length > 3 && c !== lastCollege) {
      clearTimeout(imgTimer);
      imgTimer = setTimeout(() => fetchImg(c), 900);
    }
  }
}

/* ─────────────────────────────────────────
   ROW TOGGLE HELPER
───────────────────────────────────────── */
function setRow(rowId, valId, value) {
  const row = $(rowId);
  if (!row) return;
  if (value) {
    row.classList.add('visible');
    $(valId).textContent = value;
  } else {
    row.classList.remove('visible');
  }
}

/* ─────────────────────────────────────────
   THEME SWITCHER
───────────────────────────────────────── */
function setTheme(t) {
  currentTheme = t;
  $('coverPage').className = `t-${t}`;
  ['minimal', 'dark', 'classic'].forEach(x =>
    $('btn-' + x).classList.toggle('active', x === t)
  );
}

/* ─────────────────────────────────────────
   PHOTO URL — MANUAL INPUT
───────────────────────────────────────── */
let urlDebounce = null;

function onPhotoUrlInput() {
  liveUpdate();
  const url    = gv('f-photourl');
  const status = $('photoUrlStatus');

  if (!url) {
    status.textContent = '';
    status.style.color = 'rgba(255,255,255,.3)';
    // restore auto-fetch
    const c = gv('f-college');
    if (c.length > 3) {
      clearTimeout(imgTimer);
      imgTimer = setTimeout(() => fetchImg(c), 400);
    }
    return;
  }

  status.textContent = 'Loading…';
  status.style.color = '#c8ff00';
  clearTimeout(urlDebounce);

  urlDebounce = setTimeout(() => {
    const img  = $('collegeImg');
    const ph   = $('imgPlaceholder');
    const test = new Image();
    test.crossOrigin = 'anonymous';

    test.onload = () => {
      img.src = url;
      img.style.display = 'block';
      ph.style.display  = 'none';
      status.textContent = '✓ Photo loaded';
      status.style.color = '#c8ff00';
    };

    test.onerror = () => {
      status.textContent = '✕ Could not load — check the URL';
      status.style.color = '#ff6666';
    };

    test.src = url;
  }, 600);
}

function clearPhotoUrl() {
  $('f-photourl').value = '';
  $('photoUrlStatus').textContent = '';

  const img = $('collegeImg');
  const ph  = $('imgPlaceholder');
  img.style.display = 'none';
  img.src = '';
  ph.style.display  = 'flex';
  $('imgStatus').textContent = 'College photo will appear here';

  // trigger auto-fetch again
  const c = gv('f-college');
  if (c.length > 3) {
    lastCollege = '';
    fetchImg(c);
  }
}

/* ─────────────────────────────────────────
   AUTO IMAGE FETCH (Wikipedia → Unsplash)
───────────────────────────────────────── */
async function fetchImg(name) {
  lastCollege = name;
  $('imgStatus').textContent = 'Searching…';

  try {
    const q   = encodeURIComponent(name);
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${q}&prop=pageimages&format=json&pithumbsize=900&origin=*`
    );
    const d  = await res.json();
    const pg = Object.values(d?.query?.pages || {})[0];
    if (pg?.thumbnail?.source) {
      showImg(pg.thumbnail.source);
      return;
    }
  } catch (e) { /* fall through to Unsplash */ }

  /* Unsplash fallback */
  showImg(
    `https://source.unsplash.com/featured/900x506/?${encodeURIComponent(name + ' college')}`
  );
}

function showImg(src) {
  const img    = $('collegeImg');
  const ph     = $('imgPlaceholder');
  const newImg = new Image();
  newImg.crossOrigin = 'anonymous';

  newImg.onload = () => {
    img.src = src;
    img.style.display = 'block';
    ph.style.display  = 'none';
  };

  newImg.onerror = () => {
    $('imgStatus').textContent = 'Photo not found';
  };

  newImg.src = src;
}

/* ─────────────────────────────────────────
   EXPORT UTILITIES
───────────────────────────────────────── */
const showLoad = msg => {
  $('loadingText').textContent = msg;
  $('loadingOverlay').classList.add('on');
};

const hideLoad = () => $('loadingOverlay').classList.remove('on');

const wait = ms => new Promise(r => setTimeout(r, ms));

const safe = s =>
  s.replace(/[^a-zA-Z0-9_\- ]/g, '')
   .replace(/\s+/g, '_')
   .slice(0, 80);

/* ─── Download PDF ─── */
async function downloadPDF() {
  if (!gv('f-college') || !gv('f-name')) {
    alert('Please enter College Name and Student Name first.');
    return;
  }
  showLoad('Generating PDF…');
  await wait(80);
  try {
    const canvas = await html2canvas($('coverPage'), {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: null
    });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdf.addImage(canvas.toDataURL('image/jpeg', .95), 'JPEG', 0, 0, 210, 297);
    pdf.save(safe(`${gv('f-name')}_${gv('f-subject') || 'Cover'}`) + '.pdf');
  } catch (e) {
    console.error(e);
    alert('PDF export failed. Please try PNG.');
  } finally {
    hideLoad();
  }
}

/* ─── Download PNG ─── */
async function downloadPNG() {
  if (!gv('f-college') || !gv('f-name')) {
    alert('Please enter College Name and Student Name first.');
    return;
  }
  showLoad('Rendering PNG…');
  await wait(80);
  try {
    const canvas = await html2canvas($('coverPage'), {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: null
    });
    const a = document.createElement('a');
    a.download = safe(`${gv('f-name')}_${gv('f-subject') || 'Cover'}`) + '.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  } catch (e) {
    console.error(e);
    alert('PNG export failed. Please try again.');
  } finally {
    hideLoad();
  }
}