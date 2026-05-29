#!/usr/bin/env python3
"""Add Google Fonts links to blog and learn pages"""
import os

base = "/home/team/shared/clenzara_launch"

font_link = '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">\n  <link rel="stylesheet" href="/assets/style.css">'

for folder in ['blog', 'learn']:
    for fname in os.listdir(f'{base}/{folder}'):
        if not fname.endswith('.html'):
            continue
        fp = f'{base}/{folder}/{fname}'
        with open(fp) as f:
            html = f.read()
        
        if 'fonts.googleapis.com' not in html:
            html = html.replace(
                '<link rel="stylesheet" href="/assets/style.css">',
                font_link
            )
            with open(fp, 'w') as f:
                f.write(html)
            print(f'Fixed: {folder}/{fname}')
        else:
            print(f'OK:    {folder}/{fname}')

print("Done!")