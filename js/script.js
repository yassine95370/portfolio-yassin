/* ===== Portfolio 2025 – Interactions (toutes pages) ===== */

// Thème (persistant)
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
const toggleBtn = document.getElementById('toggleTheme');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? '' : 'light';
    if (next) root.setAttribute('data-theme', next); else root.removeAttribute('data-theme');
    localStorage.setItem('theme', next);
  });
}

// Année footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Activer l’onglet courant
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.pills .chip').forEach(ch => {
  const href = ch.getAttribute('href');
  const isActive =
    (path === 'index.html' && href.includes('index')) ||
    (path === 'about.html'  && href.includes('about')) ||
    (path === 'skills.html' && href.includes('skills')) ||
    (path === 'projects.html' && href.includes('projects')) ||
    (path === 'contact.html' && href.includes('contact'));
  ch.setAttribute('aria-current', isActive ? 'page' : 'false');
});

// Reveal on load/scroll (léger)
const io = new IntersectionObserver((entries) => {
  entries.forEach((ent) => { if (ent.isIntersecting) ent.target.classList.add('in'); });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Bouton CV + overlay (si présent sur la page)
const btnCv = document.getElementById('btnCv');
const gate  = document.getElementById('gate');
if (btnCv && gate) {
  btnCv.addEventListener('click', () => {
    gate.style.display = 'grid';
    setTimeout(() => {
      gate.style.display = 'none';
      window.open('assets/cv-yassine.pdf', '_blank', 'noopener');
    }, 2300);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') gate.style.display = 'none'; });
}

// Actions Contact (si présent)
const copyBtns = document.querySelectorAll('[data-copy]');
copyBtns.forEach(btn => btn.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = 'Copié !'; setTimeout(()=>btn.textContent='Copier',1200); }
  catch { alert('Copie impossible'); }
}));

const btnVcf = document.getElementById('btnVcf');
if (btnVcf) {
  btnVcf.addEventListener('click', () => {
    const vcf = `BEGIN:VCARD
VERSION:3.0
N:Messaoudi;Yassine;;;
FN:Yassine Messaoudi
TITLE:Technicien Supérieur Systèmes & Réseaux (TSSR)
EMAIL;TYPE=INTERNET;TYPE=WORK:yassine370@laposte.net
TEL;TYPE=CELL:+33758505924
item1.URL:https://www.linkedin.com/in/helpdeskadminreseauxmaintenanceinformatiquedepannageinformatiqueyassine-messaoudi-244270173
item1.X-ABLabel:LinkedIn
END:VCARD`;
    const blob = new Blob([vcf], {type:'text/vcard'});
    const url  = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {href:url, download:'Yassine-Messaoudi.vcf'});
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });
}

const btnQr = document.getElementById('btnQr');
const qrWrap = document.getElementById('qrWrap');
const qrImg  = document.getElementById('qrImg');
if (btnQr && qrWrap && qrImg) {
  const linkedinUrl = 'https://www.linkedin.com/in/helpdeskadminreseauxmaintenanceinformatiquedepannageinformatiqueyassine-messaoudi-244270173';
  btnQr.addEventListener('click', () => {
    const src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(linkedinUrl)}`;
    qrImg.src = src; qrWrap.hidden = false; qrWrap.scrollIntoView({behavior:'smooth'});
  });
}

console.log('Portfolio 2025 multipage prêt ✅');
<script>
  // --- FIX: supprimer toute bannière/modal "Étude de cas" résiduelle ---
  (function () {
    const killers = [
      '#caseStudy',
      '.case-modal',
      '.study-banner',
      '[data-modal="case-study"]'
    ];
    killers.forEach(sel => document.querySelectorAll(sel).forEach(n => n.remove()));
  })();

  // --- Sécuriser le bouton CV : ouvre le bon fichier même si tes assets sont à la racine ---
  (function () {
    const btnCv = document.getElementById('btnCv');
    if (!btnCv) return;

    // Si ton CV est à la racine (cv-yassine.pdf) ou dans /assets/
    const candidates = ['assets/cv-yassine.pdf', 'cv-yassine.pdf'];
    btnCv.addEventListener('click', async () => {
      // Petit "gate" si tu l'utilises, sinon ouvre direct
      const openFirstOk = async () => {
        for (const url of candidates) {
          try {
            // Test rapide d'existence (ne bloque pas si fetch indisponible)
            const res = await fetch(url, { method: 'HEAD' });
            if (res.ok) { window.open(url, '_blank', 'noopener'); return; }
          } catch (_) { /* ignore */ }
        }
        // Si HEAD est bloqué en file://, ouvre l’option 1 quand même
        window.open(candidates[0], '_blank', 'noopener');
      };
      await openFirstOk();
    });

    // Fix image de profil si ton fichier n'est pas dans /assets/
    const avatarImg = document.querySelector('.avatar img');
    if (avatarImg) {
      const test = new Image();
      test.onload = () => { /* assets/yassine.jpg existe: ok */ };
      test.onerror = () => { avatarImg.src = 'yassine.jpg'; }; // fallback racine
      test.src = 'assets/yassine.jpg';
    }
  })();
</script>


