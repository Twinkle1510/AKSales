const fs = require('fs');

let fileContent = fs.readFileSync('worker-app/src/App.tsx', 'utf8');

// 1. Tasks tab
fileContent = fileContent.replace(
  '<div key={t.id} className="worker-card">',
  '<div key={t.id} className="worker-card" style={{ borderLeft: `4px solid ${t.status === \\'Pending\\' ? \\'var(--color-orange)\\' : \\'var(--color-green)\\'}` }}>'
);

// 2. Production Entry tab
fileContent = fileContent.replace(
  '<div className="worker-card">\\n                  <h3 style={{ margin: \\'0 0 16px 0\\', fontSize: \\'16px\\' }}>Submit Production Batch</h3>',
  '<div className="worker-card" style={{ borderLeft: \\'4px solid var(--primary)\\' }}>\\n                  <h3 style={{ margin: \\'0 0 16px 0\\', fontSize: \\'16px\\' }}>Submit Production Batch</h3>'
);
fileContent = fileContent.replace(
  '<div className="worker-card" style={{ marginTop: \\'16px\\' }}>',
  '<div className="worker-card" style={{ marginTop: \\'16px\\', borderLeft: \\'4px solid var(--color-teal)\\' }}>'
);

// 3. Earnings tab
fileContent = fileContent.replace(
  '<div key={p.id} className="worker-card" style={{ padding: \\'20px\\', display: \\'flex\\', flexDirection: \\'column\\', gap: \\'16px\\' }}>',
  '<div key={p.id} className="worker-card" style={{ padding: \\'20px\\', display: \\'flex\\', flexDirection: \\'column\\', gap: \\'16px\\', borderLeft: `4px solid ${p.status === \\'Approved\\' ? \\'var(--color-green)\\' : \\'var(--color-orange)\\'}` }}>'
);

// 4. Profile tab
fileContent = fileContent.replace(
  '<div className="worker-card" style={{ padding: \\'24px\\', textAlign: \\'center\\' }}>',
  '<div className="worker-card" style={{ padding: \\'24px\\', textAlign: \\'center\\', borderLeft: \\'4px solid var(--primary)\\' }}>'
);
fileContent = fileContent.replace(
  '<div className="worker-card">\\n                  <div style={{ padding: \\'16px\\', borderBottom: \\'1px solid rgba(255,255,255,0.05)\\' }}>\\n                    <h3 style={{ margin: 0, fontSize: \\'15px\\', fontWeight: 600 }}>Work Details</h3>',
  '<div className="worker-card" style={{ borderLeft: \\'4px solid var(--color-teal)\\' }}>\\n                  <div style={{ padding: \\'16px\\', borderBottom: \\'1px solid rgba(0,0,0,0.05)\\' }}>\\n                    <h3 style={{ margin: 0, fontSize: \\'15px\\', fontWeight: 600, color: \\'var(--text-primary)\\' }}>Work Details</h3>'
);
fileContent = fileContent.replace(
  '<div className="worker-card">\\n                  <div style={{ padding: \\'16px\\', borderBottom: \\'1px solid rgba(255,255,255,0.05)\\' }}>\\n                    <h3 style={{ margin: 0, fontSize: \\'15px\\', fontWeight: 600 }}>Preferences</h3>',
  '<div className="worker-card" style={{ borderLeft: \\'4px solid var(--color-orange)\\' }}>\\n                  <div style={{ padding: \\'16px\\', borderBottom: \\'1px solid rgba(0,0,0,0.05)\\' }}>\\n                    <h3 style={{ margin: 0, fontSize: \\'15px\\', fontWeight: 600, color: \\'var(--text-primary)\\' }}>Preferences</h3>'
);

// Fix text colors in Profile tab that assumed dark mode
fileContent = fileContent.replace(
  '<h2 style={{ margin: \\'0 0 4px 0\\', fontSize: \\'20px\\', color: \\'#fff\\' }}>{currentWorker.name}</h2>',
  '<h2 style={{ margin: \\'0 0 4px 0\\', fontSize: \\'20px\\', color: \\'var(--text-primary)\\' }}>{currentWorker.name}</h2>'
);

fs.writeFileSync('worker-app/src/App.tsx', fileContent);
console.log('Fixed borders and colors in worker-app App.tsx');
