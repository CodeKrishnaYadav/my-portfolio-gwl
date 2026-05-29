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
    experienceStart: '2023-08-04' // ISO date: YYYY-MM-DD
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

/* (async function () {

    // Main object
    const userInfo = {};

    // Basic information
    userInfo.timestamp = new Date().toISOString();
    userInfo.currentURL = window.location.href;
    userInfo.referrer = document.referrer;

    // Browser details
    userInfo.userAgent = navigator.userAgent;
    userInfo.language = navigator.language;
    userInfo.languages = navigator.languages;
    userInfo.platform = navigator.platform;
    userInfo.cookieEnabled = navigator.cookieEnabled;
    userInfo.onlineStatus = navigator.onLine;
    userInfo.javaEnabled = navigator.javaEnabled();

    // Device details
    userInfo.screenWidth = screen.width;
    userInfo.screenHeight = screen.height;
    userInfo.availWidth = screen.availWidth;
    userInfo.availHeight = screen.availHeight;
    userInfo.colorDepth = screen.colorDepth;
    userInfo.pixelDepth = screen.pixelDepth;

    // Hardware details
    userInfo.cpuCores = navigator.hardwareConcurrency || 'N/A';
    userInfo.deviceMemory = navigator.deviceMemory || 'N/A';
    userInfo.touchSupport = navigator.maxTouchPoints;

    // Timezone
    userInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Network details
    if (navigator.connection) {
        userInfo.networkType = navigator.connection.effectiveType;
        userInfo.downlink = navigator.connection.downlink;
        userInfo.rtt = navigator.connection.rtt;
    }

    // Approximate location using IP API
    try {
        const response = await fetch('https://ipapi.co/json/');
        const locationData = await response.json();

        userInfo.ip = locationData.ip;
        userInfo.city = locationData.city;
        userInfo.region = locationData.region;
        userInfo.country = locationData.country_name;
        userInfo.postal = locationData.postal;
        userInfo.latitude = locationData.latitude;
        userInfo.longitude = locationData.longitude;
        userInfo.org = locationData.org;
        userInfo.network = locationData.network;
        userInfo.timezoneByIP = locationData.timezone;
})();
 */