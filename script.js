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


// Search the artist's songs and albums from the header.
const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('#site-search');
const searchInput = document.querySelector('#site-search-input');
const searchClose = document.querySelector('.search-close');
const searchCount = document.querySelector('.search-results-count');
const trackList = document.querySelector('.track-list');
const releaseList = document.querySelector('.release-list');
if (searchToggle && searchPanel && searchInput) {
  const openSearch = () => {
    searchPanel.hidden = false;
    searchToggle.setAttribute('aria-expanded', 'true');
    searchToggle.setAttribute('aria-label', 'Close music search');
    searchInput.focus();
  };
  const closeSearch = () => {
    searchPanel.hidden = true;
    searchToggle.setAttribute('aria-expanded', 'false');
    searchToggle.setAttribute('aria-label', 'Open music search');
    searchInput.value = '';
    filterMusic('');
  };
  const filterMusic = query => {
    const term = query.trim().toLowerCase();
    const rows = [
      ...(trackList ? [...trackList.querySelectorAll('.track-row')] : []),
      ...(releaseList ? [...releaseList.querySelectorAll('.release-row')] : [])
    ];
    let visible = 0;
    rows.forEach(row => {
      const match = !term || row.textContent.toLowerCase().includes(term);
      row.classList.toggle('search-hidden', !match);
      if (match) visible++;
    });
    let empty = document.querySelector('.search-empty');
    if (!empty && trackList) {
      empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = 'No matching songs or albums found. Try another title.';
      trackList.appendChild(empty);
    }
    if (empty) empty.hidden = !term || visible > 0;
    if (searchCount) searchCount.textContent = term ? visible + ' matching release' + (visible === 1 ? '' : 's') : '';
  };
  searchToggle.addEventListener('click', () => searchPanel.hidden ? openSearch() : closeSearch());
  searchClose?.addEventListener('click', closeSearch);
  searchInput.addEventListener('input', () => filterMusic(searchInput.value));
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSearch();
    if (event.key === 'Enter') {
      event.preventDefault();
      document.querySelector('#music')?.scrollIntoView({behavior:'smooth'});
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape' && !searchPanel.hidden) closeSearch();
  });
}


// Hero portrait slideshow: visibly crossfade between the artist's images.
const heroSlides = [...document.querySelectorAll('.hero-image .hero-slide')];
if (heroSlides.length > 1) {
  let activeHeroSlide = 0;
  heroSlides.forEach((slide, index) => {
    slide.classList.toggle('is-active', index === 0);
    slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
  });
  window.setInterval(() => {
    heroSlides[activeHeroSlide].classList.remove('is-active');
    heroSlides[activeHeroSlide].setAttribute('aria-hidden', 'true');
    activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
    heroSlides[activeHeroSlide].classList.add('is-active');
    heroSlides[activeHeroSlide].setAttribute('aria-hidden', 'false');
  }, 5500);
}
