let userClickedNav = false;
let clickedSection = '';
let scrollTimeout;

document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeHeroParallax();
    initializeRevealAnimations();
    
    if (!prefersReducedMotion && !isTouchDevice) {
        initializeCustomCursor();
        initializeMagneticButtons();
        initializeHoverGlow();
    }
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

function initializeHeroParallax() {
    if (prefersReducedMotion) {
        return;
    }

    const portrait = document.querySelector('.hero-portrait');
    if (!portrait) {
        return;
    }

    window.addEventListener(
        'scroll',
        () => {
            const y = window.scrollY;
            if (y > 900) {
                return;
            }

            const shift = Math.max(-14, Math.min(14, y * -0.05));
            portrait.style.transform = `rotate(${-1 + shift * 0.05}deg) translateY(${shift}px)`;
        },
        { passive: true }
    );
}

function initializeRevealAnimations() {
    const revealItems = document.querySelectorAll('[data-reveal]');

    if (!revealItems.length) {
        return;
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                // Add staggered delay based on index within parent
                const parent = entry.target.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.querySelectorAll('[data-reveal]'));
                    const index = siblings.indexOf(entry.target);
                    if (index > 0) {
                        entry.target.style.transitionDelay = `${index * 0.1}s`;
                    }
                }

                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -5% 0px'
        }
    );

    revealItems.forEach((item) => observer.observe(item));
}

function initializeCustomCursor() {
    // Create cursor elements
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    
    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth follow for outline
    const render = () => {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(render);
    };
    render();

    // Add hover effects to interactive elements
    const interactables = document.querySelectorAll('a, button, input, textarea, select, [data-magnetic]');
    
    interactables.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorOutline.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorOutline.classList.remove('hover');
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
}

function initializeMagneticButtons() {
    const magnetics = document.querySelectorAll('[data-magnetic]');
    
    magnetics.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Adjust the multiplier to control the strength of the pull
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

function initializeHoverGlow() {
    document.querySelectorAll('.glow-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}
