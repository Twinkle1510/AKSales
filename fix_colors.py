import sys

with open('worker-app/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hardcoded white colors with primary text color for light mode
content = content.replace("color: '#ffffff'", "color: 'var(--text-primary)'")
content = content.replace("color: 'white'", "color: 'var(--text-primary)'")
content = content.replace("color: '#fff'", "color: 'var(--text-primary)'")

# Except for badges and primary buttons which should remain white
content = content.replace("color: 'var(--text-primary)', backgroundColor: 'rgba(0,0,0,0.5)'", "color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)'")
content = content.replace("color: 'var(--text-primary)', padding: '4px'", "color: '#ffffff', padding: '4px'") # Bell icon button (if it has background)
# Actually the Bell icon button has `background: 'none'`, so it should NOT be white on a white header!
content = content.replace("color: 'var(--text-primary)', padding: '4px', cursor: 'pointer', position: 'relative'", "color: 'var(--text-primary)', padding: '4px', cursor: 'pointer', position: 'relative'")

with open('worker-app/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed colors in App.tsx")
