export default function decorate(block) {
    const articleHeroContainer = block.querySelector('div:first-child');
    articleHeroContainer.className = 'article-hero-image';
  
    const articleHeroTabsContainer = block.querySelector('div:nth-child(2)');
    articleHeroTabsContainer.className = 'article-hero-tabs-container';

    const articleHeroTabs = articleHeroTabsContainer.querySelectorAll('div');

    articleHeroTabs.forEach((div, index) => {
        div.classList.add('article-hero-tab', `tab-0${index + 1}`);
        div.addEventListener('click', function () {
            const tabText = div.textContent.trim().replace(/\s+/g, '-').toLowerCase();
            const targetElement = document.getElementById(tabText);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });    
  }