import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  block.append(footer);
  const footerContent = block.querySelectorAll('.footer-links > div > div');
  footerContent.forEach((item, index) => {
    if (index === 0) item.classList.add('social-media');
    if (index === 1) item.classList.add('mission');
    if (index === 2) item.classList.add('higher-education');
  });
}
