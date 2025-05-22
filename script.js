// DOM Elements
const loader = document.querySelector('.loader');
const themeToggle = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const typingText = document.querySelector('.typing-text');
const sections = document.querySelectorAll('section');
const reviewItems = document.querySelectorAll('.review-item');
const shapes = document.querySelectorAll('.shape');

// Words for typing animation
const words = ['Style', 'Confidence', 'Fashion', 'Elegance', 'Trends'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isWaiting = false;

// Theme handling
const theme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', theme);

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Mobile navigation
navToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth scroll for navigation links ( should be changed to a better function)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Typing animation
function type() {
    const currentWord = words[wordIndex];
    const shouldDelete = isDeleting && charIndex > 0;
    const shouldWrite = !isDeleting && charIndex < currentWord.length;

    if (shouldWrite) {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    } else if (shouldDelete) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    }

    // Handle word completion
    if (!isDeleting && charIndex === currentWord.length) {
        isWaiting = true;
        setTimeout(() => {
            isDeleting = true;
            isWaiting = false;
        }, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
    }

    // Set typing speed
    const typingSpeed = isDeleting ? 100 : 200;
    const delay = isWaiting ? 0 : typingSpeed;

    setTimeout(type, delay);
}

// Start typing animation
type();

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.25,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in class and observe all sections
sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Initialize progress bars
reviewItems.forEach(item => {
    const rating = item.getAttribute('data-rating');
    const progress = item.querySelector('.progress');
    progress.style.setProperty('--progress', `${rating}%`);
});

// Enhanced parallax effect for shapes and review panel
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 2;
        const moveX = (mouseX * speed - speed/2) * 30;
        const moveY = (mouseY * speed - speed/2) * 30;
        const rotate = (mouseX - 0.5) * 20;
        
        shape.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;
    });

    // Subtle movement for review panel
    const reviewPanel = document.querySelector('.review-panel');
    if (reviewPanel) {
        const panelX = (mouseX - 0.5) * 10;
        const panelY = (mouseY - 0.5) * 10;
        reviewPanel.style.transform = `translate(${panelX}px, ${panelY}px)`;
    }
});

// Smooth scroll with enhanced animation
document.querySelectorAll('a[href^="#"], [data-scroll-to]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href') || `#${this.getAttribute('data-scroll-to')}`;
        const target = document.querySelector(targetId);
        
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeOutCubic(progress);
                
                window.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3);
            }

            requestAnimationFrame(animation);

            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Add hover effect to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1000);
    });
});

// Animate review panel on scroll
const reviewPanel = document.querySelector('.review-panel');
if (reviewPanel) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        reviewPanel.style.transform = `translate3d(0, ${rate}px, 0)`;
    });
}

// Handle testimonials scroll snap on mobile
const testimonialContainer = document.querySelector('.testimonials-container');
let isScrolling;

if (testimonialContainer) {
    testimonialContainer.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const scrollLeft = testimonialContainer.scrollLeft;
            const itemWidth = testimonialContainer.querySelector('.testimonial').offsetWidth;
            const newScrollLeft = Math.round(scrollLeft / itemWidth) * itemWidth;
            
            testimonialContainer.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }, 150);
    });
}

// Handle scroll-to buttons
document.querySelectorAll('[data-scroll-to]').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-scroll-to');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Performance optimization: Cache DOM queries
const DOM = {
    loader: document.querySelector('.loader'),
    themeToggle: document.querySelector('.theme-toggle'),
    navToggle: document.querySelector('.nav-toggle'),
    navLinks: document.querySelector('.nav-links'),
    typingText: document.querySelector('.typing-text'),
    sections: document.querySelectorAll('section'),
    reviewItems: document.querySelectorAll('.review-item'),
    shapes: document.querySelectorAll('.shape'),
    buttons: document.querySelectorAll('.btn'),
    reviewPanel: document.querySelector('.review-panel'),
    featureCards: document.querySelectorAll('.feature-card')
};

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// RAF for smooth animations
let rafId = null;

// Magnetic button effect
DOM.buttons.forEach(btn => {
    const magnetic = document.createElement('div');
    magnetic.className = 'btn-magnetic';
    btn.parentNode.insertBefore(magnetic, btn);
    magnetic.appendChild(btn);

    magnetic.addEventListener('mousemove', (e) => {
        const rect = magnetic.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const strength = 20;
        const pull = 0.1;
        
        btn.style.transform = `translate(${x * pull}px, ${y * pull}px)`;
        
        // Gradient follow effect
        const gradientX = (e.clientX - rect.left) / rect.width * 100;
        const gradientY = (e.clientY - rect.top) / rect.height * 100;
        btn.style.background = `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(255,255,255,0.2), transparent)`;
    });

    magnetic.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.background = '';
    });
});

// Optimized parallax effect
function updateParallax(e) {
    if (rafId) {
        cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        DOM.shapes.forEach((shape, index) => {
            const speed = (index + 1) * 2;
            const moveX = (mouseX * speed - speed/2) * 30;
            const moveY = (mouseY * speed - speed/2) * 30;
            const rotate = (mouseX - 0.5) * 20;
            
            shape.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${rotate}deg)`;
        });

        if (DOM.reviewPanel) {
            const panelX = (mouseX - 0.5) * 10;
            const panelY = (mouseY - 0.5) * 10;
            DOM.reviewPanel.style.transform = `translate3d(${panelX}px, ${panelY}px, 0)`;
        }
    });
}

// Optimized scroll handling
const optimizedScroll = debounce(() => {
    const scrolled = window.pageYOffset;
    if (DOM.reviewPanel) {
        DOM.reviewPanel.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
    }
}, 10);

// Enhanced smooth scroll
function smoothScroll(target, duration) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Optimized event listeners
document.addEventListener('mousemove', debounce(updateParallax, 10));
window.addEventListener('scroll', optimizedScroll);

// Initialize progress bars with IntersectionObserver
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.querySelector('.progress');
            const rating = entry.target.getAttribute('data-rating');
            progress.style.setProperty('--progress', rating / 100);
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

DOM.reviewItems.forEach(item => progressObserver.observe(item)); 