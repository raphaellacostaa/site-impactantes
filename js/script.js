// Script para ampliar as imagens no lightbox

const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImage = lightboxOverlay.querySelector('img');

document.querySelectorAll('.produtos img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // desativa scroll enquanto aberto
  });
});

lightboxOverlay.addEventListener('click', () => {
  lightboxOverlay.style.display = 'none';
  lightboxImage.src = '';
  document.body.style.overflow = ''; // ativa scroll novamente
});



