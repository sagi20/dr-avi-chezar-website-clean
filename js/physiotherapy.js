/**
 * Physiotherapy Section Logic
 * Handles both the list view and the detailed protocol view.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPhysiotherapy();
});

function initPhysiotherapy() {
    const urlParams = new URLSearchParams(window.location.search);
    const protocolId = urlParams.get('id');

    if (protocolId) {
        renderProtocolDetail(protocolId);
    } else {
        renderProtocolList();
    }
}

function renderProtocolList() {
    const container = document.getElementById('physioListView');
    if (!container) return;

    // Build the list UI (Hero, Search, Filters, Grid)
    // This will be partially in the HTML, partially dynamic.
    const searchInput = document.getElementById('protocolSearch');
    const categoryFilters = document.getElementById('categoryFilters');

    function updateDisplay() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.filter-pill.active')?.dataset.category || 'all';

        const cards = document.querySelectorAll('.protocol-card');

        cards.forEach(card => {
            const title = card.dataset.title.toLowerCase();
            const category = card.dataset.category;

            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', updateDisplay);
    }

    if (categoryFilters) {
        // First, add existing categories from data
        PHYSIO_CATEGORIES.sort((a, b) => a.order - b.order).forEach(cat => {
            const pill = document.createElement('button');
            pill.className = 'filter-pill';
            pill.textContent = cat.nameHe;
            pill.dataset.category = cat.id;
            categoryFilters.appendChild(pill);
        });

        // Use event delegation for all pills (including "All Categories")
        categoryFilters.addEventListener('click', (e) => {
            const pill = e.target.closest('.filter-pill');
            if (!pill) return;

            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            updateDisplay();
        });
    }

    updateDisplay();
}

function renderGrid(protocols, grouped) {
    const gridContainer = document.getElementById('protocolResults');
    if (!gridContainer) return;

    if (protocols.length === 0) {
        gridContainer.innerHTML = '<div class="no-results">לא נמצאו פרוטוקולים התואמים את החיפוש.</div>';
        return;
    }

    if (grouped) {
        let html = '';
        PHYSIO_CATEGORIES.sort((a, b) => a.order - b.order).forEach(cat => {
            const catProtocols = protocols.filter(p => p.category === cat.id);
            if (catProtocols.length > 0) {
                html += `
                    <div class="category-group">
                        <h3 class="category-title">${cat.nameHe}</h3>
                        <div class="protocol-grid">
                            ${catProtocols.map(p => createProtocolCard(p)).join('')}
                        </div>
                    </div>
                `;
            }
        });
        gridContainer.innerHTML = html;
    } else {
        gridContainer.innerHTML = `
            <div class="protocol-grid">
                ${protocols.map(p => createProtocolCard(p)).join('')}
            </div>
        `;
    }

    // Re-initialize icons after rendering
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function createProtocolCard(protocol) {
    return `
        <div class="protocol-card">
            <div class="card-badge">
                <i data-lucide="clock"></i>
                <span>לפי הנחיית הרופא והפיזיותרפיסט</span>
            </div>
            <h4 class="card-title">${protocol.title}</h4>
            <p class="card-desc">${protocol.shortDescription}</p>
            <div class="card-actions">
                <button class="btn-primary-card" onclick="window.location.search = '?id=${protocol.id}'">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="file-text" class="icon-right"></i>
                        <span>צפה בפרוטוקול</span>
                    </div>
                    <i data-lucide="chevron-left" class="icon-left"></i>
                </button>
                <a href="${protocol.pdfUrl}" download="${protocol.title}.pdf" class="btn-secondary-card" onclick="event.stopPropagation()">
                    <i data-lucide="download" class="icon-right"></i>
                    <span>הורד PDF</span>
                </a>
            </div>
        </div>
    `;
}

function renderProtocolDetail(id) {
    const protocol = PHYSIO_PROTOCOLS.find(p => p.id === id);
    const container = document.getElementById('physioPageBody');
    if (!container) return;

    if (!protocol) {
        container.innerHTML = `
            <div class="container" style="padding: 100px 0; text-align: center;">
                <h2>פרוטוקול לא נמצא</h2>
                <p>מצטערים, הפרוטוקול שחיפשת אינו קיים במערכת.</p>
                <a href="physiotherapy.html" class="btn btn-primary">חזרה לכל הפרוטוקולים</a>
            </div>
        `;
        return;
    }

    // Hide list section, show detail section
    document.getElementById('physioListView').style.display = 'none';
    const detailView = document.getElementById('physioDetailView');
    detailView.style.display = 'block';

    // Populate detail view
    document.getElementById('detailTitle').textContent = protocol.title;
    document.getElementById('detailDesc').textContent = protocol.shortDescription;
    document.getElementById('detailCategory').textContent = PHYSIO_CATEGORIES.find(c => c.id === protocol.category)?.nameHe || '';
    document.getElementById('detailDuration').textContent = protocol.duration || '';

    // PDF buttons
    const downloadBtn = document.getElementById('downloadPdf');
    downloadBtn.href = protocol.pdfUrl;
    downloadBtn.setAttribute('download', protocol.title + '.pdf');
    document.getElementById('openPdf').onclick = () => window.open(protocol.pdfUrl, '_blank');
    document.getElementById('pdfIframe').src = protocol.pdfUrl;

    // Render Phases Accordion
    const accordion = document.getElementById('phasesAccordion');
    accordion.innerHTML = protocol.phases.map((phase, index) => `
        <div class="accordion-item active">
            <button class="accordion-header" onclick="toggleAccordion(this)">
                <div class="phase-number">${index + 1}</div>
                <div class="phase-info">
                    <span class="phase-name">${phase.name}</span>
                    <span class="phase-duration">${phase.duration}</span>
                </div>
                <i data-lucide="chevron-down"></i>
            </button>
            <div class="accordion-content">
                <div class="phase-details">
                    <div class="detail-section">
                        <h5><i data-lucide="target"></i> מטרות השלב:</h5>
                        <ul>${phase.goals.map(g => `<li>${g}</li>`).join('')}</ul>
                    </div>
                    <div class="detail-section">
                        <h5><i data-lucide="activity"></i> תרגילים מומלצים:</h5>
                        <ul>${phase.exercises.map(e => `<li>${e}</li>`).join('')}</ul>
                    </div>
                    ${phase.warnings.length > 0 ? `
                        <div class="detail-section warning">
                            <h5><i data-lucide="alert-triangle"></i> אמצעי זהירות:</h5>
                            <ul>${phase.warnings.map(w => `<li>${w}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleAccordion(header) {
    const item = header.parentElement;
    item.classList.toggle('active');
}
