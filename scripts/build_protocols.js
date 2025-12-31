const fs = require('fs');
const path = require('path');
const { PHYSIO_PROTOCOLS, PHYSIO_CATEGORIES } = require('../js/physio-data.js');

const OUTPUT_DIR = path.join(__dirname, '../physiotherapy');
const TEMPLATE_PATH = path.join(__dirname, '../physiotherapy.html'); // We'll use the main page as a base template, or a simplified one?
// Actually simpler to have a dedicated template string or read a new template file. 
// Let's assume we want to keep the site header/footer. I'll read physiotherapy.html to extract header/footer if needed, 
// but for robustness, I'll create a clean HTML template here that imports the same CSS.

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

function generateProtocolHtml(protocol) {
    const category = PHYSIO_CATEGORIES.find(c => c.id === protocol.category);
    const categoryName = category ? category.nameHe : '';

    // Schema.org Data
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "name": protocol.title,
        "description": protocol.shortDescription,
        "medicalAudience": "Patients",
        "aspect": "Rehabilitation"
    };

    return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${protocol.title} | פיזיותרפיה ושיקום</title>
    <meta name="description" content="${protocol.shortDescription} - פרוטוקול שיקום פיזיותרפיה. משך זמן: ${protocol.duration || 'משתנה'}.">
    
    <!-- Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700;800&family=Heebo:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- CSS -->
    <link rel="stylesheet" href="../css/style.css?v=3">
    <link rel="stylesheet" href="../css/physiotherapy.css">
    
    <script type="application/ld+json">
    ${JSON.stringify(schemaData, null, 2)}
    </script>
</head>
<body class="medical-info-standard protocol-page">

    <!-- Header (Identical to site) -->
    <header class="header">
        <div class="container nav-container">
            <a href="../index.html" class="logo">C4U<span style="font-weight: 400; font-size: 0.8em;"> | אתר הכתף של ד"ר אבי שזר</span></a>
            <button class="mobile-toggle" onclick="document.querySelector('.nav-menu').classList.toggle('active')">☰</button>
            <nav class="nav-menu">
                 <!-- Brief Nav for Context -->
                 <a href="../physiotherapy.html" class="nav-link">חזרה לפרוטוקולים</a>
                 <a href="../index.html" class="nav-link">דף הבית</a>
                 <a href="tel:0524224623" class="btn btn-primary"><i data-lucide="phone" style="width:16px;"></i> 052-4224623</a>
            </nav>
        </div>
    </header>

    <main id="mainContent">
    
        <!-- Hero Section -->
        <section class="physio-detail-hero">
            <div class="container">
                <a href="../physiotherapy.html" class="back-link-legacy" style="display: inline-flex; align-items: center; gap: 0.5rem; color: #33658a; margin-bottom: 1.5rem; font-weight: 600; text-decoration: none;">
                    <i data-lucide="arrow-right"></i> חזרה לכל הפרוטוקולים
                </a>
                
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <span class="card-badge" style="position: static; margin: 0;">
                        <i data-lucide="activity"></i> ${categoryName}
                    </span>
                    ${protocol.duration ? `<span class="card-badge" style="position: static; margin: 0; background: #e0f2fe; color: #0369a1;"><i data-lucide="clock"></i> ${protocol.duration}</span>` : ''}
                </div>

                <h1>${protocol.title}</h1>
                <p class="physio-detail-desc">${protocol.shortDescription}</p>

                <div class="action-buttons" style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
                    <a href="../${protocol.pdfUrl}" download class="btn-primary-card" style="width: auto; padding: 0 2rem;">
                        <i data-lucide="download"></i> הורדת PDF
                    </a>
                    <a href="../${protocol.pdfUrl}" target="_blank" class="btn-secondary-card" style="width: auto; padding: 0 2rem;">
                       <i data-lucide="external-link"></i> צפייה במסמך מלא
                    </a>
                </div>
            </div>
        </section>

        <!-- Content Layout -->
        <div class="container physio-layout">
            
            <!-- Right Column: Accordion -->
            <div class="phases-column">
                <h2 style="font-size: 1.8rem; margin-bottom: 1.5rem; color: var(--text-dark);">שלבי השיקום</h2>
                <div class="accordion" id="phasesAccordion">
                    ${protocol.phases.map((phase, index) => `
                        <div class="accordion-item active">
                            <button class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
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
                                    ${phase.warnings && phase.warnings.length > 0 ? `
                                    <div class="detail-section warning">
                                        <h5><i data-lucide="alert-triangle"></i> אמצעי זהירות:</h5>
                                        <ul>${phase.warnings.map(w => `<li>${w}</li>`).join('')}</ul>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Left Column: PDF & Sticky -->
            <aside class="pdf-sidebar">
                <div class="pdf-card">
                    <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">מסמך רשמי</h3>
                    <iframe src="../${protocol.pdfUrl}" class="pdf-viewer-frame" title="Protocol PDF"></iframe>
                    <a href="../${protocol.pdfUrl}" class="btn-secondary-card" target="_blank" style="margin-top: 1rem;">
                        <i data-lucide="maximize"></i> פתח בחלון חדש
                    </a>
                </div>
                
                <div class="red-flags-section" style="margin-top: 2rem; padding: 1.5rem; background: #fff5f5; border-radius: 12px; border: 1px solid #fed7d7;">
                    <h4 style="color: #c53030; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <i data-lucide="alert-circle"></i> מתי לפנות לרופא?
                    </h4>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 0.5rem; color: #742a2a; display: flex; align-items: center; gap: 0.5rem;">
                            <span style="width: 6px; height: 6px; background: #c53030; border-radius: 50%;"></span> חום מעל 38°
                        </li>
                        <li style="margin-bottom: 0.5rem; color: #742a2a; display: flex; align-items: center; gap: 0.5rem;">
                            <span style="width: 6px; height: 6px; background: #c53030; border-radius: 50%;"></span> כאב שאינו מוקל במשככים
                        </li>
                        <li style="margin-bottom: 0.5rem; color: #742a2a; display: flex; align-items: center; gap: 0.5rem;">
                            <span style="width: 6px; height: 6px; background: #c53030; border-radius: 50%;"></span> הפרשה מרובה מהפצע
                        </li>
                    </ul>
                </div>
            </aside>

        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p style="text-align: center; color: rgba(255,255,255,0.5);">© 2024 ד"ר אבי שזר | כל הזכויות שמורות</p>
        </div>
    </footer>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>`;
}

console.log('Starting static site generation...');

PHYSIO_PROTOCOLS.forEach(protocol => {
    const html = generateProtocolHtml(protocol);
    const fileName = \`\${protocol.id}.html\`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    
    fs.writeFileSync(filePath, html);
    console.log(\`Generated: \${fileName}\`);
});

console.log('Done!');
