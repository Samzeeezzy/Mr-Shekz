const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }));
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const modal = document.querySelector('.video-modal');
const openVideo = document.querySelector('[data-video]');
const closeVideo = document.querySelector('.modal-close');
if (modal && openVideo && closeVideo) {
  openVideo.addEventListener('click', () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    closeVideo.focus();
  });
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    openVideo.focus();
  };
  closeVideo.addEventListener('click', close);
  modal.addEventListener('click', event => { if (event.target === modal) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) close(); });
}

// Add the official video embed here when it is supplied. The current modal is an intentional placeholder.


// Share every song or album using the native share sheet, with a clipboard fallback.
document.addEventListener('click', async event => {
  const button = event.target.closest('[data-share-url]');
  if (!button) return;
  const url = button.dataset.shareUrl;
  const title = button.dataset.shareTitle || 'Sheks JP';
  const shareData = {title, text: 'Listen to ' + title, url};
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      button.textContent = '✓ Copied';
      window.setTimeout(() => { button.textContent = '↗ Share'; }, 1800);
    } else {
      const field = document.createElement('textarea');
      field.value = url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
      button.textContent = '✓ Copied';
      window.setTimeout(() => { button.textContent = '↗ Share'; }, 1800);
    }
  } catch (error) {
    if (error && error.name !== 'AbortError') {
      button.textContent = 'Share unavailable';
      window.setTimeout(() => { button.textContent = '↗ Share'; }, 1800);
    }
  }
});
