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
  Strategy:
  - Each ring has a known radius (half its CSS width).
  - Each .orbit-item has data-angle (degrees, 0 = top).
  - We compute the item's center coordinates on the ring
    then offset by half the item's own size so the center
    sits exactly ON the ring border line.
  - Items are positioned relative to their parent ring,
    which is itself centered via margin:-radius.
*/

function positionItems(ringEl, radius) {
  ringEl.querySelectorAll('.orbit-item').forEach(item => {
    const angleDeg = parseFloat(item.dataset.angle) || 0;
    // 0° = top → subtract 90° so angle 0 maps to 12-o'clock
    const rad = (angleDeg - 90) * Math.PI / 180;

    // Point on circumference (relative to ring center)
    const cx = radius * Math.cos(rad);
    const cy = radius * Math.sin(rad);

    // Item half-sizes (use offsetWidth/Height after render, fallback to defaults)
    const hw = (item.offsetWidth  || (item.classList.contains('avatar-item') ? 50 : 42)) / 2;
    const hh = (item.offsetHeight || (item.classList.contains('avatar-item') ? 50 : 42)) / 2;

    // In the ring coord system, ring center = (radius, radius)
    // because the ring div's top-left is at (-radius, -radius) from its CSS center
    item.style.left = (radius + cx - hw) + 'px';
    item.style.top  = (radius + cy - hh) + 'px';
  });
}

function initOrbits() {
  const r1 = document.getElementById('ring1');
  const r2 = document.getElementById('ring2');
  // ring-1 is 220px wide → radius 110
  // ring-2 is 420px wide → radius 210
  if (r1) positionItems(r1, 110);
  if (r2) positionItems(r2, 210);
}

// Position on load (before fonts finish, sizes are still correct for px-fixed items)
initOrbits();
window.addEventListener('load', initOrbits);
window.addEventListener('resize', initOrbits);


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