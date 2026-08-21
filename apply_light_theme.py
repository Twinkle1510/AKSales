import sys
import re

with open('worker-app/src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Change variables for light mode
css = re.sub(r'--bg-screen:\s*#[0-9a-fA-F]+;', '--bg-screen: #f4f7fe;', css)
css = re.sub(r'--bg-primary:\s*#[0-9a-fA-F]+;', '--bg-primary: #ffffff;', css)
css = re.sub(r'--bg-secondary:\s*#[0-9a-fA-F]+;', '--bg-secondary: #f8fafc;', css)
css = re.sub(r'--text-primary:\s*#[0-9a-fA-F]+;', '--text-primary: #1e293b;', css)
css = re.sub(r'--text-secondary:\s*#[0-9a-fA-F]+;', '--text-secondary: #64748b;', css)
css = re.sub(r'--text-muted:\s*#[0-9a-fA-F]+;', '--text-muted: #94a3b8;', css)
css = re.sub(r'--border:\s*rgba\([^)]+\);', '--border: #e2e8f0;', css)
css = re.sub(r'--border-dark:\s*rgba\([^)]+\);', '--border-dark: #cbd5e1;', css)

# Fix worker-card to have the attractive border
worker_card_old = r'\.worker-card\s*\{[^}]*\}'
worker_card_new = """\.worker-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 16px;
  border-left: 6px solid #8b5cf6; /* Attractive purple border by default */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border-top: 1px solid var(--border);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}"""
css = re.sub(worker_card_old, worker_card_new, css)

# Make sure body has correct color
css = css.replace("color: var(--text-primary);", "color: var(--text-primary);\n  background-color: var(--bg-screen);")

# Save
with open('worker-app/src/index.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated index.css to Light Mode with attractive borders")
