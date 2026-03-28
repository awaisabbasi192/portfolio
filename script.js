// ============================================
// PARTICLE BACKGROUND
// ============================================

const initParticleBackground = () => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = `rgba(74, 144, 226, ${Math.random() * 0.5})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
};

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
// ANIMATED COUNTERS
// ============================================

const initAnimatedCounters = () => {
    const counters = document.querySelectorAll('[data-target]');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 30);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => observer.observe(counter));
};

// ============================================
// SKILLS PROGRESS BARS
// ============================================

const initSkillBars = () => {
    const bars = document.querySelectorAll('.skill-bar');

    const animateBar = (bar) => {
        const percent = parseInt(bar.getAttribute('data-percent'));
        bar.style.width = percent + '%';
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateBar(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    bars.forEach(bar => observer.observe(bar));
};

// ============================================
// PROJECT FILTER & SEARCH
// ============================================

const initProjectFilter = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('projectSearch');
    const projectCards = document.querySelectorAll('.project-card');

    const filterProjects = () => {
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        const searchTerm = (searchInput?.value || '').toLowerCase();

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const tags = card.getAttribute('data-tags') || '';
            const text = card.textContent.toLowerCase();

            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = text.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                card.style.display = '';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProjects();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterProjects);
    }
};

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================

const initTestimonialsCarousel = () => {
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (cards.length === 0) return;

    let currentIndex = 0;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer?.appendChild(dot);
    });

    const updateCarousel = () => {
        cards.forEach((card, i) => {
            card.classList.remove('active', 'prev');
            if (i === currentIndex) {
                card.classList.add('active');
            } else if (i < currentIndex) {
                card.classList.add('prev');
            }
        });

        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    const goToSlide = (index) => {
        currentIndex = index;
        updateCarousel();
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    };

    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);

    updateCarousel();
};

// ============================================
// CONTACT FORM
// ============================================

const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const statusEl = form.querySelector('.form-status');

        // Form validation
        let isValid = true;
        form.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));

        if (!data.name.trim()) {
            showError(form, 'name', 'Name is required');
            isValid = false;
        }

        if (!isValidEmail(data.email)) {
            showError(form, 'email', 'Valid email is required');
            isValid = false;
        }

        if (!data.subject.trim()) {
            showError(form, 'subject', 'Subject is required');
            isValid = false;
        }

        if (!data.message.trim()) {
            showError(form, 'message', 'Message is required');
            isValid = false;
        }

        if (!isValid) return;

        // Simulate sending (in production, this would call your backend)
        statusEl.textContent = 'Sending...';
        statusEl.className = 'form-status show';

        setTimeout(() => {
            statusEl.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
            statusEl.className = 'form-status show success';
            form.reset();

            setTimeout(() => {
                statusEl.classList.remove('show');
            }, 5000);
        }, 1500);
    });

    function showError(form, fieldName, message) {
        const input = form.querySelector(`#${fieldName}`);
        const error = input.parentElement.querySelector('.form-error');
        error.textContent = message;
        error.classList.add('show');
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
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

                const originalText = el.textContent;
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

        el.style.cursor = 'pointer';
    });
};

// ============================================
// DOWNLOAD CV
// ============================================

const initDownloadCV = () => {
    const downloadBtn = document.getElementById('downloadCVBtn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Create a simple text CV
        const cvContent = `ZARQA ZULFIQAR
Email: zarqa028@gmail.com
Phone: +(92) 321-3243848
Location: Lahore, Pakistan

PROFESSIONAL SUMMARY
Cyber Security professional with expertise in threat analysis, malware detection, and project management.

WORK EXPERIENCE
- Assistant (Anti Money Laundering) - FBR, Pakistan (June-August 2025)
- Project Management Intern - Data Analytics Platform (August 2024)

EDUCATION
- BS Cyber Security, SUPERIOR University (2023-2026)
- Inter FSc, KIPS (2021-2023)

SKILLS
Programming: Python, HTML/CSS, C++, Linux
Cybersecurity: Malware Analysis, Digital Forensics, Threat Detection
Project Management: SRS Gathering, Team Management, Stakeholder Analysis
Tools: MS SQL Server, MS Excel, ChatGPT, Office 365`;

        const blob = new Blob([cvContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Zarqa_Zulfiqar_CV.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
};

// ============================================
// DYNAMIC YEAR
// ============================================

const initDynamicYear = () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
};

// ============================================
// SMOOTH SCROLL
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
// PARALLAX EFFECT
// ============================================

const initParallaxEffect = () => {
    const heroCircle = document.querySelector('.hero-circle');
    if (!heroCircle) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (window.innerWidth > 768) {
            heroCircle.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }, { passive: true });
};

// ============================================
// MOUSE TRACKING
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
// RIPPLE EFFECT
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

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('show');
        } else {
            scrollButton.classList.remove('show');
        }
    }, { passive: true });

    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// ============================================
// INITIALIZATION
// ============================================

const init = () => {
    // Phase 1: Foundation features
    initPageLoader();
    initScrollProgressBar();
    initMobileMenu();
    initCustomCursor();
    initBreadcrumbs();

    // Particle background
    initParticleBackground();

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

    // New features
    initAnimatedCounters();
    initSkillBars();
    initProjectFilter();
    initTestimonialsCarousel();
    initContactForm();
    initDownloadCV();

    // Interactive features
    initKeyboardNavigation();
    initRippleEffect();
    initScrollToTopButton();

    // Phase 2: Content sections
    initBlogFilter();
    initFAQAccordion();

    console.log('✅ Portfolio fully loaded with all premium features!');
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
        console.log('Portfolio tab hidden');
    } else {
        console.log('Welcome back to the portfolio!');
    }
});

// ============================================
// PHASE 1: PAGE LOADER
// ============================================

const initPageLoader = () => {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    });

    setTimeout(() => {
        loader.classList.add('hidden');
    }, 3000);
};

// ============================================
// PHASE 1: SCROLL PROGRESS BAR
// ============================================

const initScrollProgressBar = () => {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
};

// ============================================
// PHASE 1: MOBILE MENU
// ============================================

const initMobileMenu = () => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isOpen);
        menu.setAttribute('aria-hidden', isOpen);
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.setAttribute('aria-expanded', false);
            menu.setAttribute('aria-hidden', true);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggle.setAttribute('aria-expanded', false);
            menu.setAttribute('aria-hidden', true);
        }
    });
};

// ============================================
// PHASE 1: CUSTOM CURSOR
// ============================================

const initCustomCursor = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = (mouseX - 15) + 'px';
        cursor.style.top = (mouseY - 15) + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
    });
};

// ============================================
// PHASE 1: BREADCRUMBS
// ============================================

const initBreadcrumbs = () => {
    const navLinks = document.querySelectorAll('nav a[data-section]');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const section = link.getAttribute('data-section');
            updateBreadcrumbs(section);
        });
    });
};

function updateBreadcrumbs(sectionId) {
    const breadcrumbs = document.querySelector('.breadcrumb-current');
    if (breadcrumbs) {
        const sectionElement = document.querySelector(`#${sectionId}`);
        const sectionTitle = sectionElement?.querySelector('.section-title')?.textContent ||
                            sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        breadcrumbs.textContent = sectionTitle;
    }
}

// ============================================
// PHASE 2: BLOG FILTERING AND SEARCH
// ============================================

const initBlogFilter = () => {
    const searchInput = document.getElementById('blogSearch');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (!searchInput) return;

    const filterBlogs = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';

        blogCards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('.blog-title')?.textContent.toLowerCase() || '';
            const excerpt = card.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';

            const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;

            if (matchesSearch && matchesCategory) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    };

    searchInput.addEventListener('input', filterBlogs);

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterBlogs();
        });
    });
};

// ============================================
// PHASE 2: FAQ ACCORDION
// ============================================

const initFAQAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');

        if (!header || !content) return;

        header.addEventListener('click', () => {
            const isOpen = item.getAttribute('open') !== null;

            if (isOpen) {
                item.removeAttribute('open');
                content.style.display = 'none';
                header.setAttribute('aria-expanded', false);
            } else {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.getAttribute('open') !== null) {
                        otherItem.removeAttribute('open');
                        otherItem.querySelector('.faq-content').style.display = 'none';
                        otherItem.querySelector('.faq-header').setAttribute('aria-expanded', false);
                    }
                });

                item.setAttribute('open', '');
                content.style.display = 'block';
                header.setAttribute('aria-expanded', true);
            }
        });
    });
};

