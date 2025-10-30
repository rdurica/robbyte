// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
});

// Track if user just clicked a nav link
let userClickedNav = false;
let clickedSection = '';
let scrollTimeout;

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }

            // Set the clicked section as active immediately
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                clickedSection = href.substring(1);
                userClickedNav = true;

                // Update immediately
                updateActiveNavLink();

                // Keep the clicked section active during smooth scroll
                // Reset after animation likely completes
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    userClickedNav = false;
                    clickedSection = '';
                }, 1200);
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    // If user just clicked a nav link, keep that section active
    if (userClickedNav && clickedSection) {
        current = clickedSection;
    } else {
        const scrollPos = window.scrollY + 100;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Check if we're at the bottom of the page
        const isBottom = windowHeight + window.scrollY >= documentHeight - 50;

        if (isBottom) {
            // If at bottom, activate the last section
            const lastSection = sections[sections.length - 1];
            current = lastSection.getAttribute('id');
        } else if (window.scrollY < 100) {
            // If we're at the very top, set home as active
            current = 'home';
        } else {
            // Find the section that's most visible in the viewport
            let maxScore = 0;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top;
                const sectionBottom = rect.bottom;
                const sectionHeight = rect.height;

                // Calculate how much of the section is visible
                if (sectionTop < windowHeight && sectionBottom > 0) {
                    const visibleTop = Math.max(0, sectionTop);
                    const visibleBottom = Math.min(windowHeight, sectionBottom);
                    const visibleHeight = visibleBottom - visibleTop;

                    // Calculate percentage of section that's visible
                    const visibilityRatio = visibleHeight / sectionHeight;

                    // Prefer sections that are in the upper part of viewport
                    let positionBonus = 0;
                    if (sectionTop < 200 && sectionTop >= 0) {
                        positionBonus = 0.3; // Boost score if section is near top
                    }

                    const score = visibilityRatio + positionBonus;

                    if (score > maxScore) {
                        maxScore = score;
                        current = section.getAttribute('id');
                    }
                }
            });
        }
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Account for fixed header + extra space for better section detection
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}
