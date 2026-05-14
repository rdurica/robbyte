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
    initializeHeroParticles();

    if (!prefersReducedMotion && !isTouchDevice) {
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

            const shift = Math.max(-10, Math.min(10, y * -0.03));
            portrait.style.transform = `translateY(${shift}px)`;
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

function initializeHeroParticles() {
    if (prefersReducedMotion) {
        return;
    }

    const hero = document.querySelector('.hero');
    if (!hero) {
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-particles';
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    let isVisible = true;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = hero.offsetWidth * dpr;
        canvas.height = hero.offsetHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = hero.offsetWidth + 'px';
        canvas.style.height = hero.offsetHeight + 'px';
    }

    function createParticles() {
        const count = Math.min(60, Math.floor((canvas.width / window.devicePixelRatio) * 0.08));
        particles = [];
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.4 + 0.1,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }

    function draw() {
        if (!isVisible) {
            animationId = requestAnimationFrame(draw);
            return;
        }

        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);

        ctx.clearRect(0, 0, w, h);

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.pulse += p.pulseSpeed;

            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            const flicker = 0.7 + 0.3 * Math.sin(p.pulse);
            const alpha = p.opacity * flicker;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
            ctx.fill();

            if (p.radius > 1.2) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.15})`;
                ctx.fill();
            }
        });

        // Draw connections between nearby particles
        const connectionDistance = 100;
        const maxConnections = 3;

        for (let i = 0; i < particles.length; i++) {
            let connections = 0;
            for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    connections++;
                }
            }
        }

        animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    const observer = new IntersectionObserver(
        (entries) => {
            isVisible = entries[0].isIntersecting;
        },
        { threshold: 0 }
    );
    observer.observe(hero);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        } else if (!document.hidden && !animationId) {
            draw();
        }
    });
}
