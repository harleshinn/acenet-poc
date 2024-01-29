import { createOptimizedPicture } from '../../scripts/aem.js';

async function fetchArticles() {
  const res = await fetch('/query-index.json');
  const json = await res.json();
  return json.data;
}

function buildArticle(article) {
  const picture = createOptimizedPicture(article.image, article.imageAlt, true, [{ width: '750' }]);
  const articleEl = document.createElement('li');
  articleEl.innerHTML = `<div class="card-wrapper"><a href="${article.path}" class="article-card-link">
  ${picture.outerHTML}
  <div class="article-card-content">
      <span class="article-card-category">${article.category}</span>
      <span class="article-card-date">${article.date}</span>
      <h3 class="article-card-title">${article.title}</h3>
  </div>
  <div class="article-card-overlay">
      <span class="article-card-category">${article.category}</span>
      <span class="article-card-date">${article.date}</span>
      <p class="article-card-description">${article.description}</p>
      <a href="${article.path}" class="button">Read more</a>
  </div>
  </a></div>
  `;
  articleEl.classList.add('article-card');

  return articleEl;
}

export default async function decorate(block) {
  const ARTICLES_PER_PAGE = 8;

  // Create container
  const articlesContainer = document.createElement('ul');
  articlesContainer.className = 'article-cards';

  // Fetch articles
  const articlesData = await fetchArticles();
  const articlesCount = articlesData.length;
  let articlesOffset = 0;
  let pageMax = ARTICLES_PER_PAGE;

  // Create article elements
  Array.from(articlesData).forEach((article, index) => {
    const articleEl = buildArticle(article);
    articlesContainer.appendChild(articleEl);

    if (index >= ARTICLES_PER_PAGE) {
      articleEl.style.display = 'none';
    } else {
      articlesOffset += 1;
    }
  });

  // Add button and number of articles
  const articles = Array.from(articlesContainer.childNodes);
  const loadMoreButton = document.createElement('button');
  loadMoreButton.setAttribute('type', 'button');
  loadMoreButton.classList.add('secondary-button');
  loadMoreButton.innerText = 'Load more';

  loadMoreButton.addEventListener('click', () => {
    // Load more articles
    pageMax = Math.min(articlesOffset + ARTICLES_PER_PAGE, articlesCount);
    articles.slice(articlesOffset, pageMax).forEach((article) => {
      article.style.display = '';
      articlesOffset += 1;
    });

    if (articlesOffset === articlesCount) {
      loadMoreButton.style.display = 'none';
    }
  });

  block.appendChild(articlesContainer);
  block.appendChild(loadMoreButton);
}
