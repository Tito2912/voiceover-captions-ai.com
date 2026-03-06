// ==========================================================================
// Configuration et variables globales - VERSION CORRIGÉE
// ==========================================================================

// Configuration de l'application
const CONFIG = {
    affiliateLink: 'https://try.elevenlabs.io/q4qifzaxhkwg',
    gaTrackingId: 'G-952B25HTV8',
    newsletterEndpoint: 'https://script.google.com/macros/s/your-apps-script-url/exec',
    consentDuration: 365,
    utmStorageDuration: 90
};

// État de l'application
const STATE = {
    consent: {
        necessary: true,
        analytics: false,
        timestamp: null
    },
    currentLanguage: document.documentElement.lang,
    isNavOpen: false
};

// ==========================================================================
// Initialisation de l'application - CORRIGÉ
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé - Initialisation de l\'application');
    initApplication();
});

/**
 * Initialise toutes les fonctionnalités de l'application
 */
function initApplication() {
    console.log('Initialisation de l\'application...');
    
    try {
        // Initialiser les composants d'interface
        initNavigation();
        initFAQAccordions();
        initYouTubeLite();
        initNewsletterForm();
        
        // Gérer le consentement cookies
        initConsentManagement();
        
        // Vérifier la suggestion de langue
        checkLanguageSuggestion();
        
        // Initialiser les animations au scroll
        initScrollAnimations();

        // Charger la vidéo héro sans bloquer le LCP
        initHeroVideoLazyLoad();
        
        console.log('Application initialisée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
}

// ==========================================================================
// Gestion de la navigation - CORRIGÉ
// ==========================================================================

/**
 * Initialise la navigation mobile (burger menu)
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) {
        console.warn('Éléments de navigation non trouvés');
        return;
    }
    
    navToggle.addEventListener('click', function() {
        toggleNavigation();
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        if (STATE.isNavOpen && 
            !navToggle.contains(event.target) && 
            !navMenu.contains(event.target)) {
            toggleNavigation(false);
        }
    });
    
    // Fermer le menu en appuyant sur Echap
    document.addEventListener('keydown', function(event) {
        if (STATE.isNavOpen && event.key === 'Escape') {
            toggleNavigation(false);
        }
    });
}

/**
 * Bascule l'état de la navigation mobile
 */
function toggleNavigation(state) {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    STATE.isNavOpen = state !== undefined ? state : !STATE.isNavOpen;
    
    navToggle.setAttribute('aria-expanded', STATE.isNavOpen);
    navMenu.setAttribute('aria-expanded', STATE.isNavOpen);
    
    if (STATE.isNavOpen) {
        navMenu.style.transform = 'translateX(0)';
    } else {
        navMenu.style.transform = 'translateX(-100%)';
    }
}

// ==========================================================================
// Gestion du consentement cookies - SIMPLIFIÉ
// ==========================================================================

/**
 * Prépare la dataLayer/gtag sans charger GA tant qu'il n'y a pas de consentement
 */
function ensureAnalyticsStub() {
    if (!window.dataLayer) {
        window.dataLayer = [];
    }
    if (!window.gtag) {
        window.gtag = function() { dataLayer.push(arguments); };
    }
}

// ==========================================================================
// Vidéo héro - chargement paresseux pour améliorer le LCP
// ==========================================================================

/**
 * Charge la vidéo de fond après le rendu initial pour éviter de bloquer le LCP
 */
function initHeroVideoLazyLoad() {
    const video = document.querySelector('.hero-video');
    if (!video) return;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = Boolean(connection && connection.saveData);
    const slowConnection = connection && ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;

    // Ne pas charger la vidéo sur connexions lentes ou économiseur de données
    if (prefersReducedMotion || saveData || slowConnection || isSmallScreen) {
        video.removeAttribute('autoplay');
        return;
    }

    const hydrateVideo = () => {
        if (video.dataset.loaded) return;
        const source = video.querySelector('source');
        const src = (source && source.dataset.src) || video.dataset.src;
        if (!src) return;

        if (source) {
            source.src = src;
            source.removeAttribute('data-src');
        } else {
            video.src = src;
        }

        video.dataset.loaded = 'true';
        video.muted = true;
        video.load();
        video.play().catch(() => {});
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => hydrateVideo(), { timeout: 1500 });
    } else {
        setTimeout(hydrateVideo, 1200);
    }
}

/**
 * Définit le consentement par défaut (tout refusé) dès le chargement
 */
function setDefaultConsentMode() {
    if (window.__gaDefaultConsentSet) return;
    window.__gaDefaultConsentSet = true;
    ensureAnalyticsStub();
    gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
    });
}

/**
 * Initialise la gestion du consentement cookies
 */
function initConsentManagement() {
    setDefaultConsentMode();
    const cookieBanner = document.getElementById('cookie-consent');
    if (!cookieBanner) return;
    
    const savedConsent = getStorageItem('cookie_consent');
    
    if (savedConsent) {
        STATE.consent = savedConsent;
        updateConsentState();
    } else {
        cookieBanner.hidden = false;
    }
    
    // Gestion des boutons de consentement
    const acceptBtn = document.getElementById('cookie-accept');
    const necessaryBtn = document.getElementById('cookie-necessary');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            setConsent(true, true);
        });
    }
    
    if (necessaryBtn) {
        necessaryBtn.addEventListener('click', function() {
            setConsent(true, false);
        });
    }
}

/**
 * Définit les préférences de consentement
 */
function setConsent(necessary, analytics) {
    STATE.consent = {
        necessary: necessary,
        analytics: analytics,
        timestamp: new Date().toISOString()
    };
    
    setStorageItem('cookie_consent', STATE.consent, CONFIG.consentDuration);
    updateConsentState();
    
    const cookieBanner = document.getElementById('cookie-consent');
    if (cookieBanner) {
        cookieBanner.hidden = true;
    }
}

/**
 * Met à jour l'état du consentement
 */
function updateConsentState() {
    if (STATE.consent.analytics) {
        loadGoogleAnalytics();
    }
}

/**
 * Charge Google Analytics
 */
function loadGoogleAnalytics() {
    // Évite les doublons si l'utilisateur reclique
    if (window.__gaConsentGranted) return;
    window.__gaConsentGranted = true;

    ensureAnalyticsStub();

    // Injecte GA uniquement après consentement
    const existing = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    if (!existing) {
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaTrackingId}`;
        s.dataset.source = 'consent-loader';
        document.head.appendChild(s);
    }

    gtag('js', new Date());
    gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied', // passe à 'granted' seulement si tu as de la pub
        functionality_storage: 'granted',
        security_storage: 'granted'
    });
    gtag('config', CONFIG.gaTrackingId, { anonymize_ip: true });
    console.log('GA4 injecté dynamiquement et activé.');
}

// ==========================================================================
// Composants interactifs - CORRIGÉ
// ==========================================================================

/**
 * Initialise les accordéons FAQ
 */
function initFAQAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question');
        const content = item.querySelector('.faq-answer');
        
        if (!button || !content) return;
        
        button.addEventListener('click', function() {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Fermer tous les autres items
            if (!isExpanded) {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherButton = otherItem.querySelector('.faq-question');
                        const otherContent = otherItem.querySelector('.faq-answer');
                        
                        otherButton.setAttribute('aria-expanded', 'false');
                        otherContent.style.display = 'none';
                    }
                });
            }
            
            // Basculer cet item
            button.setAttribute('aria-expanded', !isExpanded);
            content.style.display = isExpanded ? 'none' : 'block';
        });
    });
}

/**
 * Initialise les lecteurs YouTube Lite
 */
function initYouTubeLite() {
    const youtubePlayers = document.querySelectorAll('.youtube-lite');
    
    youtubePlayers.forEach(player => {
        player.addEventListener('click', function(e) {
            e.preventDefault();
            
            const videoId = player.getAttribute('data-id');
            const videoTitle = player.getAttribute('data-title') || 'YouTube Video';
            
            // Remplacer par l'iframe YouTube
            const iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.title = videoTitle;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            
            player.innerHTML = '';
            player.appendChild(iframe);
        });
    });
}

// ==========================================================================
// Gestion du formulaire de newsletter - SIMPLIFIÉ
// ==========================================================================

/**
 * Initialise le formulaire de newsletter
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(newsletterForm);
        const email = formData.get('email');
        
        // Validation basique
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Désactiver le bouton
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Simulation d'envoi
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showFormMessage('Thank you for subscribing!', 'success');
            newsletterForm.reset();
            
        } catch (error) {
            showFormMessage('Sorry, an error occurred. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

/**
 * Affiche un message de formulaire
 */
function showFormMessage(message, type) {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    // Supprimer les messages existants
    const existingMessages = form.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Créer le nouveau message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    messageEl.style.padding = 'var(--spacing-md)';
    messageEl.style.marginTop = 'var(--spacing-md)';
    messageEl.style.borderRadius = 'var(--border-radius)';
    messageEl.style.fontWeight = 'var(--font-weight-medium)';
    
    if (type === 'success') {
        messageEl.style.backgroundColor = 'var(--color-success)';
        messageEl.style.color = 'white';
    } else {
        messageEl.style.backgroundColor = 'var(--color-error)';
        messageEl.style.color = 'white';
    }
    
    form.appendChild(messageEl);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// ==========================================================================
// Animations et effets - CORRIGÉ
// ==========================================================================

/**
 * Initialise les animations au défilement
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .use-case');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// ==========================================================================
// Gestion de la langue - CORRIGÉ
// ==========================================================================

/**
 * Vérifie si une suggestion de langue doit être affichée
 */
function checkLanguageSuggestion() {
    const languageBanner = document.getElementById('language-suggestion');
    if (!languageBanner || getStorageItem('language_dismissed')) return;
    
    const browserLang = navigator.language || navigator.userLanguage;
    const currentLang = STATE.currentLanguage;
    
    if ((browserLang.startsWith('fr') && currentLang !== 'fr') ||
        (!browserLang.startsWith('fr') && currentLang === 'fr')) {
        languageBanner.hidden = false;
        
        const dismissBtn = document.getElementById('dismiss-language');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', function() {
                languageBanner.hidden = true;
                setStorageItem('language_dismissed', true, 30);
            });
        }
    }
}

// ==========================================================================
// Utilitaires - CORRIGÉ
// ==========================================================================

/**
 * Valide une adresse email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Stocke un élément dans le localStorage
 */
function setStorageItem(key, value, days) {
    try {
        const item = {
            value: value,
            expiry: days ? Date.now() + (days * 24 * 60 * 60 * 1000) : null
        };
        localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.warn('Could not access localStorage:', error);
    }
}

/**
 * Récupère un élément du localStorage
 */
function getStorageItem(key) {
    try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        
        if (item.expiry && Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        
        return item.value;
    } catch (error) {
        console.warn('Could not access localStorage:', error);
        return null;
    }
}

// ==========================================================================
// Gestion des erreurs globales
// ==========================================================================

window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

console.log('Main JS module chargé - Version corrigée');
