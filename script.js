/* =============================================
   MARKETEAM – script.js  (corrected v2)
   Items are placed so their CENTER sits exactly
   on the ring circumference line.
   ============================================= */

/* ── CUSTOM CURSOR ──────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

(function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .orbit-item, .brand-logos span').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});


/* ── ORBIT ITEM POSITIONING ─────────────────── */
/*
  Reads the ring's actual rendered width at runtime so
  it works correctly at every breakpoint automatically.
*/

function positionItems(ringEl) {
  // radius = half the ring's live rendered width
  const radius = ringEl.offsetWidth / 2;
  if (radius === 0) return; // not rendered yet

  ringEl.querySelectorAll('.orbit-item').forEach(item => {
    const angleDeg = parseFloat(item.dataset.angle) || 0;
    const rad = (angleDeg - 90) * Math.PI / 180;

    const cx = radius * Math.cos(rad);
    const cy = radius * Math.sin(rad);

    const hw = item.offsetWidth  / 2 || (item.classList.contains('avatar-item') ? 19 : 17);
    const hh = item.offsetHeight / 2 || (item.classList.contains('avatar-item') ? 19 : 17);

    item.style.left = (radius + cx - hw) + 'px';
    item.style.top  = (radius + cy - hh) + 'px';
  });
}

function initOrbits() {
  const r1 = document.getElementById('ring1');
  const r2 = document.getElementById('ring2');
  if (r1) positionItems(r1);
  if (r2) positionItems(r2);
}

initOrbits();
window.addEventListener('load', initOrbits);
window.addEventListener('resize', initOrbits);


/* ── HAMBURGER MENU ─────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  // close when a link is tapped
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}


/* ── BUTTON RIPPLE EFFECT ───────────────────── */
// Inject keyframe once
const s = document.createElement('style');
s.textContent = '@keyframes rippleAnim { to { transform:scale(1); opacity:0; } }';
document.head.appendChild(s);

function addRipple(btn) {
  btn.addEventListener('click', e => {
    const r = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    r.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
      background:rgba(255,255,255,.18);
      border-radius:50%;
      transform:scale(0);
      animation:rippleAnim .6s ease-out forwards;
      pointer-events:none;
    `;
    btn.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
}
document.querySelectorAll('.btn-join, .btn-start, .btn-login').forEach(addRipple);


/* ── STAT COUNTER ───────────────────────────── */
const statEl = document.getElementById('statNumber');
if (statEl) {
  let fired = false;
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      let start = null;
      const duration = 1800;
      (function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        statEl.textContent = Math.floor(eased * 20) + 'k+';
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }
  }, { threshold: 0.5 }).observe(statEl);
}