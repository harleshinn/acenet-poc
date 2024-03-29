import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1280px)');

async function fetchNav() {
  const res = await fetch('/nav/navigation.json');
  const json = await res.json();
  return json.data;
}

async function fetchTopNavLinks() {
  const res = await fetch('/nav/nav-top-links.json');
  const json = await res.json();
  return json.data;
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .navigation-wrapper > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('a');
  if (brandLink) {
    const img = document.createElement('img');
    img.src = `${window.hlx.codeBasePath}/icons/ACELogo.svg`;
    img.classList.add('logo-image');
    brandLink.className = 'logo';
    brandLink.closest('.button-container').className = '';
    brandLink.innerText = '';
    brandLink.insertAdjacentElement('afterbegin', img);
  }

  const navData = await fetchNav();
  const navTopLinks = await fetchTopNavLinks();
  let navigationHTML = '';

  if (navTopLinks) {
    navigationHTML = navTopLinks.map((link) => `<a href="${link.linkPath}">${link.linkText}</a>`).join('');
  }

  const navSectionContainer = document.createElement('ul');
  navSectionContainer.className = 'navigation-wrapper';

  if (navData) {
    navData.forEach((section) => {
      navSectionContainer.innerHTML += `
      <li class="nav-item">
        <a class="nav-item-link" href="#">${section.title}</a>
        <div class="nav-drop-wrapper">
          <div class="spotlight">
            ${section.spotlight}
          </div>
          <div class="nav-drop-content">
            <h2>${section.navLinkListSection}</h2>
            <div class="nav-drop-items"> 
            ${section.navLinkListSectionLinks}
            </div>
          </div>
          ${section.navLinkListSectionEnd ? `
          <div class="nav-drop-contact">
            ${section.navLinkListSectionEnd} 
          </div>` : ''}
        </div>
      </li>`;
    });
  }

  const navSections = nav.querySelector('.nav-sections');
  navSections.append(navSectionContainer);
  if (navSections) {
    navSections.querySelectorAll(':scope .navigation-wrapper > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', (event) => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          const clickedNavItem = event.target.closest('.nav-drop');
          if (clickedNavItem) {
            const navDropWrapper = clickedNavItem.querySelector('.nav-drop-wrapper');
            const navDropWrappers = navSections.querySelectorAll('.nav-drop-wrapper');
            navDropWrappers.forEach((wrapper) => {
              if (wrapper !== navDropWrapper) {
                wrapper.classList.remove('show');
              }
            });
            if (navDropWrapper) {
              navDropWrapper.classList.toggle('show');
            }
          }
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  const topNav = document.createElement('div');
  topNav.className = 'nav-top-links';
  topNav.insertAdjacentHTML('afterbegin', navigationHTML);
  const navTools = nav.querySelector('.nav-tools');
  topNav.append(navTools);

  const navigationObserver = new ResizeObserver((entries) => {
    entries.forEach(() => {
      if (isDesktop.matches === true) {
        nav.insertAdjacentElement('beforebegin', topNav);
      } else {
        navSections.insertAdjacentElement('beforeend', topNav);
      }
    });
  });

  navigationObserver.observe(nav);
  block.append(navWrapper);
}
