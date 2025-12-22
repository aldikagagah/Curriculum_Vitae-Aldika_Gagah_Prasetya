/**
 * Main JavaScript for Portfolio Website
 * Handles Theme Switching (Dark/Light) and Scroll Animations
 */

class ThemeManager {
    constructor() {
        this.themeToggleBtns = document.querySelectorAll('.theme-toggle');
        this.htmlElement = document.documentElement;
        this.init();
    }

    init() {
        // 1. Check local storage or system preference
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
            this.htmlElement.classList.add('dark');
        } else {
            this.htmlElement.classList.remove('dark');
        }

        // 2. Add event listeners to all toggle buttons (in case of multiple, e.g. mobile menu)
        this.themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => this.toggleTheme());
            this.updateIcon(btn);
        });
    }

    toggleTheme() {
        this.htmlElement.classList.toggle('dark');
        const isDark = this.htmlElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        this.themeToggleBtns.forEach(btn => this.updateIcon(btn));
    }

    updateIcon(btn) {
        const isDark = this.htmlElement.classList.contains('dark');
        const iconSpan = btn.querySelector('.material-symbols-outlined');
        if (iconSpan) {
            // Change icon: 'settings' is default, let's swap to sun/moon if possible,
            // or just render it consistent. For now, let's assume the button is for theme.
            // If the user specificed 'settings' in HTML, we might want to keep it or change it.
            // Let's change it to explicit sun/moon for better UX if the class indicates it's a theme toggle.
            if (btn.classList.contains('theme-toggle')) {
                 iconSpan.textContent = isDark ? 'light_mode' : 'dark_mode';
            }
        }
    }
}

class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-up');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, this.observerOptions);

        // Target elements: Sections, Cards, Headings
        const targets = document.querySelectorAll('section, .card, .skill-card, h1, h2, h3, p');
        targets.forEach(el => {
            el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700', 'ease-out');
            observer.observe(el);
        });
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new ScrollAnimator();
    new PageTransition();
    setupExtras();
});

class PageTransition {
    constructor() {
        // Ensure body starts transparent then fades in
        document.body.classList.add('opacity-0', 'transition-opacity', 'duration-500', 'ease-in-out');

        // Trigger fade in after short delay
        requestAnimationFrame(() => {
            document.body.classList.remove('opacity-0');
        });

        this.initLinks();
    }

    initLinks() {
        // Intercept all internal links
        const links = document.querySelectorAll('a[href^="index"], a[href^="about"], a[href^="skills"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                // ignore invalid links or same page anchors
                if (!href || href.startsWith('#') || href.startsWith('mailto')) return;

                e.preventDefault();
                // Fade out
                document.body.classList.add('opacity-0');

                // Wait for transition then navigate
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            });
        });
    }
}

function setupExtras() {
    // 1. Share Button Logic
    const shareBtns = document.querySelectorAll('button span.material-symbols-outlined');
    shareBtns.forEach(span => {
        if (span.textContent.trim() === 'share') {
            const btn = span.closest('button');
            btn.addEventListener('click', () => {
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                    alert('Link copied to clipboard!');
                });
            });
        }
    });

    // 2. Social Links Placeholder
    const socialLinks = document.querySelectorAll('footer a');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
             // Only if href is '#' or placeholder
             if (link.getAttribute('href') === '#') {
                 e.preventDefault();
                 alert('This is a demo link. Redirecting to placeholder...');
             }
        });
    });

    // 3. Proximity Card Effect & 3D Tilt (Event Delegation)
    document.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.proximity-card');
        if (!card) {
            // Check if we need to reset any card previously hovered if mouse moved out quickly
            // This part is handled by mouseleave usually, but with delegation we focus on 'mousemove' target
            return;
        }

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Proximity Glow
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);

        // 3D Tilt Calculation
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = x - centerX;
        const mouseY = y - centerY;

        const rotateX = (mouseY / centerY) * -10; // Max -10 to 10 deg
        const rotateY = (mouseX / centerX) * 10;  // Max -10 to 10 deg

        card.style.setProperty('--rotateX', `${rotateX}deg`);
        card.style.setProperty('--rotateY', `${rotateY}deg`);
    });

    document.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.proximity-card');
        if (card) {
             // We need to check if we really left the card
             const relatedTarget = e.relatedTarget;
             if (!card.contains(relatedTarget)) {
                card.style.setProperty('--rotateX', '0deg');
                card.style.setProperty('--rotateY', '0deg');
                card.style.setProperty('--x', `-100%`);
                card.style.setProperty('--y', `-100%`);
             }
        }
    });
}

// Add custom style for animation if not in Tailwind config
const style = document.createElement('style');
style.textContent = `
    .animate-fade-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in {
         animation: fadeIn 0.5s ease-out forwards;
    }
`;
document.head.appendChild(style);
