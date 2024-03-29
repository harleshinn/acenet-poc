import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {

  function wrapImgsInLinks(container) {
    const pictures = container.querySelectorAll('picture');
    pictures.forEach((pic) => {
      const link = pic.nextElementSibling;
      if (link && link.tagName === 'A' && link.href) {
        link.innerHTML = pic.outerHTML;
        pic.replaceWith(link);
      }
    });
  }

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });

  wrapImgsInLinks(ul);

  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
