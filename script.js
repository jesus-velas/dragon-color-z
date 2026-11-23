/* =========================================================
   DRAGON BALL COLORING BOOK · Landing Page · script.js
   ========================================================= */

/* ---------------------------------------------------------
   ⚙️  CONFIGURACIÓN — EDITA SOLO ESTA PARTE
   --------------------------------------------------------- */
const CONFIG = {
  // 👉 Pega aquí tu Hotlink / enlace de pago de Hotmart
  HOTMART_URL: "https://pay.hotmart.com/F106889203V",

  PRICE: "$4.45",   // precio que se muestra en la página
  OLD_PRICE: "",    // precio tachado (déjalo "" para ocultarlo)

  TOTAL_PAGES: 50,                 // cuántas páginas pagina-XX.jpg tienes
  PAGE_PATH: "images/pagina-",     // prefijo de tus imágenes
  PAGE_EXT: ".jpg",
};

/* ---------------------------------------------------------
   Utilidades
   --------------------------------------------------------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, "0");
const pageSrc = (n) => `${CONFIG.PAGE_PATH}${pad(n)}${CONFIG.PAGE_EXT}`;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rand = (a, b) => Math.random() * (b - a) + a;
const PALETTE = ["#fac415", "#ea433d", "#308ade", "#2e8b3a", "#b79bdb", "#f0701a", "#66b4f2", "#ff8fb1", "#8a5a2c", "#20140a", "#ffe45c", "#7bd88f"];

/* ---------------------------------------------------------
   1. Botones de compra (Hotmart) y precio
   --------------------------------------------------------- */
$$("[data-buy]").forEach((a) => {
  a.href = CONFIG.HOTMART_URL;
  a.target = "_blank";
  a.rel = "noopener";
});
$$("[data-price]").forEach((el) => (el.textContent = CONFIG.PRICE));
$$("[data-old-price]").forEach((el) => (el.textContent = CONFIG.OLD_PRICE));
$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------------------------------------------------------
   2. Decoración generada: mandalas, destellos, lápices
   --------------------------------------------------------- */
function buildMandala() {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "-100 -100 200 200");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "0.9");
  svg.setAttribute("aria-hidden", "true");
  const rings = [
    { n: 24, r: 92, h: 16, w: 4 },
    { n: 16, r: 74, h: 28, w: 8 },
    { n: 12, r: 52, h: 24, w: 9 },
    { n: 8, r: 32, h: 22, w: 8 },
  ];
  let html = '<circle r="98"/><circle r="95" stroke-dasharray="1.5 3"/>';
  rings.forEach(({ n, r, h, w }) => {
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i;
      html += `<path transform="rotate(${a}) translate(0 ${-r})" fill="currentColor" fill-opacity=".07" d="M0 ${h} C ${w} ${h * 0.55} ${w} ${h * 0.15} 0 0 C ${-w} ${h * 0.15} ${-w} ${h * 0.55} 0 ${h}Z"/>`;
    }
  });
  html += '<circle r="12"/><circle r="6" fill="currentColor" fill-opacity=".25"/>';
  svg.innerHTML = html;
  return svg;
}
$$(".mandala").forEach((el) => el.appendChild(buildMandala()));

$$(".sparkles").forEach((box) => {
  const cols = ["#c99a3d", "#308ade", "#b79bdb", "#fac415", "#66b4f2"];
  const count = box.dataset.count || 22;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("i");
    s.className = "spark";
    s.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 100)}%;--s:${rand(8, 22)}px;--c:${cols[i % cols.length]};--d:${rand(2.5, 6)}s;--delay:${rand(-6, 0)}s`;
    box.appendChild(s);
  }
});

const pencilBox = $(".pencils");
if (pencilBox) {
  const cols = ["#ea433d", "#f0701a", "#fac415", "#7bd88f", "#2e8b3a", "#66b4f2", "#308ade", "#123e78", "#b79bdb", "#8d6cc9", "#ff8fb1", "#8a5a2c"];
  cols.forEach((c, i) => {
    const p = document.createElement("i");
    p.className = "pencil";
    const r = -2 + i * 2.2;
    p.style.cssText = `--c:${c};--r:${r};transform:rotate(${r}deg);bottom:${i * 5.5}px;left:${i * 3}px;width:${270 - i * 3}px`;
    pencilBox.appendChild(p);
  });
}

/* ---------------------------------------------------------
   3. Barra de progreso, navegación y barra de compra móvil
   --------------------------------------------------------- */
const progress = $(".progress");
const nav = $(".nav");
const buybar = $(".buybar");
const hero = $(".hero");
function onScroll() {
  const h = document.documentElement;
  const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
  if (progress) progress.style.transform = `scaleX(${p})`;
  if (nav) nav.classList.toggle("scrolled", h.scrollTop > 40);
  if (buybar && hero) buybar.classList.toggle("show", h.scrollTop > hero.offsetHeight * 0.7);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const toggle = $(".nav-toggle");
const links = $(".nav-links");
if (toggle && links) {
  const close = () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$("a", links).forEach((a) => a.addEventListener("click", close));
}

/* ---------------------------------------------------------
   4. Revelar al hacer scroll + contadores
   --------------------------------------------------------- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
      if (e.target.matches("[data-count-to]")) countUp(e.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);
$$(".reveal").forEach((el) => io.observe(el));
$$("[data-count-to]").forEach((el) => io.observe(el));

function countUp(el) {
  const to = parseFloat(el.dataset.countTo);
  if (isNaN(to) || reduceMotion) return (el.textContent = el.dataset.countTo);
  const dur = 1600;
  const t0 = performance.now();
  const tick = (t) => {
    const k = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------------------------------------------------------
   5. Parallax / inclinación del hero con el mouse
   --------------------------------------------------------- */
const visual = $(".hero-visual");
if (visual && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  const layers = $$(".layer", visual);
  window.addEventListener("mousemove", (e) => {
    const x = e.clientX / innerWidth - 0.5;
    const y = e.clientY / innerHeight - 0.5;
    layers.forEach((l) => {
      const d = parseFloat(l.dataset.depth || 20);
      l.style.transform = `translate(${x * d}px, ${y * d}px)`;
    });
  });
}

/* ---------------------------------------------------------
   6. Marquee: duplicar las tarjetas para bucle infinito
   --------------------------------------------------------- */
$$(".track").forEach((track) => {
  const kids = [...track.children];
  kids.forEach((k) => {
    const c = k.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    track.appendChild(c);
  });
});

/* Tinte de color aleatorio (efecto "multiply") para tarjetas */
const tintPairs = [
  ["#ffe45c", "#66b4f2"], ["#ff8fb1", "#ffe45c"], ["#7bd88f", "#66b4f2"], ["#ff6a5e", "#fac415"],
  ["#c3b0e6", "#66b4f2"], ["#ffb36b", "#ff6a5e"], ["#66b4f2", "#7bd88f"], ["#ffe45c", "#ff8fb1"],
];
$$(".tile, .track figure").forEach((el, i) => {
  const [a, b] = tintPairs[i % tintPairs.length];
  el.style.setProperty("--c1", a);
  el.style.setProperty("--c2", b);
  el.style.setProperty("--ang", `${Math.round(rand(100, 200))}deg`);
  el.style.setProperty("--rot", `${rand(-2.5, 2.5).toFixed(1)}deg`);
});

/* ---------------------------------------------------------
   7. Lightbox (visor) con teclado y deslizar
   --------------------------------------------------------- */
const lb = $(".lb");
const lbImg = $(".lb-imgbox img");
const lbCount = $(".lb-count");
let lbIndex = 1;

function lbShow(n) {
  lbIndex = ((n - 1 + CONFIG.TOTAL_PAGES) % CONFIG.TOTAL_PAGES) + 1;
  lbImg.classList.remove("zoomed");
  lbImg.src = pageSrc(lbIndex);
  lbImg.alt = `Página ${pad(lbIndex)} del libro de colorear`;
  lbCount.textContent = `Página ${pad(lbIndex)} / ${CONFIG.TOTAL_PAGES}`;
  [lbIndex + 1, lbIndex - 1].forEach((m) => {
    const pre = new Image();
    pre.src = pageSrc(((m - 1 + CONFIG.TOTAL_PAGES) % CONFIG.TOTAL_PAGES) + 1);
  });
}
function lbOpen(n) {
  lbShow(n);
  lb.classList.add("open");
  document.body.classList.add("no-scroll");
}
function lbClose() {
  lb.classList.remove("open");
  document.body.classList.remove("no-scroll");
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-open]");
  if (t) {
    e.preventDefault();
    lbOpen(parseInt(t.dataset.open, 10));
  }
});
$(".lb-prev").addEventListener("click", () => lbShow(lbIndex - 1));
$(".lb-next").addEventListener("click", () => lbShow(lbIndex + 1));
$(".lb-close").addEventListener("click", lbClose);
lb.addEventListener("click", (e) => {
  if (e.target === lb) lbClose();
});
lbImg.addEventListener("click", (e) => {
  const r = lbImg.getBoundingClientRect();
  if (!lbImg.classList.contains("zoomed")) {
    lbImg.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  }
  lbImg.classList.toggle("zoomed");
});
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") lbClose();
  if (e.key === "ArrowRight") lbShow(lbIndex + 1);
  if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
});
let tx = null;
lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
lb.addEventListener("touchend", (e) => {
  if (tx === null) return;
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1));
  tx = null;
});
$("[data-color-this]").addEventListener("click", () => {
  lbClose();
  studio.load(lbIndex);
  $("#colorear").scrollIntoView({ behavior: "smooth" });
});

/* ---------------------------------------------------------
   8. Hojear el libro (Coverflow 3D)
   --------------------------------------------------------- */
(function coverflow() {
  const root = $(".coverflow");
  if (!root) return;
  const items = $$(".cf-item", root);
  const count = $(".cf-count");
  let idx = 0;
  let timer = null;

  function render() {
    items.forEach((it, i) => {
      const o = i - idx;
      const a = Math.abs(o);
      const mobile = innerWidth < 700;
      const step = mobile ? 46 : 58;
      const oc = Math.max(-4, Math.min(4, o));
      it.style.transform = `translateX(${oc * step}%) translateZ(${-Math.min(a, 4) * 130}px) rotateY(${Math.max(-1, Math.min(1, -o)) * (a ? 42 : 0)}deg) scale(${a ? 0.92 : 1})`;
      it.style.zIndex = 100 - a;
      it.style.opacity = a > 3 ? 0 : 1 - a * 0.2;
      it.style.filter = a ? `brightness(${1 - a * 0.14})` : "none";
      it.style.pointerEvents = a > 3 ? "none" : "auto";
      it.classList.toggle("is-active", a === 0);
    });
    if (count) count.textContent = `${pad(idx + 1)} / ${pad(items.length)}`;
  }
  const go = (n) => {
    idx = (n + items.length) % items.length;
    render();
  };
  $(".cf-prev").addEventListener("click", () => { go(idx - 1); restart(); });
  $(".cf-next").addEventListener("click", () => { go(idx + 1); restart(); });
  items.forEach((it, i) => it.addEventListener("click", () => {
    if (root.dataset.dragged === "1") return;
    if (i === idx) { if (it.dataset.open) lbOpen(parseInt(it.dataset.open, 10)); }
    else { go(i); restart(); }
  }));

  /* arrastrar */
  let sx = null;
  root.addEventListener("pointerdown", (e) => { sx = e.clientX; root.dataset.dragged = "0"; });
  window.addEventListener("pointerup", (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 40) {
      root.dataset.dragged = "1";
      go(idx + (dx < 0 ? 1 : -1));
      restart();
      setTimeout(() => (root.dataset.dragged = "0"), 50);
    }
    sx = null;
  });
  root.setAttribute("tabindex", "0");
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { go(idx + 1); restart(); }
    if (e.key === "ArrowLeft") { go(idx - 1); restart(); }
  });

  function start() { if (!reduceMotion) timer = setInterval(() => go(idx + 1), 3200); }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.3 }).observe(root);
  window.addEventListener("resize", render);
  render();
})();

/* ---------------------------------------------------------
   9. Galería: botón "ver todas"
   --------------------------------------------------------- */
(function gallery() {
  const wrap = $(".gallery-wrap");
  const grid = $(".grid", wrap);
  const btn = $("#moreBtn");
  if (!wrap || !btn) return;
  btn.addEventListener("click", () => {
    const open = grid.classList.toggle("open");
    wrap.classList.toggle("open", open);
    btn.querySelector("span").textContent = open ? "Ver menos" : `Ver las ${CONFIG.TOTAL_PAGES} páginas`;
    if (!open) $("#galeria").scrollIntoView({ behavior: "smooth" });
  });
})();

/* ---------------------------------------------------------
   10. FAQ (acordeón)
   --------------------------------------------------------- */
$$(".qa").forEach((qa) => {
  const b = $("button", qa);
  b.addEventListener("click", () => {
    const open = !qa.classList.contains("open");
    $$(".qa.open").forEach((o) => { o.classList.remove("open"); $("button", o).setAttribute("aria-expanded", "false"); });
    qa.classList.toggle("open", open);
    b.setAttribute("aria-expanded", open);
  });
});

/* ---------------------------------------------------------
   11. ESTUDIO DE COLOREAR (balde de relleno + pincel)
   - Funciona con el efecto "multiply": las líneas negras
     siempre quedan por encima del color.
   - El balde necesita leer los píxeles de la imagen, y los
     navegadores solo lo permiten desde un servidor (Live
     Server, GitHub Pages, Netlify...). Si abres index.html
     con doble clic, el pincel funciona igual y el balde se
     desactiva solo.
   --------------------------------------------------------- */
const studio = (function () {
  const box = $(".canvas-box");
  const img = $("#artImg");
  const paint = $("#paint");
  if (!box || !img || !paint) return { load() {} };

  const ctx = paint.getContext("2d", { willReadFrequently: true });
  const bucketBtn = $("#toolBucket");
  const brushBtn = $("#toolBrush");
  const sizeEl = $("#brushSize");
  let color = PALETTE[0];
  let tool = "bucket";
  let art = null; // ImageData de la página original
  let history = [];
  let drawing = false;
  let last = null;
  let current = 1;

  /* paleta */
  const sw = $(".swatches");
  PALETTE.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "sw" + (i === 0 ? " active" : "");
    b.style.setProperty("--c", c);
    b.setAttribute("aria-label", `Color ${c}`);
    b.addEventListener("click", () => {
      $$(".sw", sw).forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      color = c;
    });
    sw.appendChild(b);
  });

  function setTool(t) {
    tool = t;
    bucketBtn.classList.toggle("active", t === "bucket");
    brushBtn.classList.toggle("active", t === "brush");
  }
  bucketBtn.addEventListener("click", () => !bucketBtn.disabled && setTool("bucket"));
  brushBtn.addEventListener("click", () => setTool("brush"));

  function snapshot() {
    history.push(ctx.getImageData(0, 0, paint.width, paint.height));
    if (history.length > 25) history.shift();
  }

  function load(n) {
    current = n;
    $$(".thumbs button").forEach((b) => b.classList.toggle("active", parseInt(b.dataset.page, 10) === n));
    history = [];
    art = null;
    const probe = new Image();
    probe.onload = () => {
      paint.width = probe.naturalWidth;
      paint.height = probe.naturalHeight;
      ctx.clearRect(0, 0, paint.width, paint.height);
      img.src = probe.src;
      try {
        const off = document.createElement("canvas");
        off.width = probe.naturalWidth;
        off.height = probe.naturalHeight;
        const octx = off.getContext("2d", { willReadFrequently: true });
        octx.drawImage(probe, 0, 0);
        art = octx.getImageData(0, 0, off.width, off.height);
        bucketBtn.disabled = false;
      } catch (err) {
        art = null; // archivo abierto sin servidor → canvas "tainted"
        bucketBtn.disabled = true;
        setTool("brush");
        $(".note").innerHTML = "💡 Estás abriendo el archivo directamente: el <b>pincel</b> funciona, pero el <b>balde</b> requiere un servidor local (extensión Live Server) o la página ya publicada.";
      }
    };
    probe.src = pageSrc(n);
  }

  function pos(e) {
    const r = paint.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * paint.width, y: ((e.clientY - r.top) / r.height) * paint.height };
  }

  function hex(c) {
    const n = parseInt(c.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  /* Relleno por inundación sobre el dibujo original */
  function bucketFill(px, py) {
    if (!art) return;
    const W = art.width, H = art.height, d = art.data;
    const x0 = Math.floor(px), y0 = Math.floor(py);
    if (x0 < 0 || y0 < 0 || x0 >= W || y0 >= H) return;
    const light = (i) => (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) > 150;
    if (!light((y0 * W + x0) * 4)) return; // clic sobre una línea
    snapshot();
    const mask = new Uint8Array(W * H);
    const stack = [y0 * W + x0];
    mask[y0 * W + x0] = 1;
    while (stack.length) {
      const p = stack.pop();
      const x = p % W;
      const y = (p / W) | 0;
      if (x > 0 && !mask[p - 1] && light((p - 1) * 4)) { mask[p - 1] = 1; stack.push(p - 1); }
      if (x < W - 1 && !mask[p + 1] && light((p + 1) * 4)) { mask[p + 1] = 1; stack.push(p + 1); }
      if (y > 0 && !mask[p - W] && light((p - W) * 4)) { mask[p - W] = 1; stack.push(p - W); }
      if (y < H - 1 && !mask[p + W] && light((p + W) * 4)) { mask[p + W] = 1; stack.push(p + W); }
    }
    const out = ctx.getImageData(0, 0, W, H);
    const o = out.data;
    const [r, g, b] = hex(color);
    const put = (p) => { const i = p * 4; o[i] = r; o[i + 1] = g; o[i + 2] = b; o[i + 3] = 255; };
    for (let p = 0; p < mask.length; p++) {
      if (!mask[p]) continue;
      put(p);
      // engrosar 1 px para cubrir el borde suavizado de las líneas
      const x = p % W;
      if (x > 0) put(p - 1);
      if (x < W - 1) put(p + 1);
      if (p >= W) put(p - W);
      if (p < mask.length - W) put(p + W);
    }
    ctx.putImageData(out, 0, 0);
  }

  function stroke(a, b) {
    ctx.strokeStyle = color;
    ctx.lineWidth = (parseInt(sizeEl.value, 10) * paint.width) / 560;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  paint.addEventListener("pointerdown", (e) => {
    box.classList.add("touched");
    const p = pos(e);
    if (tool === "bucket") return bucketFill(p.x, p.y);
    snapshot();
    drawing = true;
    last = p;
    paint.setPointerCapture(e.pointerId);
    stroke(p, { x: p.x + 0.01, y: p.y });
  });
  paint.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const p = pos(e);
    stroke(last, p);
    last = p;
  });
  const end = () => { drawing = false; };
  paint.addEventListener("pointerup", end);
  paint.addEventListener("pointercancel", end);

  $("#undo").addEventListener("click", () => {
    const s = history.pop();
    if (s) ctx.putImageData(s, 0, 0);
  });
  $("#clear").addEventListener("click", () => {
    snapshot();
    ctx.clearRect(0, 0, paint.width, paint.height);
  });
  $("#save").addEventListener("click", () => {
    const out = document.createElement("canvas");
    out.width = paint.width;
    out.height = paint.height;
    const o = out.getContext("2d");
    o.fillStyle = "#fff";
    o.fillRect(0, 0, out.width, out.height);
    o.drawImage(paint, 0, 0);
    o.globalCompositeOperation = "multiply";
    o.drawImage(img, 0, 0, out.width, out.height);
    try {
      const a = document.createElement("a");
      a.download = `mi-dragon-ball-pagina-${pad(current)}.png`;
      a.href = out.toDataURL("image/png");
      a.click();
    } catch (err) {
      alert("Para descargar tu obra necesitas abrir la página desde un servidor (Live Server o la web publicada).");
    }
  });

  $$(".thumbs button").forEach((b) => b.addEventListener("click", () => load(parseInt(b.dataset.page, 10))));
  setTool("bucket");
  load(parseInt($(".thumbs button")?.dataset.page || "1", 10));
  return { load };
})();

/* ---------------------------------------------------------
   12. Pequeña explosión de destellos al pasar por los botones
   --------------------------------------------------------- */
if (!reduceMotion) {
  $$(".btn-buy").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      const r = btn.getBoundingClientRect();
      for (let i = 0; i < 10; i++) {
        const s = document.createElement("i");
        s.className = "spark";
        const c = ["#fac415", "#ffe45c", "#fff", "#66b4f2"][i % 4];
        s.style.cssText = `position:fixed;z-index:400;pointer-events:none;left:${r.left + rand(0, r.width)}px;top:${r.top + rand(-6, r.height)}px;--s:${rand(8, 16)}px;--c:${c};--d:.8s;--delay:0s;animation-iteration-count:1;transition:transform .8s,opacity .8s`;
        document.body.appendChild(s);
        requestAnimationFrame(() => (s.style.transform = `translate(${rand(-40, 40)}px,${rand(-60, -10)}px)`));
        setTimeout(() => s.remove(), 850);
      }
    });
  });
}
