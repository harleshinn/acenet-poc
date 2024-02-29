export default function decorate(block) {
  // media query match that indicates mobile/tablet width
  const isDesktop = window.matchMedia('(min-width: 1280px)');
  const heroContainer = block.querySelector('div:first-child');
  heroContainer.className = 'hero-block--content';

  heroContainer.querySelector('div:first-child').className = 'hero-text';
  heroContainer.querySelector('div:last-child').className = 'hero-image';

  const exploreButton = block.querySelector('a[title="Explore"]');
  exploreButton.setAttribute('href', '#articles');
  exploreButton.classList.add('explore-button');
  exploreButton.classList.remove('button');

  const buttonObserver = new ResizeObserver((entries) => {
    entries.forEach(() => {
      if (isDesktop.matches === false) {
        exploreButton.style.display = 'none';
      } else {
        exploreButton.style.display = 'block';
      }
    });
  });

  buttonObserver.observe(heroContainer);
}
