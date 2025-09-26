// Portfolio Website JavaScript
// Author: Rohit Sharma
// Version: 1.0.0

'use strict';

// DOM Elements
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.querySelector('nav');
const contactForm = document.getElementById('contactForm');

// State Management
const state = {
    isMenuOpen: false,
    isScrolled: false,
    animatedElements: new Set()
};

// Utility Functions
const utils = {
    // Throttle function for performance optimization
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Debounce function for performance optimization
    debounce: (func, delay) => {
        let timeoutId;
        return function() {
            const args = arguments;
            const context = this;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        }
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    smoothScrollTo: (element, offset = 80) => {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
};

// Navigation Functions
const navigation = {
    // Toggle mobile menu
    toggleMobileMenu: () => {
        state.isMenuOpen = !state.isMenuOpen;
        mobileMenu.classList.toggle('hidden');
        
        // Update button icon
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
    },

    // Close mobile menu
    closeMobileMenu: () => {
        if (state.isMenuOpen) {
            state.isMenuOpen = false;
            mobileMenu.classList.add('hidden');
            
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            
            document.body.style.overflow = '';
        }
    },

    // Handle navbar scroll effect
    handleNavbarScroll: utils.throttle(() => {
        const scrolled = window.scrollY > 50;
        
        if (scrolled !== state.isScrolled) {
            state.isScrolled = scrolled;
            navbar.classList.toggle('navbar-scrolled', scrolled);
        }
    }, 10),

    // Handle smooth scrolling for navigation links
    handleSmoothScroll: (e) => {
        const href = e.currentTarget.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                utils.smoothScrollTo(targetElement);
                navigation.closeMobileMenu();
            }
        }
    }
};

// Animation Functions
const animations = {
    // Animate elements when they come into view
    animateOnScroll: utils.throttle(() => {
        const elements = document.querySelectorAll('.animate-fade-in');
        
        elements.forEach(element => {
            if (!state.animatedElements.has(element)) {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight * 0.8;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    state.animatedElements.add(element);
                }
            }
        });
    }, 50),

    // Initialize scroll progress indicator
    initScrollProgress: () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        return progressBar;
    },

    // Update scroll progress
    updateScrollProgress: utils.throttle((progressBar) => {
        const scrollTop = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / documentHeight) * 100;
        progressBar.style.width = `${scrollPercentage}%`;
    }, 10)
};

// Form Functions
const forms = {
    // Handle contact form submission
    handleContactForm: async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Validate form data
        if (!forms.validateContactForm(data)) {
            return;
        }
        
        // Show loading state
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin ml-2"></i>';
        submitButton.disabled = true;
        
        try {
            // Simulate form submission (replace with actual API call)
            await forms.submitContactForm(data);
            
            // Show success message
            forms.showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            e.target.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            forms.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    },

    // Validate contact form data
    validateContactForm: (data) => {
        const { name, email, subject, message } = data;
        
        if (!name.trim()) {
            forms.showMessage('Please enter your name.', 'error');
            return false;
        }
        
        if (!email.trim() || !forms.isValidEmail(email)) {
            forms.showMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        if (!subject.trim()) {
            forms.showMessage('Please enter a subject.', 'error');
            return false;
        }
        
        if (!message.trim()) {
            forms.showMessage('Please enter a message.', 'error');
            return false;
        }
        
        return true;
    },

    // Validate email format
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Simulate form submission (replace with actual API call)
    submitContactForm: (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 2000);
        });
    },

    // Show message to user
    showMessage: (message, type = 'info') => {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message p-4 rounded-lg mb-4 ${
            type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
        }`;
        messageDiv.textContent = message;

        // Insert message before form
        contactForm.insertBefore(messageDiv, contactForm.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
};

// Project Functions
const projects = {
    // Add hover effects to project cards
    initProjectCards: () => {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', projects.handleCardHover);
            card.addEventListener('mouseleave', projects.handleCardLeave);
        });
    },

    // Handle project card hover
    handleCardHover: function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    },

    // Handle project card leave
    handleCardLeave: function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
    }
};

// Skills Functions
const skills = {
    // Initialize skill icons
    initSkillIcons: () => {
        const skillIcons = document.querySelectorAll('.skill-icon');
        
        skillIcons.forEach(icon => {
            icon.addEventListener('mouseenter', skills.handleIconHover);
            icon.addEventListener('mouseleave', skills.handleIconLeave);
        });
    },

    // Handle skill icon hover
    handleIconHover: function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
    },

    // Handle skill icon leave
    handleIconLeave: function() {
        this.style.transform = 'translateY(0) scale(1)';
    }
};

// Theme Functions
const theme = {
    // Initialize theme
    init: () => {
        // Check for saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        theme.setTheme(savedTheme);
    },

    // Set theme
    setTheme: (themeName) => {
        document.documentElement.className = themeName;
        localStorage.setItem('theme', themeName);
    },

    // Toggle theme
    toggle: () => {
        const currentTheme = document.documentElement.className;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        theme.setTheme(newTheme);
    }
};

// Performance Functions
const performance = {
    // Lazy load images
    initLazyLoading: () => {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    },

    // Preload critical resources
    preloadResources: () => {
        const criticalImages = [
            'https://via.placeholder.com/400x400',
            // Add other critical image URLs
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
};

// Error Handling
const errorHandler = {
    // Global error handler
    init: () => {
        window.addEventListener('error', errorHandler.handleError);
        window.addEventListener('unhandledrejection', errorHandler.handlePromiseRejection);
    },

    // Handle JavaScript errors
    handleError: (event) => {
        console.error('JavaScript error:', event.error);
        // You can send error reports to a service like Sentry here
    },

    // Handle promise rejections
    handlePromiseRejection: (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        // You can send error reports to a service like Sentry here
    }
};

// Analytics Functions
const analytics = {
    // Track page views
    trackPageView: () => {
        // Replace with your analytics service (Google Analytics, etc.)
        console.log('Page view tracked');
    },

    // Track user interactions
    trackEvent: (category, action, label = '') => {
        // Replace with your analytics service
        console.log('Event tracked:', { category, action, label });
    }
};

// Accessibility Functions
const accessibility = {
    // Initialize accessibility features
    init: () => {
        accessibility.handleKeyboardNavigation();
        accessibility.handleFocusManagement();
        accessibility.handleReducedMotion();
    },

    // Handle keyboard navigation
    handleKeyboardNavigation: () => {
        document.addEventListener('keydown', (e) => {
            // Handle Escape key to close mobile menu
            if (e.key === 'Escape' && state.isMenuOpen) {
                navigation.closeMobileMenu();
            }
        });
    },

    // Handle focus management
    handleFocusManagement: () => {
        // Add focus indicators for keyboard users
        document.addEventListener('keydown', () => {
            document.body.classList.add('keyboard-navigation');
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    },

    // Handle reduced motion preferences
    handleReducedMotion: () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01s');
        }
    }
};

// Initialization Functions
const init = {
    // Initialize all functionality
    all: () => {
        init.eventListeners();
        init.animations();
        init.components();
        init.performance();
        init.accessibility();
        init.analytics();
    },

    // Initialize event listeners
    eventListeners: () => {
        // Mobile menu toggle
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', navigation.toggleMobileMenu);
        }

        // Navigation links smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', navigation.handleSmoothScroll);
        });

        // Contact form submission
        if (contactForm) {
            contactForm.addEventListener('submit', forms.handleContactForm);
        }

        // Scroll events
        window.addEventListener('scroll', navigation.handleNavbarScroll);
        window.addEventListener('scroll', animations.animateOnScroll);

        // Resize events
        window.addEventListener('resize', utils.debounce(() => {
            // Handle responsive changes
            if (window.innerWidth > 768 && state.isMenuOpen) {
                navigation.closeMobileMenu();
            }
        }, 250));
    },

    // Initialize animations
    animations: () => {
        const progressBar = animations.initScrollProgress();
        
        window.addEventListener('scroll', () => {
            animations.updateScrollProgress(progressBar);
        });

        // Initial animation check
        animations.animateOnScroll();
    },

    // Initialize components
    components: () => {
        projects.initProjectCards();
        skills.initSkillIcons();
        theme.init();
    },

    // Initialize performance optimizations
    performance: () => {
        performance.initLazyLoading();
        performance.preloadResources();
        errorHandler.init();
    },

    // Initialize accessibility features
    accessibility: () => {
        accessibility.init();
    },

    // Initialize analytics
    analytics: () => {
        analytics.trackPageView();
    }
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
    init.all();
    console.log('Portfolio website initialized successfully!');
});

// Window Load Event
window.addEventListener('load', () => {
    // Hide loading spinner if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }

    // Track page load performance
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        utils,
        navigation,
        animations,
        forms,
        projects,
        skills,
        theme,
        performance,
        accessibility,
        analytics
    };
}