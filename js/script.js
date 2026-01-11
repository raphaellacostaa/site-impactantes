// URL oficial do Instagram
const INSTAGRAM_URL = "https://instagram.com/impac.tantes";

// Pega elementos do lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

// Todas as imagens que devem abrir em zoom
const lightboxImages = document.querySelectorAll("[data-lightbox='true']");

// Abre o lightbox
function openLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;

  lightboxImg.src = src;
  lightboxImg.alt = alt || "Imagem ampliada";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

// Fecha o lightbox
function closeLightbox() {
  if (!lightbox || !lightboxImg) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  setTimeout(() => {
    lightboxImg.src = "";
  }, 150);
}

// Adiciona evento de clique a cada imagem
lightboxImages.forEach((img) => {
  img.style.cursor = "pointer"; // 👈 mãozinha
  img.addEventListener("click", () => {
    openLightbox(img.src, img.alt);
  });
});

// Botão X
if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

// Clicar fora da imagem fecha
if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

// Tecla ESC fecha
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});

// Botão flutuante Instagram
const fabInstagram = document.getElementById("fabInstagram");
if (fabInstagram) {
  fabInstagram.addEventListener("click", () => {
    window.open(INSTAGRAM_URL, "_blank");
  });
}

// Scroll suave da nav
const navLinks = document.querySelectorAll(".nav a[href^='#']");
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});



