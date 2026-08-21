const fs = require('fs');

let content = fs.readFileSync('worker-app/src/index.css', 'utf8');

// 1. Remove centering on body
content = content.replace(
  `body {
  font-family: var(--android-font);
  background-color: var(--bg-android);
  color: var(--text-primary);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}`,
  `body {
  font-family: var(--android-font);
  background-color: #f8f9fc;
  color: var(--text-primary);
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}`
);

// 2. Remove the device-container definition
content = content.replace(
  `/* Device Frame Simulator (Desktop only) */
.device-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b0e14;
}`,
  `/* Removed device simulator container */`
);

// 3. Update .phone-frame
content = content.replace(
  `.phone-frame {
  width: 330px;
  height: 85vh;
  max-height: 640px;
  background-color: #000000;
  border-radius: 40px;
  padding: 12px;
  box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 0 4px #1f2937;
  position: relative;
  display: flex;
  flex-direction: column;
}`,
  `.phone-frame {
  width: 100%;
  max-width: 600px;
  height: 100vh;
  margin: 0 auto;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  position: relative;
  display: flex;
  flex-direction: column;
}`
);

// 4. Update .phone-screen
content = content.replace(
  `.phone-screen {
  flex-grow: 1;
  background-color: var(--bg-screen);
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}`,
  `.phone-screen {
  flex-grow: 1;
  background-color: transparent;
  border-radius: 0;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}`
);

// 5. Hide .phone-notch
content = content.replace(
  `.phone-notch {
  width: 120px;
  height: 28px;
  background-color: #000000;
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0 0 16px 16px;
  z-index: 100;
}`,
  `.phone-notch { display: none; }`
);

// 6. Fix styling for bottom nav items missing CSS
content += `

.worker-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 11px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease;
  flex: 1;
}

.worker-nav-item.active {
  color: #6366f1;
}

.worker-nav-icon-wrapper {
  margin-bottom: 4px;
}

.worker-nav-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
`;

fs.writeFileSync('worker-app/src/index.css', content);
