export function initPrivacyModal(): void {
    const link = document.getElementById('privacyLink');
    const linkFromBanner = document.getElementById('privacyLinkFromBanner');
    const overlay = document.getElementById('privacyModalOverlay');
    const closeBtn = document.getElementById('privacyModalCloseBtn');

    if (!link || !linkFromBanner || !overlay || !closeBtn) return;

    [link, linkFromBanner].forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.add('is-open');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });

    const close = () => {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
}
