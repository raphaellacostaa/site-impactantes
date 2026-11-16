/* =========================================================
   Impactantes Moda Feminina — interações
   ========================================================= */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Ano automático no rodapé ---------- */
const ano = $("#ano");
if (ano) ano.textContent = new Date().getFullYear();

/* ---------- Cabeçalho com sombra + botão flutuante ao rolar ---------- */
const header = $(".header");
const fab = $(".fab");

function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 10);
  fab?.classList.toggle("is-visible", y > 500);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Menu mobile ---------- */
const menuToggle = $("#menuToggle");
const menu = $("#menu");

function setMenu(open) {
  if (!menuToggle || !menu) return;
  menu.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => {
  setMenu(!menu.classList.contains("is-open"));
});
$$("#menu a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

/* ---------- Link ativo na navegação ---------- */
const navLinks = $$(".nav ul a");
const sections = navLinks
  .map((link) => $(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => navObserver.observe(s));
}

/* ---------- Animação de entrada (reveal) ---------- */
const reveals = $$(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  // Pequeno atraso em cascata para elementos lado a lado
  reveals.forEach((el) => {
    const siblings = $$(":scope > .reveal", el.parentElement);
    const i = siblings.indexOf(el);
    if (i > 0) el.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
    revealObserver.observe(el);
  });
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Filtro do catálogo ---------- */
const filters = $$(".filter");
const cards = $$("#catalogoGrid .card");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    filters.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });

    cards.forEach((card) => {
      const cats = card.dataset.category.split(" ");
      const show = filter === "todos" || cats.includes(filter);
      card.hidden = !show;
      if (show) card.classList.add("is-visible");
    });
  });
});

/* ---------- Lightbox com navegação ---------- */
const lightbox = $("#lightbox");
const lbImg = $("#lbImg");
const lbCaption = $("#lbCaption");
const lbCounter = $("#lbCounter");

let gallery = [];
let current = 0;
let lastFocus = null;

function visibleImages() {
  return cards.filter((c) => !c.hidden).map((c) => $("img", c));
}

function showImage(index) {
  current = (index + gallery.length) % gallery.length;
  const img = gallery[current];
  lbImg.classList.add("is-loading");
  lbImg.onload = () => lbImg.classList.remove("is-loading");
  lbImg.src = img.currentSrc || img.src;
  lbImg.alt = img.alt;
  lbCaption.textContent = img.alt;
  lbCounter.textContent = `${current + 1} / ${gallery.length}`;
}

function openLightbox(img) {
  gallery = visibleImages();
  lastFocus = document.activeElement;
  showImage(gallery.indexOf(img));
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add("is-open"));
  document.body.style.overflow = "hidden";
  $("#lbClose").focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  document.body.style.overflow = "";
  setTimeout(() => {
    lightbox.hidden = true;
    lbImg.src = "";
  }, 250);
  lastFocus?.focus();
}

if (lightbox) {
  $$(".card-media").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox($("img", btn)));
  });

  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => showImage(current - 1));
  $("#lbNext").addEventListener("click", () => showImage(current + 1));

  // Clicar no fundo escuro fecha
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lb-figure")) closeLightbox();
  });

  // Teclado: ESC, setas e foco preso dentro do lightbox
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) {
      if (e.key === "Escape" && menu?.classList.contains("is-open")) setMenu(false);
      return;
    }
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(current - 1);
    if (e.key === "ArrowRight") showImage(current + 1);
    if (e.key === "Tab") {
      const focusables = $$(".lb-btn", lightbox);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Deslizar no celular
  let touchX = null;
  lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showImage(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });
}
