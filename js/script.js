/* ====== Portfolio 2025 – Interactions ====== */

// utilitaires
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

// année footer
$('#year').textContent = new Date().getFullYear();

// smooth scroll
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href'); const el = document.querySelector(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
  });
});

/* ====== Gate -> ouvre le CV ====== */
const btnCv = $('#btnCv');
const gate  = $('#gate');
if(btnCv){
  btnCv.addEventListener('click', ()=>{
    gate.hidden = false;
    setTimeout(()=>{ gate.hidden = true; window.open('assets/cv-yassine.pdf', '_blank', 'noopener'); }, 2300);
  });
}
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') gate.hidden=true; });

/* ====== Copy rapide ====== */
$$('[data-copy]').forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    try{ await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = 'Copié !'; setTimeout(()=>btn.textContent='Copier',1200); }
    catch{ alert('Copie impossible'); }
  });
});

/* ====== vCard ====== */
const btnVcf = $('#btnVcf');
if(btnVcf){
  btnVcf.addEventListener('click', ()=>{
    const vcf = `BEGIN:VCARD
VERSION:3.0
N:Messaoudi;Yassine;;;
FN:Yassine Messaoudi
TITLE:Technicien Supérieur Systèmes & Réseaux (TSSR)
EMAIL;TYPE=INTERNET;TYPE=WORK:yassine370@laposte.net
TEL;TYPE=CELL:+33758505924
item1.URL:www.linkedin.com/in/helpdeskadminreseauxmaintenanceinformatiquedepannageinformatiqueyassine-messaoudi-244270173
item1.X-ABLabel:LinkedIn
END:VCARD`;
    const blob = new Blob([vcf], {type:'text/vcard'});
    const url  = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {href:url, download:'Yassine-Messaoudi.vcf'});
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });
}

/* ====== QR code LinkedIn ====== */
const btnQr = $('#btnQr');
const qrWrap = $('#qrWrap');
const qrImg  = $('#qrImg');
const linkedinUrl = $('#lnkLinkedIn').href;
if(btnQr){
  btnQr.addEventListener('click', ()=>{
    const src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(linkedinUrl)}`;
    qrImg.src = src; qrWrap.hidden = false; qrWrap.scrollIntoView({behavior:'smooth'});
  });
}

/* ====== QuickPanel pour Dock ====== */
const qp = $('#quickPanel'), qpTitle = $('#qpTitle'), qpValue = $('#qpValue'), qpCopy = $('#qpCopy'), qpOpen = $('#qpOpen');
let nextHref = null;
function openPanel(title, value, href){ qpTitle.textContent = title; qpValue.textContent = value; nextHref = href; qp.hidden = false; }
function closePanel(){ qp.hidden = true; nextHref=null; }
qpCopy.addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText(qpValue.textContent); qpCopy.textContent='Copié !'; setTimeout(()=>qpCopy.textContent='Copier',1200);}catch{} });
qpOpen.addEventListener('click', ()=>{ if(nextHref){ window.open(nextHref, nextHref.startsWith('http')?'_blank':'_self'); } closePanel(); });
qp.addEventListener('click', (e)=>{ if(e.target===qp) closePanel(); });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closePanel(); });

// lier les boutons dock
const dockEmail = $('#dockEmail'), dockCall = $('#dockCall'), dockCv = $('#dockCv'), dockLi = $('#dockLinkedIn');
if(dockEmail){ dockEmail.addEventListener('click', (e)=>{ e.preventDefault(); openPanel('Envoyer un email', 'yassine370@laposte.net', dockEmail.href); }); }
if(dockCall){ dockCall.addEventListener('click', (e)=>{ e.preventDefault(); openPanel('Appeler', '+33 7 58 50 59 24', dockCall.href); }); }
if(dockCv){ dockCv.addEventListener('click', (e)=>{ e.preventDefault(); btnCv.click(); }); }
if(dockLi){ dockLi.addEventListener('click', (e)=>{ e.preventDefault(); openPanel('Ouvrir LinkedIn', linkedinUrl.replace(/^https?:\/\//,''), dockLi.href); }); }

/* ====== Canvas : LIGNES reseau + “paquets” lumineux ====== */
const canvas = document.getElementById('bg-lines');
const ctx = canvas.getContext('2d');
let w,h,dpr; const N = 70, DIST = 120, nodes=[], packets=[];
function resize(){ dpr=Math.max(1,window.devicePixelRatio||1); w=canvas.width=Math.floor(innerWidth*dpr); h=canvas.height=Math.floor(innerHeight*dpr); canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px'; }
resize(); addEventListener('resize', resize);
function rand(a,b){ return a + Math.random()*(b-a); }
for(let i=0;i<N;i++){ nodes.push({ x:rand(0,w), y:rand(0,h), vx:rand(-.25,.25), vy:rand(-.25,.25) }); }
function step(){
  ctx.clearRect(0,0,w,h);

  // mouvements des noeuds
  for(const n of nodes){ n.x+=n.vx; n.y+=n.vy; if(n.x<0||n.x>w) n.vx*=-1; if(n.y<0||n.y>h) n.vy*=-1; }

  // liaisons et paquets
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i], b=nodes[j]; const dx=a.x-b.x, dy=a.y-b.y; const dist=Math.hypot(dx,dy);
      if(dist < DIST*dpr){
        const alpha = 1 - dist/(DIST*dpr);
        ctx.strokeStyle = `rgba(56,189,248,${0.10*alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        if(Math.random() < 0.0009){ packets.push({ t:0, ax:a.x, ay:a.y, bx:b.x, by:b.y }); }
      }
    }
  }

  // noeuds
  for(const n of nodes){ ctx.fillStyle='rgba(143,213,255,.28)'; ctx.beginPath(); ctx.arc(n.x, n.y, 1.6*dpr, 0, Math.PI*2); ctx.fill(); }

  // paquets lumineux
  for(let i=packets.length-1;i>=0;i--){
    const p=packets[i]; p.t+=0.02; if(p.t>=1){ packets.splice(i,1); continue; }
    const x = p.ax + (p.bx-p.ax)*p.t, y = p.ay + (p.by-p.ay)*p.t;
    ctx.fillStyle='rgba(56,189,248,.9)'; ctx.beginPath(); ctx.arc(x,y,2.3*dpr,0,Math.PI*2); ctx.fill();
  }

  requestAnimationFrame(step);
}
step();
