import os
import re

def audit_files(directory):
    results = []
    html_files = [f for f in os.listdir(directory) if f.endswith('.html')]
    
    # Regex patterns
    title_pattern = re.compile(r'<title>(.*?)</title>', re.IGNORECASE | re.DOTALL)
    meta_desc_pattern = re.compile(r'<meta\s+name="description"\s+content="(.*?)"', re.IGNORECASE)
    h1_pattern = re.compile(r'<h1.*?>', re.IGNORECASE)
    canonical_pattern = re.compile(r'<link\s+rel="canonical"\s+href="(.*?)"', re.IGNORECASE)
    schema_pattern = re.compile(r'"@type"\s*:\s*"(.*?)"', re.IGNORECASE)
    
    for filename in html_files:
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            title_match = title_pattern.search(content)
            title = title_match.group(1).strip() if title_match else "MISSING"
            
            desc_match = meta_desc_pattern.search(content)
            desc = desc_match.group(1).strip() if desc_match else None
            
            h1s = h1_pattern.findall(content)
            
            canonical_match = canonical_pattern.search(content)
            canonical = canonical_match.group(1).strip() if canonical_match else None
            
            schemas = schema_pattern.findall(content)
            # Filter schemas to remove common non-schema JSON strings if needed
            relevant_schemas = list(set([s for s in schemas if s in ['Physician', 'MedicalWebPage', 'BreadcrumbList', 'FAQPage', 'Organization']]))
            
            results.append({
                'file': filename,
                'title': title,
                'meta_desc': desc,
                'h1_count': len(h1s),
                'canonical': canonical,
                'schemas': relevant_schemas
            })
            
    return results

directory = '/Users/sagihoz/דמו'
audit_results = audit_files(directory)

print(f"{'File':<35} | {'H1':<2} | {'Title':<40} | {'Schemas'}")
print("-" * 100)
for r in audit_results:
    schemas_str = ", ".join(r['schemas']) if r['schemas'] else "NONE"
    print(f"{r['file']:<35} | {r['h1_count']:<2} | {str(r['title'])[:39]:<40} | {schemas_str}")

# Check for missing meta descriptions
missing_docs = [r['file'] for r in audit_results if not r['meta_desc']]
if missing_docs:
    print("\nMissing Meta Descriptions:", ", ".join(missing_docs))

# Check for H1 issues
h1_issues = [r['file'] for r in audit_results if r['h1_count'] != 1]
if h1_issues:
    print("\nH1 Issues (Count != 1):", ", ".join(h1_issues))
