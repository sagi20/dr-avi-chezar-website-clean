import os
import re

def fix_html_files(directory):
    html_files = [f for f in os.listdir(directory) if f.endswith('.html')]
    
    disclaimer_html = """
            <div class="footer-disclaimer" style="font-size: 0.85rem; color: rgba(255,255,255,0.4); margin-bottom: 1.5rem; line-height: 1.5; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1.5rem; text-align: center;">
                המידע המופיע באתר נועד למידע כללי בלבד ואינו מהווה ייעוץ רפואי, אבחנה, חוות דעת מקצועית או תחליף להתייעצות עם רופא. בכל מקרה של בעיה רפואית יש לפנות לרופא המטפל, ובמקרה חירום יש לפנות למד״א או לחדר מיון. השימוש באתר וההסתמכות על המידע שבו הם באחריות המשתמש בלבד.
            </div>"""

    for filename in html_files:
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 1. Fix Hierarchy (H3 -> H2 for top level info cards)
        # Specifically targeting common standard section headers
        content = re.sub(r'<h3>על הבעיה / הטיפול</h3>', r'<h2>על הבעיה / הטיפול</h2>', content)
        content = re.sub(r'<h3>תהליך ההחלמה</h3>', r'<h2>תהליך ההחלמה</h2>', content)
        
        # 2. Add Medical Disclaimer to Footer if not already present
        if '<div class="footer-disclaimer"' not in content:
            # Insert before <div class="footer-legal-links"> or before the end of footer-bottom
            if '<div class="footer-bottom">' in content:
                content = content.replace('<div class="footer-bottom">', '<div class="footer-bottom">' + disclaimer_html)
                
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
            
    print(f"Processed {len(html_files)} files.")

directory = '/Users/sagihoz/דמו'
fix_html_files(directory)
