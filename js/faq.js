document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.querySelector('.faq-container');
    const searchInput = document.getElementById('faqSearch');
    const filterButtons = document.querySelectorAll('.faq-filter-btn');
    const faqItems = document.querySelectorAll('.faq-item');

    // 1. Accordion Logic
    faqContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.faq-question');
        if (!button) return;

        const item = button.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Close all other items (optional - keeping one open at a time)
        faqItems.forEach(otherItem => {
            if (otherItem !== item && !otherItem.classList.contains('hidden')) {
                const otherBtn = otherItem.querySelector('.faq-question');
                const otherAns = otherItem.querySelector('.faq-answer');
                if (otherBtn) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    otherAns.style.maxHeight = null;
                }
            }
        });

        // Toggle current
        button.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = null;
        }
    });

    // 2. Category Filter Logic
    // Initialize: Hide all items that don't match the active category (instability)
    const initialCategory = 'instability';
    faqItems.forEach(item => {
        if (item.dataset.category !== initialCategory) {
            item.classList.add('hidden-by-category');
        }
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;

            faqItems.forEach(item => {
                const itemCategory = item.dataset.category;
                // Reset search when changing category or combine? 
                // Requirement says "Click category -> show only belonging questions".
                // We will respect the category first.

                if (itemCategory === category) {
                    item.classList.remove('hidden-by-category');
                } else {
                    item.classList.add('hidden-by-category');
                    // Also close if open
                    const btn = item.querySelector('.faq-question');
                    const ans = item.querySelector('.faq-answer');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                    if (ans) ans.style.maxHeight = null;
                }
            });

            // Re-apply search filter if text exists
            filterBySearch();
        });
    });

    // 3. Search Logic
    searchInput.addEventListener('input', filterBySearch);

    function filterBySearch() {
        const term = searchInput.value.toLowerCase().trim();

        faqItems.forEach(item => {
            // Only search within items visible by category
            if (item.classList.contains('hidden-by-category')) return;

            const question = item.querySelector('.faq-question').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();

            if (question.includes(term) || answer.includes(term)) {
                item.classList.remove('hidden-by-search');
            } else {
                item.classList.add('hidden-by-search');
            }
        });
    }
});
