document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already accepted cookies
    if (!localStorage.getItem('cookieConsent')) {
        // Wait a bit before showing
        setTimeout(showCookieBanner, 2000);
    }
});

function showCookieBanner() {
    // Create banner HTML
    const bannerHTML = `
        <div class="cookie-consent-banner" id="cookieBanner">
            <div class="cookie-content">
                <div class="cookie-icon">
                    <i data-lucide="cookie"></i>
                </div>
                <div class="cookie-text">
                    <h3>אנחנו משתמשים בעוגיות</h3>
                    <p>
                        האתר משתמש ב-Cookies כדי לשפר את חווית הגלישה שלך ולנתח את התנועה באתר.
                        המשך הגלישה באתר מהווה הסכמה לשימוש ב-Cookies.
                    </p>
                </div>
            </div>
            <div class="cookie-actions">
                <a href="privacy.html" class="cookie-btn cookie-btn-policy">מדיניות פרטיות</a>
                <button class="cookie-btn cookie-btn-accept" onclick="acceptCookies()">אני מסכים/ה</button>
            </div>
        </div>
    `;

    // Inject into body
    document.body.insertAdjacentHTML('beforeend', bannerHTML);

    // Initialize icons if Lucide is available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Trigger animation
    setTimeout(() => {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.add('show');
        }
    }, 100);
}

function acceptCookies() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
        banner.classList.remove('show');
        // Wait for animation to finish before removing
        setTimeout(() => {
            banner.remove();
        }, 500);
    }
    // Save consent
    localStorage.setItem('cookieConsent', 'true');
}
