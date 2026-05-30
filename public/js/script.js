// DARK MODE
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    const setTheme = (isLight) => {
        document.body.classList.toggle('light-mode', isLight);
        themeToggle.innerHTML = isLight ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    };
    const saved = localStorage.getItem('theme');
    if (saved === 'light') setTheme(true);
    else if (saved === 'dark') setTheme(false);
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        setTheme(isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}
// MOBILE MENU
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
if (menuToggle && navMenu) {
    const setExpanded = (value) => menuToggle.setAttribute('aria-expanded', value ? 'true' : 'false');
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        setExpanded(navMenu.classList.contains('active'));
    });
    menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            menuToggle.click();
        }
    });
}
// PORTFOLIO MODAL
const cards = document.querySelectorAll('.portfolio-card');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
let lastActiveElement = null;
// Site configuration (sensitive info centralized)
const SITE_CONFIG = {
    name: 'Krishna Kumar Yadav',
    email: 'krishnakumar98016@gmail.com',
    phone: '+917033976249',
    experienceStart: '2023-08-04'
};

function computeExperienceYears(startIso) {
    try {
        const start = new Date(startIso);
        const now = new Date();
        const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
        const years = months / 12;
        const rounded = Math.round(years * 10) / 10; // one decimal
        return (rounded >= 1 ? rounded : (Math.round(years * 12) + 'mo')) + (rounded >= 1 ? '+' : '');
    } catch (e) {
        return '2.6+';
    }
}

// Apply dynamic experience values to page if elements exist
document.addEventListener('DOMContentLoaded', () => {
    const expEl = document.getElementById('expYears');
    const expAbout = document.getElementById('expYearsAbout');
    const exp = computeExperienceYears(SITE_CONFIG.experienceStart);
    if (expEl) expEl.textContent = exp;
    if (expAbout) expAbout.textContent = exp;
});
if (cards && modal && modalTitle && modalDescription && modalImage && closeModal) {
    const open = (card) => {
        lastActiveElement = document.activeElement;
        modal.classList.add('active');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modalTitle.innerHTML = card.dataset.title || '';
        modalDescription.innerHTML = card.dataset.description || '';
        modalImage.src = card.dataset.image || '';
        closeModal.focus();
    };
    const close = () => {
        modal.classList.remove('active');
        modalImage.src = '';
        if (lastActiveElement && typeof lastActiveElement.focus === 'function') lastActiveElement.focus();
    };
    cards.forEach(card => {
        // Only attach modal behavior to cards that define content attributes
        if (card.dataset && (card.dataset.title || card.dataset.description || card.dataset.image)) {
            card.addEventListener('click', () => open(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open(card);
                }
            });
        }
    });
    closeModal.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });
}
// SCROLL ANIMATION
const revealElements = document.querySelectorAll("section");
window.addEventListener("scroll", revealOnScroll);
function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }
    });
}
revealElements.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(40px)";
    section.style.transition = "all 1s ease";
});
revealOnScroll();

// CONTACT FORM: basic bot hardening (honeypot + timing + email obfuscation)
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStart = document.getElementById('formStart');
    const hpField = document.getElementById('hp_field');
    const emailBtn = document.getElementById('emailBtn');
    const waBtn = document.getElementById('waBtn');

        /* i18n: loadable locales (fallback) and runtime language switcher */
        const SITE_LOCALES = {
            en: null, // prefer fetching JSON; fallback to hardcoded below if fetch fails
            mai: null
        };

        function getSavedLang() {
            const saved = localStorage.getItem('site_lang');
            if (saved) return saved;
            const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
            if (nav.startsWith('mai') || nav.startsWith('mi')) return 'mai';
            return 'en';
        }

        async function loadLocale(lang) {
            // Try fetch first (allows editing JSON files), otherwise use embedded SITE_LOCALES
            try {
                const resp = await fetch('public/locales/' + lang + '.json', {cache: 'no-cache'});
                if (resp.ok) {
                    const data = await resp.json();
                    return data;
                }
            } catch (e) {
                console.warn('Locale fetch failed for', lang, e);
            }
            // Fallbacks (minimal)
            if (lang === 'mai') return {
                langName: 'मैथिली',
                title: 'कृष्ण कुमार यादव — फुल‑स्टैक इंजीनियर',
                metaDescription: 'कृष्ण कुमार यादव — न्यू दिल्ली के फुल‑स्टैक इंजीनियर।',
                heroSubtitle: 'कृष्ण कुमार यादव — सफ्टवेयर इंजीनियर',
                heroTitle: 'उच्च‑प्रदर्शन वेब आ AI सिस्टम बनबैत',
                heroDesc: 'फुल‑स्टैक इंजीनियर • बैकएंड आर्किटेक्ट • AI/ML डेवलपर — <span id="expYears">2.6+</span> वर्षक अनुभव।',
                portfolioLabel: 'पोर्टफोलियो',
                portfolioHeading: 'चयनित परियोजना आ केस स्टडी',
                aboutLabel: 'बारे में',
                aboutHeading: 'कृष्ण कुमार यादव — फुल‑स्टैक इंजीनियर',
                skillsLabel: 'कौशल',
                skillsHeading: 'प्राविधिक दक्षता',
                servicesLabel: 'सेवाएँ',
                servicesHeading: 'हम की‑की देब',
                contactLabel: 'संपर्क',
                contactHeading: 'किछु बनाउ जे स्केल करय',
                contactParagraph: 'हम फ्रीलांस प्रोजेक्ट, स्टार्टअप सहयोग आ रिमोट भूमिका खातिर उपलब्ध छी।',
                emailBtn: 'ईमेल — ' + SITE_CONFIG.email,
                waBtn: 'व्हाट्सऐप — ' + SITE_CONFIG.phone,
                footerBrand: SITE_CONFIG.name
            };
            // default English fallback
            return {
                langName: 'English',
                title: SITE_CONFIG.name + ' — Full‑Stack Software Engineer & AI/ML Developer | New Delhi',
                metaDescription: SITE_CONFIG.name + ' — Full‑stack software engineer from New Delhi with experience building high‑performance web apps, API integrations and AI/ML prototypes.',
                heroSubtitle: SITE_CONFIG.name + ' — SOFTWARE ENGINEER',
                heroTitle: 'Building High‑Performance Web & AI Systems',
                heroDesc: 'Full‑Stack Engineer • Backend Architect • AI/ML Developer — <span id="expYears">2.6+</span> years delivering production‑grade applications, API integrations and prototype AI systems.',
                portfolioLabel: 'PORTFOLIO',
                portfolioHeading: 'Selected Work & Case Studies',
                aboutLabel: 'ABOUT',
                aboutHeading: SITE_CONFIG.name + ' — Full‑Stack Engineer',
                skillsLabel: 'SKILLS',
                skillsHeading: 'Technical Expertise',
                servicesLabel: 'SERVICES',
                servicesHeading: 'What I Offer',
                contactLabel: 'CONTACT',
                contactHeading: "Let's Build Something That Scales",
                contactParagraph: 'I’m available for freelance projects, startup collaborations, and remote engineering roles. Share a brief of your project and I’ll respond within 24 hours.',
                emailBtn: 'Email — ' + SITE_CONFIG.email,
                waBtn: 'WhatsApp — ' + SITE_CONFIG.phone,
                footerBrand: SITE_CONFIG.name
            };
        }

        function applyTranslations(locale) {
            try {
                // document title & meta
                if (locale.title) document.title = locale.title;
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc && locale.metaDescription) metaDesc.setAttribute('content', locale.metaDescription);
                const ogDesc = document.querySelector('meta[property="og:description"]');
                if (ogDesc && locale.metaDescription) ogDesc.setAttribute('content', locale.metaDescription);
                const twDesc = document.querySelector('meta[name="twitter:description"]');
                if (twDesc && locale.metaDescription) twDesc.setAttribute('content', locale.metaDescription);

                // set html lang
                document.documentElement.lang = locale.langCode || document.documentElement.lang || 'en';

                // data-i18n attributes
                document.querySelectorAll('[data-i18n]').forEach(el => {
                    const key = el.getAttribute('data-i18n');
                    if (locale[key]) el.textContent = locale[key];
                });

                // specific ids (may contain HTML)
                const heroSub = document.getElementById('heroSubtitle');
                const heroTitle = document.getElementById('heroTitle');
                const heroDesc = document.getElementById('heroDesc');
                if (heroSub && locale.heroSubtitle) heroSub.textContent = locale.heroSubtitle;
                if (heroTitle && locale.heroTitle) heroTitle.textContent = locale.heroTitle;
                if (heroDesc && locale.heroDesc) heroDesc.innerHTML = locale.heroDesc;

                // contact buttons
                const emailBtnEl = document.getElementById('emailBtn');
                const waBtnEl = document.getElementById('waBtn');
                if (emailBtnEl && locale.emailBtn) emailBtnEl.textContent = locale.emailBtn;
                if (waBtnEl && locale.waBtn) waBtnEl.textContent = locale.waBtn;

                // footer
                const footerBrand = document.getElementById('footerBrand');
                if (footerBrand && locale.footerBrand) footerBrand.textContent = locale.footerBrand;
            } catch (e) {
                console.warn('Failed to apply translations', e);
            }
        }

        // initialize language selector
        (async function initLanguage() {
            const langSelect = document.getElementById('langSelect');
            const saved = getSavedLang();
            const locale = await loadLocale(saved);
            // set lang code on locale for html lang
            locale.langCode = saved === 'mai' ? 'mai' : 'en';
            applyTranslations(locale);
            if (langSelect) {
                langSelect.value = saved;
                langSelect.addEventListener('change', async (e) => {
                    const v = e.target.value;
                    localStorage.setItem('site_lang', v);
                    const l = await loadLocale(v);
                    l.langCode = v === 'mai' ? 'mai' : 'en';
                    applyTranslations(l);
                });
            }
        })();

    // Use centralized SITE_CONFIG for sensitive info
    const email = SITE_CONFIG.email;
    if (emailBtn) {
        // obfuscation: construct at runtime
        emailBtn.setAttribute('href', 'mailto:' + email);
        emailBtn.textContent = 'Email — ' + email;
    }

    if (waBtn) {
        const phoneDigits = SITE_CONFIG.phone.replace(/[^0-9]/g, '');
        waBtn.setAttribute('href', 'https://wa.me/' + phoneDigits);
    }

    if (formStart) formStart.value = Date.now().toString();

    // Populate dynamic site content
    const siteLogo = document.getElementById('siteLogo');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const footerBrand = document.getElementById('footerBrand');
    const footerYear = document.getElementById('footerYear');
    if (siteLogo) siteLogo.textContent = SITE_CONFIG.name;
    if (heroSubtitle) heroSubtitle.textContent = SITE_CONFIG.name + ' — SOFTWARE ENGINEER';
    if (footerBrand) footerBrand.textContent = SITE_CONFIG.name;
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // Re-apply translations after SITE_CONFIG-driven text replacements
    (async function _reapplyLocale() {
        try {
            const saved = localStorage.getItem('site_lang');
            if (saved) {
                const l = await loadLocale(saved);
                l.langCode = saved === 'mai' ? 'mai' : 'en';
                applyTranslations(l);
            }
        } catch (e) {
            // no-op
        }
    })();

    // Update meta author and description dynamically
    const metaAuthor = document.querySelector('meta[name="author"]');
    if (metaAuthor) metaAuthor.setAttribute('content', SITE_CONFIG.name);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', SITE_CONFIG.name + ' — Full‑stack software engineer from New Delhi with ' + (computeExperienceYears(SITE_CONFIG.experienceStart)) + ' experience building high‑performance web apps, API integrations and AI/ML prototypes.');

    // Update structured JSON-LD with SITE_CONFIG values
    try {
        const ld = document.querySelector('script[type="application/ld+json"]');
        if (ld) {
            const data = {
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: SITE_CONFIG.name,
                url: 'https://codekrishnayadav.github.io/my-portfolio-gwl/',
                sameAs: [
                    'https://www.linkedin.com/in/krishnakumaryadav',
                    'https://github.com/CodeKrishnaYadav'
                ],
                jobTitle: 'Full-Stack Software Engineer',
                worksFor: { '@type': 'Organization', name: SITE_CONFIG.name },
                email: SITE_CONFIG.email,
                telephone: SITE_CONFIG.phone,
                address: { '@type': 'PostalAddress', addressLocality: 'New Delhi', addressCountry: 'IN' }
            };
            ld.textContent = JSON.stringify(data, null, 2);
        }
    } catch (e) {
        console.warn('Failed to update JSON-LD', e);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Honeypot should be empty
            if (hpField && hpField.value.trim() !== '') {
                console.warn('Spam bot detected via honeypot.');
                return;
            }
            // Timing check: require at least 3 seconds before submit
            const started = parseInt(formStart.value || '0', 10);
            const elapsed = Date.now() - started;
            if (isNaN(started) || elapsed < 3000) {
                alert('Please take a moment to describe your project before sending.');
                return;
            }

            const name = document.getElementById('name')?.value?.trim() || '';
            const emailField = document.getElementById('email')?.value?.trim() || '';
            const message = document.getElementById('message')?.value?.trim() || '';

            if (!name || !emailField || !message) {
                alert('Please fill name, email and a short project brief.');
                return;
            }

            // Build mailto link safely
            const subject = encodeURIComponent('New project from ' + name);
            const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + emailField + '\n\n' + message);
            // Use configured recipient
            const mailto = 'mailto:' + SITE_CONFIG.email + '?subject=' + subject + '&body=' + body;
            window.location.href = mailto;
        });
    }
});