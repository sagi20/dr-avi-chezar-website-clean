import os
import re

# Mapping provided by the user
topic_mapping = {
    'instability': 'shoulder-instability.html',
    'rotator_cuff': 'rotator-cuff-tears.html',
    'calcific': 'calcific-tendonitis.html',
    'frozen_shoulder': 'frozen-shoulder.html',
    'clavicle_dislocation': 'clavicle-dislocation.html',
    'osteoarthritis': 'shoulder-osteoarthritis.html',
    'biceps_tear': 'biceps-tear.html',
    'slap_tear': 'slap-tear.html',
    'humerus_fracture': 'humerus-fracture.html',
    'arthroscopy': 'shoulder-arthroscopy.html',
    'labral_repair': 'bankart-repair.html',
    'latarjet': 'latarjet-procedure.html',
    'cuff_repair': 'rotator-cuff-repair.html',
    'fracture_fixation': 'fracture-fixation.html',
    'partial_replacement': 'partial-shoulder-replacement.html',
    'reverse_fracture': 'reverse-shoulder-fracture.html',
    'reverse_replacement': 'reverse-shoulder-replacement.html'
}

# Order for Next/Prev navigation
topic_order = [
    'instability',
    'rotator_cuff',
    'calcific',
    'frozen_shoulder',
    'clavicle_dislocation',
    'osteoarthritis',
    'biceps_tear',
    'slap_tear',
    'humerus_fracture',
    'arthroscopy',
    'labral_repair',
    'latarjet',
    'cuff_repair',
    'fracture_fixation',
    'partial_replacement',
    'reverse_fracture',
    'reverse_replacement'
]

# Medical Content Data (Extracted from main.js)
medical_content = {
    'instability': {
        'title': 'פריקות חוזרות, חוסר יציבות בכתף',
        'subtitle': 'אבחון, גורמים ודרכי טיפול מתקדמות',
        'short_description': 'סובלים מפריקות חוזרות בכתף? גלו את הסיבות, דרכי האבחון והפתרונות המתקדמים לייצוב הכתף וחזרה לפעילות מלאה.',
        'media_image': 'img/instability_1.webp',
        'slides_count': 15,
        'slides_prefix': 'img/instability_'
    },
    'rotator_cuff': {
        'title': 'קרעים בשרוול המסובב',
        'subtitle': 'אבחון, טיפול ושיקום בקרעי גידים בכתף',
        'short_description': 'כאבים בהרמת היד? ייתכן ומדובר בקרע בגידים. קראו על אפשרויות הטיפול, מפיזיותרפיה ועד ניתוח זעיר-פולשני.',
        'media_image': 'img/rotator_1.webp',
        'slides_count': 14,
        'slides_prefix': 'img/rotator_'
    },
    'calcific': {
        'title': 'הסתיידויות בגידים',
        'subtitle': 'טיפול בכאב חריף כתוצאה מהסתיידות',
        'short_description': 'כאב חריף ופתאומי בכתף? הסתיידות בגידים היא תופעה נפוצה וניתנת לטיפול יעיל. כל המידע על גלי הלם ושטיפה.',
        'media_image': 'img/calcific_1.webp',
        'slides_count': 12,
        'slides_prefix': 'img/calcific_'
    },
    'frozen_shoulder': {
        'title': 'כתף קפואה',
        'subtitle': 'Frozen Shoulder - Adhesive Capsulitis',
        'short_description': 'הגבלה קשה בתנועה וכאב? כתף קפואה היא מצב מתסכל אך חולף. הבינו את שלבי המחלה ואיך להקל על הכאב.',
        'media_image': 'img/frozen_1.webp',
        'slides_count': 10,
        'slides_prefix': 'img/frozen_'
    },
    'clavicle_dislocation': {
        'title': 'פריקת עצם הבריח (ACJ)',
        'subtitle': 'Acromio-Clavicular Joint Dislocation',
        'short_description': 'נפילה על הכתף? פריקה של עצם הבריח שכיחה בספורט. מתי צריך ניתוח ומתי מספיק מתלה? התשובות כאן.',
        'media_image': 'img/clavicle_1.webp',
        'slides_count': 9,
        'slides_prefix': 'img/clavicle_'
    },
    'osteoarthritis': {
        'title': 'שחיקת סחוס במפרק',
        'subtitle': 'Shoulder Osteoarthritis',
        'short_description': 'כאבים כרוניים וחריקות בכתף? שחיקת סחוס אינה גזירת גורל. הכירו את הטיפולים השמרניים והניתוחיים לשיפור איכות החיים.',
        'media_image': 'img/osteo_1.webp',
        'slides_count': 10,
        'slides_prefix': 'img/osteo_'
    },
    'biceps_tear': {
        'title': 'קרע בראש הארוך של השריר הדו ראשי',
        'subtitle': 'Tear of Long head of biceps tendon',
        'short_description': 'נפיחות בזרוע וכאב פתאומי? קרע בגיד הביצפס נראה מפחיד אך לרוב אינו דורש ניתוח. מתי בכל זאת כדאי לטפל?',
        'media_image': 'img/biceps_1.webp',
        'slides_count': 5,
        'slides_prefix': 'img/biceps_'
    },
    'slap_tear': {
        'title': 'קרע בלברום העליון SLAP',
        'subtitle': 'SLAP Lesion',
        'short_description': 'ספורטאים? כאב עמוק בכתף? פגיעת SLAP בלברום העליון אופיינית לעוסקים בספורט. אבחון מדויק וטיפול מותאם.',
        'media_image': 'img/slap_1.webp',
        'slides_count': 10,
        'slides_prefix': 'img/slap_'
    },
    'humerus_fracture': {
        'title': 'שברים בכתף עצם הזרוע',
        'subtitle': 'Fracture Proximal Humerus',
        'short_description': 'שבר בכתף דורש אבחון מדויק והתאמת טיפול אישית. מקבוע ועד ניתוח מורכב - כל האפשרויות להחלמה מיטבית.',
        'media_image': 'img/humerus_1.webp',
        'slides_count': 10,
        'slides_prefix': 'img/humerus_'
    },
    'arthroscopy': {
        'title': 'ארטרוסקופיה של הכתף',
        'subtitle': 'Shoulder Arthroscopy',
        'short_description': 'ניתוח זעיר-פולשני לטיפול בבעיות כתף. החלמה מהירה, צלקות מינימליות ותוצאות מצוינות. איך זה עובד?',
        'media_image': 'img/arthro_1.webp',
        'slides_count': 8,
        'slides_prefix': 'img/arthro_'
    },
    'labral_repair': {
        'title': 'ניתוח לתפירת לברום',
        'subtitle': 'Arthroscopic Bankart Repair (ABR)',
        'short_description': 'ניתוח לייצוב הכתף לאחר פריקות. טכניקה מתקדמת לתיקון הרקמה הרכה ומניעת פריקות חוזרות.',
        'media_image': 'img/labral_1.webp',
        'slides_count': 10,
        'slides_prefix': 'img/labral_'
    },
    'latarjet': {
        'title': 'ניתוח לטרזה (Latarjet)',
        'subtitle': 'Arthroscopic Latarjet',
        'short_description': 'ניתוח לייצוב הכתף במקרים מורכבים או אצל ספורטאים. העברת עצם לחיזוק המפרק ומניעת פריקות.',
        'media_image': 'img/latarjet_1.webp',
        'slides_count': 15,
        'slides_prefix': 'img/latarjet_'
    },
    'cuff_repair': {
        'title': 'תיקון קרע בגידים שרוול מסובב',
        'subtitle': 'Rotator Cuff Repair',
        'short_description': 'ניתוח לתפירת גידים קרועים בכתף. שיפור הכאב והתפקוד בעזרת טכנולוגיה מתקדמת ועוגנים נספגים.',
        'media_image': 'img/cuff_repair_1.webp',
        'slides_count': 14,
        'slides_prefix': 'img/cuff_repair_'
    },
    'fracture_fixation': {
        'title': 'קיבוע שבר בכתף בעזרת פלטה וברגים',
        'subtitle': 'Open Reduction Internal Fixation of Proximal Humerus Fracture',
        'short_description': 'טיפול ניתוחי לשברים מורכבים בכתף. שחזור המבנה האנטומי וקיבוע יציב המאפשר הפעלה מוקדמת.',
        'media_image': 'img/fixation_1.webp',
        'slides_count': 9,
        'slides_prefix': 'img/fixation_'
    },
    'partial_replacement': {
        'title': 'טיפול בשבר בכתף החלפת מפרק חלקית',
        'subtitle': 'Hemi-Arthroplasty for fractures of proximal Humerus',
        'short_description': 'פתרון לשברים מורכבים שאינם ניתנים לקיבוע. החלפת ראש העצם בלבד לשימור התנועה והפחתת הכאב.',
        'media_image': 'img/partial_1.webp',
        'slides_count': 11,
        'slides_prefix': 'img/partial_'
    },
    'reverse_fracture': {
        'title': 'טיפול בשבר בכתף החלפת מפרק הפוכה',
        'subtitle': 'Reverse total shoulder for fractures of proximal Humerus',
        'short_description': 'פתרון מתקדם לשברים מורכבים בגיל המבוגר. משתל ייחודי המאפשר תפקוד גם ללא גידים תקינים.',
        'media_image': 'img/reverse_1.webp',
        'slides_count': 10,
        'slides_prefix': 'img/reverse_'
    },
    'reverse_replacement': {
        'title': 'החלפת מפרק כתף הפוכה',
        'subtitle': 'Revers total shoulder replacement',
        'short_description': 'הפתרון המוביל לשחיקת סחוס קשה או קרעים מסיביים. החזרת יכולת התנועה ושיפור דרמטי באיכות החיים.',
        'media_image': 'img/reverse_1.webp',
        'slides_count': 10,
        'slides_prefix': 'img/reverse_'
    }
}

# Function to extract main text from js/main.js
def extract_main_text(key):
    try:
        with open('js/main.js', 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Regex to find the object for the specific key
            # pattern: 'key': { ... mainText: `...`, ... }
            # This is a bit complex due to nested braces, but mainText is usually a distinct block
            
            # Simplified approach: Find the key start, then find mainText: `...`
            # Note: This is fragile if formatting changes, but works for the current stable file
            
            key_pattern = rf"'{key}':\s*{{"
            match = re.search(key_pattern, content)
            if not match:
                print(f"Key {key} not found")
                return "", ""
                
            start_index = match.end()
            
            # Find mainText
            # Looking for mainText: ` or mainText: " or mainText: '
            main_text_match = re.search(r"mainText:\s*`", content[start_index:])
            if not main_text_match:
                # Try single quotes if backticks failed (though usually backticks for multiline)
                main_text_match = re.search(r"mainText:\s*'", content[start_index:])
                
            if main_text_match:
                text_start = start_index + main_text_match.end()
                # Find end of string (backtick)
                # We need to be careful not to match escaped backticks if any
                text_end = content.find("`,", text_start)
                if text_end == -1:
                     text_end = content.find("`\n", text_start) # Alternative ending
                
                main_text = content[text_start:text_end].strip()
            else:
                main_text = ""
                
            # Find recoveryText
            recovery_text_match = re.search(r"recoveryText:\s*`", content[start_index:])
            if not recovery_text_match:
                 # Check for empty string: recoveryText: '',
                 empty_match = re.search(r"recoveryText:\s*'',", content[start_index:])
                 if empty_match:
                     recovery_text = ""
                 else:
                     recovery_text = ""
                     
            if recovery_text_match:
                rec_start = start_index + recovery_text_match.end()
                rec_end = content.find("`,", rec_start)
                recovery_text = content[rec_start:rec_end].strip()
            # If we didn't find the backtick version but found empty string logic above, recovery_text is set
                
            return main_text, recovery_text
            
    except Exception as e:
        print(f"Error reading main.js: {e}")
        return "", ""

# Load template
with open('info-page.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Pre-process template: Global Navigation Replacement
# Replace dynamic links in the template BEFORE processing individual pages
# This ensures the navbar links are correct on ALL generated pages
for key, filename in topic_mapping.items():
    # Replace href="/info-page.html?topic=key" with href="/filename"
    # Handling variations with and without quotes/spaces
    template = template.replace(f'href="/info-page.html?topic={key}"', f'href="/{filename}"')
    template = template.replace(f"href='/info-page.html?topic={key}'", f"href='/{filename}'")
    # Also handle the relative path version if distinct
    # (The file uses /info-page.html?topic=... based on the view)

# Function to generate carousel HTML
def generate_carousel_html(prefix, count, title):
    slides_html = ""
    dots_html = ""
    for i in range(count):
        img_src = f"{prefix}{i+1}.webp"
        active_class = " active" if i == 0 else ""
        
        # Slide
        # Note: The onclick event in the original uses 'openModal(content.slides, currentSlide)'
        # We need to generate the JS array literally or handle it. 
        # For simplicity in static HTML, we can attach the data-slides attribute to a container 
        # or just hardcode the onClick to call a function if we keep the JS.
        # However, the requirement says "content must be hardcoded".
        # We will keep the `onclick` but we need to ensure the JS logic knows what `content.slides` is.
        # BETTER: Generate the HTML structure and have a small JS init that picks it up, 
        # OR keep the inline onclick but pass the array.
        
        # Since we are keeping main.js included (per safety rules), we can rely on it for modal logic 
        # IF we adapt it. But the prompt says "Convert... into fully static HTML".
        # The modal logic in main.js (which we saw) looks for `insta-slide` class.
        
        # Let's write the HTML to match what the JS expects:
        # <img src="..." class="insta-slide active" onclick="...">
        
        # To make it truly robust without depending on the `medicalContent` object in JS:
        # We should pass the list of images to the openModal function directly in the onclick.
        all_slides = [f"'{prefix}{j+1}.webp'" for j in range(count)]
        all_slides_str = "[" + ",".join(all_slides) + "]"
        
        slides_html += f'<img src="{img_src}" alt="{title} - תמונה {i+1}" class="insta-slide{active_class}" onclick="openModal({all_slides_str}, {i})">\n'
        
        # Dot
        dots_html += f'<div class="insta-dot{active_class}"></div>\n'
        
    return slides_html, dots_html

# Generate pages
for key, filename in topic_mapping.items():
    print(f"Generating {filename}...")
    
    data = medical_content[key]
    title = data['title']
    subtitle = data['subtitle']
    desc = data['short_description']
    media_image = data['media_image']
    
    # Extract large text blocks from main.js to ensure exactness
    main_text, recovery_text = extract_main_text(key)
    
    # Calculate Next/Prev
    try:
        idx = topic_order.index(key)
        
        # Previous
        if idx > 0:
            prev_key = topic_order[idx - 1]
            prev_data = medical_content[prev_key]
            prev_filename = topic_mapping[prev_key]
            prev_html = f'''
                <a href="{prev_filename}" class="nav-btn prev-btn">
                    <i data-lucide="arrow-right"></i>
                    <div class="nav-text">
                        <span class="nav-label">למאמר הקודם</span>
                        <span class="nav-title">{prev_data['title']}</span>
                    </div>
                </a>'''
        else:
            prev_html = '<div class="nav-spacer"></div>'
            
        # Next
        if idx < len(topic_order) - 1:
            next_key = topic_order[idx + 1]
            next_data = medical_content[next_key]
            next_filename = topic_mapping[next_key]
            next_html = f'''
                <a href="{next_filename}" class="nav-btn next-btn">
                    <div class="nav-text">
                        <span class="nav-label">למאמר הבא</span>
                        <span class="nav-title">{next_data['title']}</span>
                    </div>
                    <i data-lucide="arrow-left"></i>
                </a>'''
        else:
            next_html = '<div class="nav-spacer"></div>'
            
        nav_html = prev_html + next_html
        
    except ValueError:
        nav_html = ""

    # Generate Carousel
    slides_html, dots_html = generate_carousel_html(data['slides_prefix'], data['slides_count'], title)

    # Perform Replacements on the Template
    page_content = template
    
    # 1. Title & Meta
    page_content = page_content.replace('<title>מידע למטופל | ד"ר אבי שזר</title>', f'<title>{title} | ד"ר אבי שזר</title>')
    page_content = page_content.replace(
        'content="דף מידע מפורט למטופלים בנושאי כתף. הסברים על אבחנות, ניתוחים, תהליכי שיקום וטיפול בפציעות כתף שונות."',
        f'content="{desc}"'
    )
    
    # 2. Canonical (Using regex to match the script block or just replacing the href logic if it was static)
    # The existing file has a dynamic script for canonical. We should ideally replace it with a static link.
    # Current:
    # <script>
    #     (function () {
    #         var link = document.querySelector("link[rel='canonical']") || document.createElement('link');
    #         ...
    #         link.setAttribute('href', window.location.href.split('#')[0]);
    #         document.head.appendChild(link);
    #     })();
    # </script>
    
    # We will insert a static link tag BEFORE this script or replace the script.
    # Replacing the script is cleaner.
    canonical_tag = f'<link rel="canonical" href="https://www.catef4u.com/{filename}">'
    # Regex to replace the whole dynamic canonical script block
    page_content = re.sub(r'<script>\s*\(function \(\) \{.*?\)\(\);\s*</script>', canonical_tag, page_content, flags=re.DOTALL)
    
    # 3. OG Tags
    page_content = page_content.replace('content="https://www.catef4u.com/info-page.html"', f'content="https://www.catef4u.com/{filename}"')
    page_content = page_content.replace('content="מידע רפואי למטופל | ד״ר אבי שזר"', f'content="{title} | ד״ר אבי שזר"')
    page_content = page_content.replace('content="מידע מקיף על פציעות כתף, ניתוחים ותהליכי החלמה."', f'content="{desc}"')
     
    # 3.5 Schema.org
    page_content = page_content.replace('"name": "מידע רפואי למטופל"', f'"name": "{title}"')
    page_content = page_content.replace('"url": "https://www.catef4u.com/info-page.html"', f'"url": "https://www.catef4u.com/{filename}"')
    page_content = page_content.replace(
        '"description": "מידע רפואי מקיף בנושא פציעות כתף, ניתוחים ושיקום."',
        f'"description": "{desc}"'
    )
     
    # 4. Header Content
    page_content = page_content.replace('<h1 id="pageTitle">טוען...</h1>', f'<h1 id="pageTitle">{title}</h1>')
    # Use regex for subtitle as it spans lines or has distinct spaces
    page_content = re.sub(r'<p id="pageSubtitle"[^>]*>.*?</p>', f'<p id="pageSubtitle" style="font-size: 1.2rem; max-width: 600px; margin: 1rem auto; opacity: 0.9;">{subtitle}</p>', page_content, flags=re.DOTALL)
    
    # 5. Main Text
    # The template has: <div id="mainText" class="text-content">\n                            <!-- Dynamic Text -->\n                        </div>
    page_content = page_content.replace('<!-- Dynamic Text -->', main_text, 1) # Replace first occurrence (mainText)
    
    # 6. Recovery Text
    # The template has another <!-- Dynamic Text --> for recovery.
    if recovery_text:
        page_content = page_content.replace('<!-- Dynamic Text -->', recovery_text, 1)
        # Ensure it's displayed (remove 'display: none' from parent if set in style - wait, style is inline in script, here it's static HTML)
        # In the template: <div class="info-card" style="margin-top: 2rem;">
        # logic in JS hidden it if empty. Here we just leave it. If empty, the div is empty.
        # If we really want to hide it if empty, we should add style="display:none" to the parent if recovery_text is empty.
    else:
        # Recovery text is empty, hide the container
        page_content = page_content.replace('<div class="info-card" style="margin-top: 2rem;">', '<div class="info-card" style="margin-top: 2rem; display: none;">')
        page_content = page_content.replace('<!-- Dynamic Text -->', '', 1)

    # 7. Media Image (Hero background? No, mediaImage logic in JS uses `document.getElementById('mediaImage').src = ...`)
    # Wait, looking at info-page.html... where is 'mediaImage'?
    # Ah, I don't see 'mediaImage' ID in the provided info-page.html content!
    # Let me check the file content provided in the prompt again.
    # ...
    # Line 133: <div class="hero-shape"></div>
    # Line 142: <!-- Main Content -->
    # ...
    # CHECKING JS: `const mediaImg = document.getElementById('mediaImage');`
    # Warning: I might have missed it or it's dynamically created? 
    # Let's search `info-page.html` content for "mediaImage".
    # Result: Not found in the provided view of `info-page.html` earlier. 
    # Wait, the JS `loadInfoPage` tries to set it. line 1309 in main.js
    # If it's not in the HTML, the JS fails silently or I missed it.
    # Ah, maybe it's the schema image? No. 
    # Let's look at `info-page.html` again.
    # Only `hero` section. Maybe it's a background image?
    # The JS says: `if (mediaImg) mediaImg.src = content.mediaImage;`
    # If `mediaImg` is null, it does nothing.
    # So maybe the template doesn't actually use it explicitly yet, or I missed the element.
    # However, `medicalContent` has `mediaImage`.
    # Let's assume on these specific pages, if the element isn't there, we don't need it.
    # BUT, the `og:image` meta tag should probably be updated.
    page_content = page_content.replace('content="https://www.catef4u.com/images/info_preview.jpg"', f'content="https://www.catef4u.com/{media_image}"')

    # 8. Carousel
    # Replace `<div id="instaCarousel" class="insta-carousel">\n                                <!-- Slides injected via JS -->\n                            </div>`
    page_content = page_content.replace('<!-- Slides injected via JS -->', slides_html)
    
    # Replace `<div id="slideDots" class="insta-dots"></div>`
    page_content = page_content.replace('<div id="slideDots" class="insta-dots"></div>', f'<div id="slideDots" class="insta-dots">{dots_html}</div>')

    # 9. Navigation Buttons
    # Replace `<div class="page-navigation" id="pageNavigation">\n                <!-- Buttons will be injected here by JS -->\n            </div>`
    page_content = page_content.replace('<!-- Buttons will be injected here by JS -->', nav_html)
    
    # 10. Remove loadInfoPage() call
    # The template has a script block that calls loadInfoPage(). We must remove it to prevent redirect.
    # Pattern: 
    # <script>
    #     lucide.createIcons();
    #     // Initialize the info page logic
    #     document.addEventListener('DOMContentLoaded', () => {
    #         if (typeof loadInfoPage === 'function') {
    #             loadInfoPage();
    #         }
    #     });
    # </script>
    
    # We will replace it with just lucide.createIcons();
    replacement_script = '''
    <script>
        lucide.createIcons();
    </script>
    '''
    page_content = re.sub(r'<script>\s*lucide\.createIcons\(\);\s*// Initialize the info page logic.*?\)\s*;\s*</script>', replacement_script, page_content, flags=re.DOTALL)
    
    # Write file
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(page_content)
    
print("Done.")
