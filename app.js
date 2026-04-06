'use strict';

let selectedPhotoUrl = '';

async function searchCollegePhoto() {
  const query = document.getElementById('f-photo-search').value.trim();
  if (!query) return;

  const container = document.getElementById('photo-search-results');
  container.innerHTML = `<div style="grid-column:1/-1;text-align:center;font-family:'Cormorant Garamond',serif;font-size:0.9rem;color:#c9a84c;padding:10px">Searching…</div>`;
  container.classList.remove('hidden');

  try {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url|mime&format=json&origin=*&gsrlimit=12`;
    const res  = await fetch(apiUrl);
    const data = await res.json();
    const pages = data.query?.pages;
    container.innerHTML = '';

    if (!pages) { showSearchMsg(container, 'No results. Try a different search or paste a URL above.'); return; }

    let shown = 0;
    for (const page of Object.values(pages)) {
      if (shown >= 6) break;
      const info = page.imageinfo?.[0];
      if (!info || !['image/jpeg','image/png','image/webp'].includes(info.mime)) continue;
      const div = document.createElement('div');
      div.style.cssText = 'cursor:pointer;border:2px solid transparent;border-radius:3px;overflow:hidden;transition:border-color 0.2s;';
      div.innerHTML = `<img src="${info.url}" style="width:100%;height:54px;object-fit:cover" loading="lazy"/>`;
      div.addEventListener('click', () => selectPhoto(info.url, div));
      container.appendChild(div);
      shown++;
    }
    if (shown === 0) showSearchMsg(container, 'No image results found. Please paste a URL above.');
  } catch (err) {
    showSearchMsg(container, 'Search failed. Please paste an image URL directly.');
  }
}

function showSearchMsg(container, msg) {
  container.innerHTML = `<div style="grid-column:1/-1;text-align:center;font-family:'Cormorant Garamond',serif;font-size:0.85rem;color:rgba(201,168,76,0.5);padding:10px">${msg}</div>`;
}

function selectPhoto(url, el) {
  selectedPhotoUrl = url;
  document.getElementById('f-photo-url').value = url;
  document.querySelectorAll('#photo-search-results > div').forEach(d => d.style.borderColor = 'transparent');
  el.style.borderColor = '#c9a84c';
  const prev = document.getElementById('selected-photo-preview');
  const img  = document.getElementById('selected-photo-img');
  img.src = url;
  prev.classList.remove('hidden');
}

function generateCover() {
  const college = document.getElementById('f-college').value.trim();
  const name    = document.getElementById('f-name').value.trim();
  const errEl   = document.getElementById('error-msg');

  if (!college) { showError(errEl, 'College / University name is required.'); return; }
  if (!name)    { showError(errEl, 'Student name is required.'); return; }
  errEl.classList.add('hidden');

  const dept     = document.getElementById('f-dept').value.trim();
  const roll     = document.getElementById('f-roll').value.trim();
  const reg      = document.getElementById('f-reg').value.trim();
  const div      = document.getElementById('f-div').value.trim();
  const sec      = document.getElementById('f-sec').value.trim();
  const year     = document.getElementById('f-year').value.trim();
  const subject  = document.getElementById('f-subject').value.trim();
  const title    = document.getElementById('f-title').value.trim();
  const session  = document.getElementById('f-session').value.trim();
  const photoUrl = document.getElementById('f-photo-url').value.trim() || selectedPhotoUrl;

  document.getElementById('cv-college').textContent  = college;
  document.getElementById('cv-dept-top').textContent = dept || '';
  document.getElementById('cv-subject').textContent  = subject || 'Project File';

  if (title) {
    document.getElementById('cv-title').textContent           = title;
    document.getElementById('cv-title-row').style.display = 'block';
  } else {
    document.getElementById('cv-title-row').style.display = 'none';
  }

  document.getElementById('cv-session').textContent = session ? `Academic Session : ${session}` : '';

  const photoEl     = document.getElementById('cv-photo');
  const placeholder = document.getElementById('cv-photo-placeholder');
  if (photoUrl) {
    photoEl.src = photoUrl;
    photoEl.style.display     = 'block';
    placeholder.style.display = 'none';
    photoEl.onerror = () => { photoEl.style.display='none'; placeholder.style.display='flex'; };
  } else {
    photoEl.style.display     = 'none';
    placeholder.style.display = 'flex';
  }

  const rows = [{ label: 'Name', value: name }];
  if (roll)       rows.push({ label: 'Roll No.',           value: roll });
  if (reg)        rows.push({ label: 'Reg. No.',           value: reg });
  if (dept)       rows.push({ label: 'Department',         value: dept });
  if (div || sec) rows.push({ label: 'Division / Section', value: [div,sec].filter(Boolean).join(' / ') });
  if (year)       rows.push({ label: 'Year of Study',      value: year });

  document.getElementById('cv-details-body').innerHTML = rows.map(r => `
    <tr>
      <td style="padding:4px 10px 4px 0;font-family:'Cormorant Garamond',Georgia,serif;font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;color:#8b7355;white-space:nowrap;vertical-align:top">${r.label}</td>
      <td style="padding:4px 0 4px 4px;font-family:'EB Garamond',Georgia,serif;font-size:0.98rem;color:#1a1a2e;vertical-align:top">:&nbsp;&nbsp;${escapeHtml(r.value)}</td>
    </tr>`).join('');

  const previewSection = document.getElementById('preview-section');
  previewSection.classList.add('visible');
  requestAnimationFrame(scaleCoverPreview);
  previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(el, msg) { el.textContent = msg; el.classList.remove('hidden'); }
function escapeHtml(str) { return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function scaleCoverPreview() {
  const outer   = document.getElementById('cover-scale-outer');
  const wrapper = document.getElementById('cover-page-wrapper');
  const availW  = outer.clientWidth - 32;
  const scale   = Math.min(1, availW / 794);
  wrapper.style.transform       = `scale(${scale})`;
  wrapper.style.transformOrigin = 'top center';
  const coverH = document.getElementById('cover-page').offsetHeight || 1123;
  outer.style.height = (coverH * scale + 24) + 'px';
}
window.addEventListener('resize', scaleCoverPreview);

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const cover = document.getElementById('cover-page');
  const canvas = await html2canvas(cover, { scale:2.5, useCORS:true, allowTaint:true, backgroundColor:'#f5f0e8' });
  const imgData = canvas.toDataURL('image/jpeg', 0.96);
  const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  pdf.save(`${sanitize(document.getElementById('f-name').value.trim() || 'cover')}_cover_page.pdf`);
}

async function downloadPNG() {
  const cover = document.getElementById('cover-page');
  const canvas = await html2canvas(cover, { scale:3, useCORS:true, allowTaint:true, backgroundColor:'#f5f0e8' });
  const link = document.createElement('a');
  link.download = `${sanitize(document.getElementById('f-name').value.trim() || 'cover')}_cover_page.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function sanitize(str) { return str.replace(/[^a-z0-9_\-]/gi,'_').replace(/_+/g,'_'); }

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('f-photo-search').addEventListener('keydown', e => { if(e.key==='Enter') searchCollegePhoto(); });
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('keydown', e => { if(e.key==='Enter' && input.tagName==='INPUT') generateCover(); });
  });
});
