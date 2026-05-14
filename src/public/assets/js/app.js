let userClickedNav = false;
let clickedSection = '';
let scrollTimeout;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
});

function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(isExpanded));
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', function onNavClick() {
            closeNavigation(navMenu, navToggle);

            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) {
                return;
            }

            clickedSection = href.slice(1);
            userClickedNav = true;
            updateActiveNavLink();

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                userClickedNav = false;
                clickedSection = '';
            }, 1200);
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetSelector = anchor.getAttribute('href');
            if (!targetSelector || targetSelector.length <= 1) {
                return;
            }

            const target = document.querySelector(targetSelector);
            if (!target) {
                return;
            }

            event.preventDefault();
            const offset = getScrollOffset();
            const position = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: position, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    });

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();
}

function closeNavigation(navMenu, navToggle) {
    if (!navMenu || !navToggle) {
        return;
    }

    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    if (userClickedNav && clickedSection) {
        current = clickedSection;
    } else {
        const scrollPos = window.scrollY + getScrollOffset() + 80;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = section.getAttribute('id') || '';
            }
        });

        if (!current) {
            current = 'home';
        }
    }

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

function getScrollOffset() {
    const nav = document.querySelector('.nav');
    if (!nav) {
        return 84;
    }

    return nav.offsetHeight + 18;
}
