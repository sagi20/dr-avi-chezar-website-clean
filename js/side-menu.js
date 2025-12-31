document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.side-menu-wrapper a');
    const sections = [];

    // Identify all sections linked in the menu
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes('#')) {
            const id = href.split('#')[1];
            const section = document.getElementById(id);
            if (section) {
                sections.push({ id, link, section });
            }
        }
    });

    function setActiveLink() {
        let currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const currentHash = window.location.hash;

        // 1. Handle Page-Level Active State (non-anchor links or different pages)
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');

            // Exact page match (e.g., '"dr-chezar.html"')
            if (href === currentPath) {
                link.classList.add('active');
            }
            // Root match
            else if (currentPath === 'index.html' && href === 'index.html' && !currentHash) {
                link.classList.add('active');
            }
        });

        // 2. Handle Scroll Spy / Hash Match for same-page anchors
        let foundActiveSection = false;

        // Check scroll position for sections on the current page
        const scrollPosition = window.scrollY + 150; // Offset for fixed header/menu

        sections.forEach(({ id, link, section }) => {
            // Only consider sections on the current page
            // (The 'section' element check ensures we only track what's on THIS page)
            if (section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                // Remove active from all first
                menuLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                foundActiveSection = true;
            }
        });

        // Fallback: If no section is active via scroll, and we have a hash, highlight that
        if (!foundActiveSection && currentHash) {
            menuLinks.forEach(link => {
                if (link.getAttribute('href').endsWith(currentHash)) {
                    // Remove active from all first to be safe
                    menuLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        }
    }

    // Initial check
    setActiveLink();

    // Scroll listener
    window.addEventListener('scroll', setActiveLink);
});
