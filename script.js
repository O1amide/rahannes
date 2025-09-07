// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initFormHandling();
    initPropertyFilters();
    initAnimations();
    initMobileMenu();
    initPropertyActions();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const hamburger = document.querySelector('.hamburger');
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.property-card, .feature, .testimonial-card, .stat');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Form handling
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    showNotification('Thank you! Your inquiry has been sent successfully. We\'ll get back to you soon.', 'success');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
}

// Form validation
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message with at least 10 characters');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        font-family: inherit;
    `;
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    document.body.appendChild(notification);
}

// Property filters (for listings page)
function initPropertyFilters() {
    const filterBtn = document.querySelector('.filter-btn');
    const priceRange = document.getElementById('priceRange');
    const propertyType = document.getElementById('propertyType');
    const location = document.getElementById('location');
    const bedrooms = document.getElementById('bedrooms');
    const propertiesGrid = document.getElementById('propertiesGrid');
    
    if (filterBtn && propertiesGrid) {
        filterBtn.addEventListener('click', function() {
            filterProperties();
        });
        
        // Auto-filter on change
        [priceRange, propertyType, location, bedrooms].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', filterProperties);
            }
        });
    }
    
    function filterProperties() {
        const properties = propertiesGrid.querySelectorAll('.property-card');
        const filters = {
            price: priceRange ? priceRange.value : '',
            type: propertyType ? propertyType.value : '',
            location: location ? location.value : '',
            bedrooms: bedrooms ? bedrooms.value : ''
        };
        
        properties.forEach(property => {
            let show = true;
            
            // Price filter
            if (filters.price) {
                const propertyPrice = parseInt(property.dataset.price);
                const [min, max] = filters.price.includes('-') 
                    ? filters.price.split('-').map(p => parseInt(p))
                    : [parseInt(filters.price.replace('+', '')), Infinity];
                
                if (propertyPrice < min || (max !== Infinity && propertyPrice > max)) {
                    show = false;
                }
            }
            
            // Type filter
            if (filters.type && property.dataset.type !== filters.type) {
                show = false;
            }
            
            // Location filter
            if (filters.location && property.dataset.location !== filters.location) {
                show = false;
            }
            
            // Bedrooms filter
            if (filters.bedrooms) {
                const propertyBedrooms = parseInt(property.dataset.bedrooms);
                const minBedrooms = parseInt(filters.bedrooms.replace('+', ''));
                
                if (propertyBedrooms < minBedrooms) {
                    show = false;
                }
            }
            
            // Show/hide property with animation
            if (show) {
                property.style.display = 'block';
                setTimeout(() => {
                    property.style.opacity = '1';
                    property.style.transform = 'scale(1)';
                }, 10);
            } else {
                property.style.opacity = '0';
                property.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    property.style.display = 'none';
                }, 300);
            }
        });
        
        // Show message if no properties found
        const visibleProperties = Array.from(properties).filter(p => p.style.display !== 'none');
        showFilterResults(visibleProperties.length);
    }
    
    function showFilterResults(count) {
        let resultMessage = document.querySelector('.filter-results');
        
        if (!resultMessage) {
            resultMessage = document.createElement('div');
            resultMessage.className = 'filter-results';
            resultMessage.style.cssText = `
                text-align: center;
                padding: 2rem;
                color: #666;
                font-size: 1.1rem;
            `;
            propertiesGrid.parentNode.insertBefore(resultMessage, propertiesGrid);
        }
        
        if (count === 0) {
            resultMessage.innerHTML = `
                <i class="fas fa-search" style="font-size: 2rem; color: #d4af37; margin-bottom: 1rem; display: block;"></i>
                <p>No properties match your current filters. Try adjusting your search criteria.</p>
            `;
            resultMessage.style.display = 'block';
        } else {
            resultMessage.style.display = 'none';
        }
    }
}

// Property actions (favorites, share, etc.)
function initPropertyActions() {
    // Favorite buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action-btn[title="Add to Favorites"]')) {
            e.preventDefault();
            const btn = e.target.closest('.action-btn');
            const icon = btn.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.style.background = '#d4af37';
                btn.style.color = 'white';
                showNotification('Property added to favorites!', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                btn.style.background = 'rgba(255, 255, 255, 0.9)';
                btn.style.color = '#333';
                showNotification('Property removed from favorites', 'info');
            }
        }
        
        // Share buttons
        if (e.target.closest('.action-btn[title="Share Property"]')) {
            e.preventDefault();
            const propertyCard = e.target.closest('.property-card');
            const propertyTitle = propertyCard.querySelector('.property-title').textContent;
            
            if (navigator.share) {
                navigator.share({
                    title: propertyTitle,
                    text: `Check out this amazing property: ${propertyTitle}`,
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showNotification('Property link copied to clipboard!', 'success');
                });
            }
        }
        
        // Play buttons for property videos
        if (e.target.closest('.play-button')) {
            e.preventDefault();
            const propertyCard = e.target.closest('.property-card');
            const propertyTitle = propertyCard.querySelector('.property-title').textContent;
            showNotification(`Property video for "${propertyTitle}" would play here. Video integration coming soon!`, 'info');
        }
    });
    
    // View toggle for listings page
    const viewBtns = document.querySelectorAll('.view-btn');
    const propertiesGrid = document.getElementById('propertiesGrid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            if (propertiesGrid) {
                if (view === 'list') {
                    propertiesGrid.style.gridTemplateColumns = '1fr';
                    propertiesGrid.querySelectorAll('.property-card').forEach(card => {
                        card.style.display = 'grid';
                        card.style.gridTemplateColumns = '300px 1fr';
                        card.style.maxWidth = 'none';
                    });
                } else {
                    propertiesGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
                    propertiesGrid.querySelectorAll('.property-card').forEach(card => {
                        card.style.display = 'block';
                        card.style.gridTemplateColumns = 'none';
                        card.style.maxWidth = '400px';
                    });
                }
            }
        });
    });
    
    // Load more functionality
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            // Simulate loading more properties
            setTimeout(() => {
                showNotification('All available properties are currently displayed. Check back soon for new listings!', 'info');
                this.innerHTML = 'Load More Properties <i class="fas fa-chevron-down"></i>';
                this.disabled = false;
            }, 2000);
        });
    }
}

// Initialize animations
function initAnimations() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-placeholder');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Counter animation for stats
    const stats = document.querySelectorAll('.stat h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter animation function
function animateCounter(element) {
    const target = element.textContent;
    const isNumber = /^\d+$/.test(target);
    
    if (isNumber) {
        const targetNumber = parseInt(target);
        let current = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                element.textContent = targetNumber + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 40);
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
    
    .filter-results {
        grid-column: 1 / -1;
    }
`;
document.head.appendChild(style);

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(script);
}

// Performance optimization: Lazy loading for images
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if there are lazy images
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
        
        // Close notifications with Escape key
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
    }
});

// Focus management for better accessibility
document.addEventListener('focusin', function(e) {
    if (e.target.matches('.btn, .nav-link, input, textarea, select')) {
        e.target.style.outline = '2px solid #d4af37';
        e.target.style.outlineOffset = '2px';
    }
});

document.addEventListener('focusout', function(e) {
    if (e.target.matches('.btn, .nav-link, input, textarea, select')) {
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
    }
});

console.log('Rahannes Homes website loaded successfully! 🏠✨');

