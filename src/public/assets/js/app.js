// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeContactForm();
    initializeScrollEffects();
});

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
        });
    });

    // Update active navigation link based on scroll position
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });

        input.addEventListener('input', function() {
            clearFieldError(input);
        });
    });
}

// Form validation
function validateForm(formData) {
    const errors = [];

    const name = formData.get('contact_form[name]')?.trim() || '';
    const email = formData.get('contact_form[email]')?.trim() || '';
    const subject = formData.get('contact_form[subject]')?.trim() || '';
    const message = formData.get('contact_form[message]')?.trim() || '';

    if (!name) {
        errors.push({ field: 'name', message: 'Name is required' });
    } else if (name.length < 2) {
        errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
    }

    if (!email) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (!isValidEmail(email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (!subject) {
        errors.push({ field: 'subject', message: 'Subject is required' });
    } else if (subject.length < 5) {
        errors.push({ field: 'subject', message: 'Subject must be at least 5 characters long' });
    }

    if (!message) {
        errors.push({ field: 'message', message: 'Message is required' });
    } else if (message.length < 10) {
        errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
    }

    return errors;
}

// Validate individual field
function validateField(input) {
    const formData = new FormData();
    formData.append(input.name, input.value);

    const errors = validateForm(formData).filter(error => error.field === input.name);

    if (errors.length > 0) {
        displayFieldError(input, errors[0].message);
    } else {
        clearFieldError(input);
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Display form errors
function displayFormErrors(errors) {
    errors.forEach(error => {
        const errorElement = document.getElementById(error.field + 'Error');
        const field = document.getElementById(error.field);

        if (errorElement) {
            errorElement.textContent = error.message;
            errorElement.style.opacity = '1';
        }

        if (field) {
            field.style.borderColor = 'rgb(var(--accent-red))';
        }
    });
}

// Display field error
function displayFieldError(field, message) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.opacity = '1';
    }
    field.style.borderColor = 'rgb(var(--accent-red))';
}

// Clear field error
function clearFieldError(field) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.opacity = '0';
    }
    field.style.borderColor = 'rgb(var(--border-default))';
}

// Clear all form errors
function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.opacity = '0';
    });

    const fields = document.querySelectorAll('#contactForm input, #contactForm textarea');
    fields.forEach(field => {
        field.style.borderColor = 'rgb(var(--border-default))';
    });
}

// Submit form (simulation)
function submitForm(formData) {
    const formStatus = document.getElementById('formStatus');
    const submitButton = document.querySelector('.btn-submit');

    if (!formStatus || !submitButton) return;

    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;

        // Show success message
        formStatus.textContent = 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.';
        formStatus.className = 'form-status success';

        // Clear form
        const form = document.getElementById('contactForm');
        if (form) form.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            formStatus.style.opacity = '0';
            setTimeout(() => {
                formStatus.className = 'form-status';
                formStatus.textContent = '';
            }, 300);
        }, 5000);

    }, 2000);
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 64; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility function for safe element access
function safeQuerySelector(selector, callback) {
    const element = document.querySelector(selector);
    if (element && typeof callback === 'function') {
        callback(element);
    }
}
