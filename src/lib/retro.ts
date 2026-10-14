// Small client-side bits of the retro layer. No dependencies.
const P = { c2: '#E4E0D4', ink: '#11110E', lime: '#C6F332', grey: '#9C998C' };
const COIN = ["....XXXX....","..XXLLLLXX..",".XLLLLLLLLX.",".XLLXXXXLLX.","XLLX....LLLX","XLLX.......X","XLLX.......X","XLLX....LLLX",".XLLXXXXLLX.",".XLLLLLLLLX.","..XXLLLLXX..","....XXXX...."];

export function coinSVG(fg = P.ink, fill = P.lime) {
  let r = '';
  COIN.forEach((row, y) => [...row].forEach((c, x) => {
    if (c !== '.') r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c === 'X' ? fg : fill}"/>`;
  }));
  return `<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}

function rng(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

// Pixel skyline + price line, used wherever a story has no image yet.
export function paint(cv: HTMLCanvasElement, seed: number, night: boolean) {
  const W = 48, H = 36; cv.width = W; cv.height = H;
  const g = cv.getContext('2d'); if (!g) return;
  const r = rng(seed * 97 + 13);
  g.fillStyle = night ? P.ink : P.c2; g.fillRect(0, 0, W, H);
  if (night) for (let i = 0; i < 30; i++) { g.fillStyle = r() > .5 ? P.lime : P.grey; g.fillRect(r() * W | 0, r() * 18 | 0, 1, 1); }
  g.fillStyle = P.lime;
  const sx = 8 + (r() * 30 | 0), sy = 4 + (r() * 6 | 0);
  for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) if (x * x + y * y <= 17) g.fillRect(sx + x, sy + y, 1, 1);
  let y = 24 + (r() * 4 | 0); g.fillStyle = night ? P.lime : P.ink;
  for (let x = 0; x < W; x++) { y += r() < .5 ? -1 : 1; if (r() < .12) y += r() < .5 ? -3 : 3; y = Math.max(10, Math.min(30, y)); g.fillRect(x, y, 1, 1); }
  let x = 0;
  while (x < W) {
    const w = 3 + (r() * 5 | 0), h = 6 + (r() * 14 | 0);
    g.fillStyle = P.ink; g.fillRect(x, H - h, w, h);
    g.fillStyle = night ? P.lime : P.grey;
    for (let wy = H - h + 2; wy < H - 1; wy += 3) for (let wx = x + 1; wx < x + w - 1; wx += 2) if (r() > .45) g.fillRect(wx, wy, 1, 1);
    x += w + (r() * 2 | 0);
  }
}

export function paintAll() {
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-seed]').forEach(c => paint(c, +c.dataset.seed!, c.dataset.kind === 'night'));
}

let tt: number | undefined;
export function toast(k: string, m: string) {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status');
  t.innerHTML = `${coinSVG()}<div><div class="k"></div><div class="m"></div></div>`;
  t.querySelector('.k')!.textContent = k.toUpperCase();
  t.querySelector('.m')!.textContent = m;
  document.body.appendChild(t);
  clearTimeout(tt); tt = window.setTimeout(() => t.remove(), 2800);
}

// "Press start" intro, once per browser session, skipped for reduced motion.
export function boot() {
  try {
    if (sessionStorage.getItem('cm-boot') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    sessionStorage.setItem('cm-boot', '1');
  } catch { return; }
  const b = document.createElement('div');
  b.className = 'boot'; b.setAttribute('aria-hidden', 'true');
  b.innerHTML = `${coinSVG(P.lime, P.ink)}<div>COINMOBB</div><div class="bar"><i></i></div><div>PRESS START</div>`;
  b.addEventListener('click', () => b.remove());
  document.body.appendChild(b);
  setTimeout(() => b.remove(), 1200);
}

export function wireMenu() {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu]');
  const menu = document.getElementById('menu');
  btn?.addEventListener('click', () => {
    const open = menu!.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
}

// Until a newsletter provider is connected (site.json newsletterAction), the form just confirms locally.
export function wireDrop() {
  document.querySelectorAll<HTMLFormElement>('form[data-drop]').forEach(f => {
    if (f.getAttribute('action')) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      const msg = f.parentElement?.querySelector('[data-drop-msg]');
      if (msg) msg.textContent = 'Newsletter not connected yet.';
    });
  });
}

// Article XP bar + achievement on finishing.
export function wireXP() {
  const bars = [...document.querySelectorAll<HTMLElement>('.xp .bar i')];
  const n = document.querySelector<HTMLElement>('[data-xp]');
  const end = document.querySelector('[data-story-end]');
  if (!bars.length || !n || !end) return;
  let done = false;
  const update = () => {
    const top = (end as HTMLElement).getBoundingClientRect().top + scrollY - innerHeight;
    const p = Math.max(0, Math.min(1, scrollY / Math.max(1, top)));
    const on = Math.round(p * bars.length);
    bars.forEach((b, i) => b.classList.toggle('on', i < on));
    n.textContent = 'XP ' + String(Math.round(p * 100) * 10).padStart(3, '0');
    if (p >= .98 && !done) { done = true; toast('Achievement unlocked', 'Read to the end. Respect.'); }
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

export function wireShare() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try {
      if (navigator.share) { await navigator.share({ title: document.title, url: location.href }); return; }
      await navigator.clipboard.writeText(location.href);
      toast('Link copied', 'Paste it in the group chat');
    } catch { /* user cancelled */ }
  }));
}
