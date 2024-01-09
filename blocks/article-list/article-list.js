import { createOptimizedPicture } from '../../scripts/aem.js';

async function fetchArticles() {
  const res = await fetch('/query-index.json');
  const json = await res.json();
  console.log(json.data)
  return json.data;
}

function buildArticle(article) {
  const picture = createOptimizedPicture(article.image, article.imageAlt, true, [{ width: '750' }]);
  const articleEl = document.createElement('li');
  articleEl.innerHTML = `<div class="card-wrapper"><a href="${article.path}" class="article-card__link">
  ${picture.outerHTML}
  <div class="article-card__content">
      <span class="article-card__category">${article.category}</span>
      <span class="article-card__date">${article.date}</span>
      <h3 class="article-card__title">${article.title}</h3>
  </div>
  <div class="article-card__overlay">
      <span class="article-card__category">${article.category}</span>
      <span class="article-card__date">${article.date}</span>
      <p class="article-card__description">${article.description}</p>
      <a href="${article.path}" class="button">Read more</a>
  </div>
  </a></div>
  `;
  articleEl.classList.add('article-card');

  return articleEl;
}

export default async function decorate(block) {
  const ARTICLES_PER_PAGE = 4;

  // Create container
  const articlesContainer = document.createElement('ul');
  articlesContainer.className = 'article-cards';

  // Fetch articles
  const articlesData = await fetchArticles();
  const articlesCount = articlesData.length;
  let articlesOffset = 0;
  let pageMax = ARTICLES_PER_PAGE;

  // Create article elements
  for (let article of articlesData) {
      const articleEl = buildArticle(article);
      articlesContainer.appendChild(articleEl);
      
      if (articlesOffset >= ARTICLES_PER_PAGE) {
          articleEl.style.display = 'none';
      } else {
          articlesOffset++;
      }
  }

  // Add button and number of articles
  const articles = articlesContainer.childNodes;
  const loadMoreButton = document.createElement('button');
  loadMoreButton.setAttribute('type', 'button');
  loadMoreButton.classList.add('secondary-button');
  loadMoreButton.innerText = 'Load more';

  loadMoreButton.addEventListener('click', function() {
    // Load more articles
    pageMax = Math.min(articlesOffset + ARTICLES_PER_PAGE, articlesCount);
    while (articlesOffset != pageMax) {
      articles[articlesOffset].style.display = '';
      articlesOffset += 1;
    }

    paginationText.innerText = `1 - ${pageMax} of ${articlesCount}`;
    if (articlesOffset === articlesCount) this.remove();
  });

  block.appendChild(articlesContainer);
  block.appendChild(loadMoreButton);
}
