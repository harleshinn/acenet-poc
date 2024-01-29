export default function decorate(block) {
  const heroContainer = block.querySelector('div:first-child');
  heroContainer.className = 'hero-block--content';

  heroContainer.querySelector('div:first-child').className = 'hero-text';
  heroContainer.querySelector('div:last-child').className = 'hero-image';
}
