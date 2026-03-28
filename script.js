// ============================================
// THEME TOGGLE
// ============================================

const STORAGE_KEY = 'portfolio-theme';

const getInitialTheme = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const applyTheme = (theme) => {
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem(STORAGE_KEY, theme);
    updateThemeIcon(theme);
};

const updateThemeIcon = (theme) => {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
        toggle.innerHTML = theme === 'light' ? '<span class="icon">☀️</span>' : '<span class="icon">🌙</span>';
    }
};

const initThemeToggle = () => {
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);

    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = localStorage.getItem(STORAGE_KEY) || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });

        // Keyboard shortcut: Alt + T for theme toggle
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                toggle.click();
            }
        });
    }
};

// ============================================
// NAVIGATION ACTIVE STATE
// ============================================

const initNavigation = () => {
    const navLinks = Array.from(document.querySelectorAll('nav a[data-section]'));
    const sections = navLinks
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    const setActive = (sectionId) => {
        navLinks.forEach(a => {
            const isActive = a.getAttribute('href') === `#${sectionId}`;
            a.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    };

    // IntersectionObserver for active section highlighting
    const observerOptions = {
        rootMargin: '-25% 0px -60% 0px',
        threshold: [0.1, 0.2, 0.35, 0.5]
    };

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) {
            setActive(visible.target.id);
        }
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
};

// ============================================
// COPY TO CLIPBOARD
// ============================================

const initCopyToClipboard = () => {
    const copyables = document.querySelectorAll('[data-copyable]');

    copyables.forEach(el => {
        el.addEventListener('click', async (e) => {
            if (el.tagName === 'A' && (el.href.startsWith('mailto:') || el.href.startsWith('tel:'))) {
                e.preventDefault();
            }

            try {
                let value = '';

                if (el.href?.startsWith('mailto:')) {
                    value = el.href.replace('mailto:', '');
                } else if (el.href?.startsWith('tel:')) {
                    value = el.href.replace('tel:', '');
                } else {
                    value = el.textContent.trim();
                }

                await navigator.clipboard.writeText(value);

                // Show feedback with animation
                const originalText = el.textContent;
                const originalClass = el.className;
                el.textContent = '✓ Copied!';
                el.style.color = 'var(--accent-2)';
                el.style.fontWeight = '700';

                setTimeout(() => {
                    el.textContent = originalText;
                    el.style.color = '';
                    el.style.fontWeight = '';
                }, 1200);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });

        // Add cursor pointer and enhance hover state
        el.style.cursor = 'pointer';
    });
};

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================

const initDynamicYear = () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
};

// ============================================
// SMOOTH SCROLL ENHANCEMENT
// ============================================

const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// ============================================
// SCROLL ANIMATIONS & FADE-IN ON LOAD
// ============================================

const initScrollAnimations = () => {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and items
    const elementsToObserve = document.querySelectorAll(
        '.project-card, .education-card, .contact-card, .skill-group, .timeline-item, .stat-card'
    );

    elementsToObserve.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.05}s, transform 0.6s ease-out ${index * 0.05}s`;
        observer.observe(el);
    });
};

// ============================================
// PARALLAX EFFECT ON SCROLL
// ============================================

const initParallaxEffect = () => {
    const heroCircle = document.querySelector('.hero-circle');
    if (!heroCircle) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const elementOffset = heroCircle.parentElement.offsetTop;

        if (window.innerWidth > 768) {
            heroCircle.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }, { passive: true });
};

// ============================================
// MOUSE TRACKING EFFECT
// ============================================

const initMouseTrackingEffect = () => {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;

        const x = e.clientX;
        const y = e.clientY;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const offsetX = (x - centerX) * 0.02;
        const offsetY = (y - centerY) * 0.02;

        const heroVisual = heroContent.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
    });
};

// ============================================
// KEYBOARD NAVIGATION
// ============================================

const initKeyboardNavigation = () => {
    const navLinks = Array.from(document.querySelectorAll('nav a[data-section]'));

    document.addEventListener('keydown', (e) => {
        // Alt + Arrow navigation
        if (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
            const currentIndex = navLinks.findIndex(a =>
                a.getAttribute('aria-current') === 'true'
            );

            let nextIndex = currentIndex;

            if (e.key === 'ArrowRight' && currentIndex < navLinks.length - 1) {
                nextIndex = currentIndex + 1;
                e.preventDefault();
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                nextIndex = currentIndex - 1;
                e.preventDefault();
            }

            if (nextIndex !== currentIndex) {
                const nextLink = navLinks[nextIndex];
                nextLink.click();
                nextLink.focus();
            }
        }
    });
};

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================

const initRippleEffect = () => {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            // Remove existing ripples
            const existingRipples = this.querySelectorAll('.ripple');
            existingRipples.forEach(r => r.remove());

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
};

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

const initScrollToTopButton = () => {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);

    // Add styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent), var(--accent-2));
            color: white;
            border: none;
            cursor: pointer;
            font-size: 24px;
            font-weight: bold;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 99;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        }

        .scroll-to-top.show {
            opacity: 1;
            visibility: visible;
        }

        .scroll-to-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(74, 144, 226, 0.4);
        }

        .scroll-to-top:active {
            transform: translateY(-1px);
        }

        @media (max-width: 768px) {
            .scroll-to-top {
                width: 45px;
                height: 45px;
                font-size: 20px;
                bottom: 20px;
                right: 20px;
            }
        }
    `;
    document.head.appendChild(style);

    // Show/hide button based on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('show');
        } else {
            scrollButton.classList.remove('show');
        }
    }, { passive: true });

    // Scroll to top on click
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// ============================================
// PERFORMANCE: REQUEST ANIMATION FRAME
// ============================================

const initPerformanceOptimization = () => {
    // Use RAF for scroll events
    let ticking = false;
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        lastScrollY = window.pageYOffset;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Animations will use RAF internally
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
};

// ============================================
// INITIALIZATION
// ============================================

const init = () => {
    // Core features
    initThemeToggle();
    initNavigation();
    initCopyToClipboard();
    initDynamicYear();
    initSmoothScroll();

    // Animation features
    initScrollAnimations();
    initParallaxEffect();
    initMouseTrackingEffect();

    // Interactive features
    initKeyboardNavigation();
    initRippleEffect();
    initScrollToTopButton();

    // Performance
    initPerformanceOptimization();

    // Log initialization
    console.log('✅ Portfolio initialized successfully with all features enabled');
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Portfolio tab is hidden');
    } else {
        console.log('Welcome back!');
    }
});
