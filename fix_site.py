#!/usr/bin/env python3
"""Clenzara site - extract inline CSS, add external stylesheet, fix fonts & footers"""

import os, re

BASE = "/home/team/shared/clenzara_launch"

# ==========================================================
# 1. INDEX.HTML - Remove inline <style>, add <link> to CSS
# ==========================================================
with open(f"{BASE}/index.html", 'r') as f:
    idx_html = f.read()

# Find the style block start (after GA script) and end (</style>)
style_start_marker = 'gtag(\'config\',\'G-GBZ5SW0PG9\');</script>\n<style>'
style_end = '</style>'

start_pos = idx_html.find(style_start_marker)
end_pos = idx_html.find(style_end)

if start_pos >= 0 and end_pos > start_pos:
    # Remove from after the </script>\n to after </style>
    before = idx_html[:start_pos + len(style_start_marker) - len('<style>')]  # keep up to </script>
    after = idx_html[end_pos + len(style_end):]
    
    # Also add the CSS link after the Google Fonts link
    fonts_marker = 'family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">'
    fonts_pos = before.find(fonts_marker)
    if fonts_pos >= 0:
        css_link = '\n<link rel="stylesheet" href="/assets/style.css">'
        before = before[:fonts_pos + len(fonts_marker)] + css_link + before[fonts_pos + len(fonts_marker):]
    
    idx_html = before + after
    
    with open(f"{BASE}/index.html", 'w') as f:
        f.write(idx_html)
    print("✅ index.html - inline styles removed, CSS link added")
else:
    print(f"❌ Could not find style block. start={start_pos}, end={end_pos}")

# ==========================================================
# 2. BLOG PAGES - Replace inline <style> with <link> to external CSS
# ==========================================================
blog_files = [
    "17-signs-of-parasites-in-humans.html",
    "biofilm-disruptors.html",
    "drainage-pathways.html",
    "full-moon-parasite-connection.html",
    "pro-app-conversion.html"
]

for bf in blog_files:
    fp = f"{BASE}/blog/{bf}"
    if not os.path.exists(fp):
        print(f"  ⚠️  {bf} not found")
        continue
    
    with open(fp, 'r') as f:
        html = f.read()
    
    changes = []
    
    # 2a. Replace GA placeholder ID with real one
    html = html.replace('G-XXXXXXXXXX', 'G-GBZ5SW0PG9')
    
    # 2b. Remove inline <style>...</style> (the entire block between <style> and </style>)
    style_match = re.search(r'<style>.*?</style>', html, re.DOTALL)
    if style_match:
        # Add CSS link reference
        html = html.replace(style_match.group(), '<link rel="stylesheet" href="/assets/style.css">')
        changes.append("style replaced with CSS link")
    
    # 2c. Update body font-family to use var-based fonts
    html = html.replace(
        "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: var(--text); line-height: 1.6; background: white; }",
        ""
    )
    
    # 2d. Fix the footer to include both Affiliate and FDA disclaimers
    # Check if both disclaimers exist
    has_affiliate = 'Affiliate Disclosure' in html
    has_fda = 'FDA Disclaimer' in html
    
    if not has_affiliate or not has_fda:
        # Find the footer and ensure both disclaimers exist
        footer_match = re.search(r'<footer>.*?</footer>', html, re.DOTALL)
        if footer_match:
            old_footer = footer_match.group()
            
            aff_html = '<div class="footer-disclosure" style="max-width: 600px; margin: 0 auto 0.5rem; font-size: 0.7rem; background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 8px; line-height: 1.6;">\n      <strong>Affiliate Disclosure:</strong> Clenzara.com is a participant in the Amazon Services LLC Associates Program. We earn commissions from qualifying purchases made through links on this page at no additional cost to you. This helps us keep the site free and provide expert education.\n    </div>'
            fda_html = '<div class="footer-disclosure" style="max-width: 600px; margin: 0 auto 1rem; font-size: 0.7rem; background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 8px; line-height: 1.6;">\n      <strong>FDA Disclaimer:</strong> The statements on this website have not been evaluated by the Food and Drug Administration. Our products and protocols are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare provider.\n    </div>'
            
            new_footer = f'<footer>\n    {aff_html}\n    {fda_html}\n    <p>© 2025 Clenzara.com · <a href="/privacy-policy.html">Privacy Policy</a> · <a href="/terms.html">Terms of Use</a> · <a href="mailto:hello@clenzara.com">hello@clenzara.com</a></p>\n  </footer>'
            html = html.replace(old_footer, new_footer)
            changes.append("footer fixed with both disclaimers")
    
    # 2e. Add medical disclaimer if not present
    if 'med-disclaimer' not in html:
        body_start = html.find('<body>')
        if body_start >= 0:
            med_disc = '<div class="med-disclaimer"><p>⚠️ <strong>Medical Disclaimer:</strong> Information is for educational purposes only. Always consult your healthcare provider before starting any cleanse protocol. <a href="/terms.html">Learn more</a></p></div>\n'
            html = html[:body_start + 6] + '\n' + med_disc + html[body_start + 6:]
            changes.append("medical disclaimer added")
    
    with open(fp, 'w') as f:
        f.write(html)
    print(f"✅ blog/{bf} - {', '.join(changes)}")

# ==========================================================
# 3. LEARN PAGES - Same treatment
# ==========================================================
learn_files = [
    f for f in os.listdir(f"{BASE}/learn") 
    if f.endswith('.html') and f != 'generate_micro_blogs.py'
]

for lf in learn_files:
    fp = f"{BASE}/learn/{lf}"
    if not os.path.exists(fp):
        continue
    
    with open(fp, 'r') as f:
        html = f.read()
    
    changes = []
    
    # Replace GA ID
    html = html.replace('G-XXXXXXXXXX', 'G-GBZ5SW0PG9')
    
    # Remove inline style block
    style_match = re.search(r'<style>.*?</style>', html, re.DOTALL)
    if style_match:
        html = html.replace(style_match.group(), '<link rel="stylesheet" href="/assets/style.css">')
        changes.append("style replaced with CSS link")
    
    # Remove old body font-family that conflicts
    html = html.replace(
        "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: var(--text); line-height: 1.6; background: white; }",
        ""
    )
    
    # Fix footer - ensure both disclaimers
    has_affiliate = 'Affiliate Disclosure' in html
    has_fda = 'FDA Disclaimer' in html
    
    if not has_affiliate or not has_fda:
        footer_match = re.search(r'<footer>.*?</footer>', html, re.DOTALL)
        if footer_match:
            old_footer = footer_match.group()
            
            aff_html = '<div class="footer-disclosure" style="max-width: 600px; margin: 0 auto 0.5rem; font-size: 0.7rem; background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 8px; line-height: 1.6;">\n      <strong>Affiliate Disclosure:</strong> Clenzara.com is a participant in the Amazon Services LLC Associates Program. We earn commissions from qualifying purchases made through links on this page at no additional cost to you. This helps us keep the site free and provide expert education.\n    </div>'
            fda_html = '<div class="footer-disclosure" style="max-width: 600px; margin: 0 auto 1rem; font-size: 0.7rem; background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 8px; line-height: 1.6;">\n      <strong>FDA Disclaimer:</strong> The statements on this website have not been evaluated by the Food and Drug Administration. Our products and protocols are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare provider.\n    </div>'
            
            new_footer = f'<footer>\n    {aff_html}\n    {fda_html}\n    <p>© 2025 Clenzara.com · <a href="/privacy-policy.html">Privacy Policy</a> · <a href="/terms.html">Terms of Use</a> · <a href="mailto:hello@clenzara.com">hello@clenzara.com</a></p>\n  </footer>'
            html = html.replace(old_footer, new_footer)
            changes.append("footer fixed with both disclaimers")
    
    # Add medical disclaimer if not present
    if 'med-disclaimer' not in html:
        body_start = html.find('<body>')
        if body_start >= 0:
            med_disc = '<div class="med-disclaimer"><p>⚠️ <strong>Medical Disclaimer:</strong> Information is for educational purposes only. Always consult your healthcare provider before starting any cleanse protocol. <a href="/terms.html">Learn more</a></p></div>\n'
            html = html[:body_start + 6] + '\n' + med_disc + html[body_start + 6:]
            changes.append("medical disclaimer added")
    
    with open(fp, 'w') as f:
        f.write(html)
    print(f"✅ learn/{lf} - {', '.join(changes)}")

# ==========================================================
# 4. PRIVACY-POLICY & TERMS - Add CSS link + Playfair/Inter fonts
# ==========================================================
for fname in ["privacy-policy.html", "terms.html"]:
    fp = f"{BASE}/{fname}"
    with open(fp, 'r') as f:
        html = f.read()
    
    changes = []
    
    # Add Google Fonts link
    if 'fonts.googleapis.com' not in html:
        html = html.replace(
            '<link rel="icon"',
            '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">\n  <link rel="icon"'
        )
        changes.append("Google Fonts link added")
    
    # Add external CSS link
    if 'assets/style.css' not in html:
        # Add after favicon
        html = html.replace(
            '/assets/favicon_web.png">',
            '/assets/favicon_web.png">\n  <link rel="stylesheet" href="/assets/style.css">'
        )
        changes.append("CSS link added")
    
    # Remove inline style block
    style_match = re.search(r'<style>.*?</style>', html, re.DOTALL)
    if style_match:
        html = html.replace(style_match.group(), '')
        html = html.replace('\n  <link', '\n<link')  # clean up double spaces
        changes.append("inline styles removed")
    
    # Add top-level class for legal page
    html = html.replace('<body>', '<body class="legal-page">')
    
    # Ensure footer has both disclaimers
    has_affiliate = 'Affiliate Disclosure' in html
    has_fda = 'FDA Disclaimer' in html
    
    if not has_affiliate or not has_fda:
        footer_match = re.search(r'<footer>.*?</footer>', html, re.DOTALL)
        if footer_match:
            old_footer = footer_match.group()
            
            aff_html = '<div class="footer-disclosure" style="max-width: 600px; margin: 0 auto 0.5rem; font-size: 0.7rem; background: rgba(255,255,255,0.04); padding: 0.75rem; border-radius: 8px; line-height: 1.5;">\n      <strong>Affiliate Disclosure:</strong> Clenzara.com is a participant in the Amazon Services LLC Associates Program. We earn commissions from qualifying purchases made through links on this page.\n    </div>'
            fda_html = '<div class="footer-disclosure" style="max-width: 600px; margin: 0 auto 1rem; font-size: 0.7rem; background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 8px; line-height: 1.5;">\n      <strong>FDA Disclaimer:</strong> The statements on this website have not been evaluated by the Food and Drug Administration. Our products and protocols are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare provider.\n    </div>'
            
            new_footer = f'<footer>\n    {aff_html}\n    {fda_html}\n    <p>© <script>document.write(new Date().getFullYear())</script> Clenzara.com · <a href="/privacy-policy">Privacy</a> · <a href="/terms">Terms</a> · <a href="mailto:hello@clenzara.com">Contact</a></p></footer>'
            html = html.replace(old_footer, new_footer)
            changes.append("footer fixed with both disclaimers")
    
    with open(fp, 'w') as f:
        f.write(html)
    print(f"✅ {fname} - {', '.join(changes)}")

print("\n=== ALL DONE ===")