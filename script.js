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
                target.scrollIntoView({ behavior: 'smooth' });
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

                // Show feedback
                const originalText = el.textContent;
                el.textContent = '✓ Copied';
                el.style.color = 'var(--accent-2)';

                setTimeout(() => {
                    el.textContent = originalText;
                    el.style.color = '';
                }, 1200);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });

        // Add cursor pointer
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
// SCROLL ANIMATIONS
// ============================================

const initScrollAnimations = () => {
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
    document.querySelectorAll(
        '.project-card, .education-card, .contact-card, .skill-group, .timeline-item'
    ).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
};

// ============================================
// KEYBOARD NAVIGATION
// ============================================

const initKeyboardNavigation = () => {
    const navLinks = Array.from(document.querySelectorAll('nav a[data-section]'));

    document.addEventListener('keydown', (e) => {
        // Alt + Arrow navigation
        if (e.altKey) {
            const currentIndex = navLinks.findIndex(a =>
                a.getAttribute('aria-current') === 'true'
            );

            let nextIndex = currentIndex;

            if (e.key === 'ArrowRight' && currentIndex < navLinks.length - 1) {
                nextIndex = currentIndex + 1;
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                nextIndex = currentIndex - 1;
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
// INITIALIZATION
// ============================================

const init = () => {
    initThemeToggle();
    initNavigation();
    initCopyToClipboard();
    initDynamicYear();
    initSmoothScroll();
    initScrollAnimations();
    initKeyboardNavigation();

    // Log initialization
    console.log('Portfolio initialized successfully');
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
