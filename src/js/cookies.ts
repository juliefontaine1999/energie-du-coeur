const COOKIE_CONSENT_KEY = 'cookie-consent';

export function initCookieBanner(): void {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('cookieAccept');
    const declineBtn = document.getElementById('cookieDecline');

    if (!banner || !acceptBtn || !declineBtn) return;

    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!consent) {
        setTimeout(() => {
            banner.classList.add('is-visible');
        }, 1000);
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        banner.classList.remove('is-visible');
        loadGoogleAnalytics();
    });

    declineBtn.addEventListener('click', () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
        banner.classList.remove('is-visible');
    });
}

function loadGoogleAnalytics(): void {
    const gaId = 'G-V65PEN17GG';

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
    `;
    document.head.appendChild(script2);
}
