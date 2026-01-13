export function initEffects() {
  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    body.classList.add('page-shimmer');
    setTimeout(() => body.classList.remove('page-shimmer'), 1200);

    const dropZone = document.getElementById('dropZone');
    if (!dropZone) return;
    const observer = new MutationObserver(() => {
      if (dropZone.classList.contains('uploading')) {
        dropZone.setAttribute('aria-busy', 'true');
      } else {
        dropZone.removeAttribute('aria-busy');
      }
    });
    observer.observe(dropZone, { attributes: true, attributeFilter: ['class'] });
  });
}

