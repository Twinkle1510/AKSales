const fs = require('fs');
let code = fs.readFileSync('src/views/FlowReportView.tsx', 'utf8');

// The block to replace:
// <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.2fr 1.2fr', gap: '24px', alignItems: 'center' }}>
// ... until ...
// </div>

const startMarker = "<div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.2fr 1.2fr', gap: '24px', alignItems: 'center' }}>";
const endMarker = "                  {/* Flow Footer Metrics */}"; // Next section

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = `
                  {/* Kitchen-Station Style Summary Box */}
                  <div style={{ backgroundColor: '#120F3A', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#ffffff', marginBottom: '16px' }}>
                    
                    {/* Top Row: Fabricator and Photo (Finished Product) */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ width: '80px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {log.productPhoto ? (
                          <img src={log.productPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Product" />
                        ) : (
                          <div style={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A3AED0', marginBottom: '4px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                          <span>Fabricator: <strong style={{ color: '#ffffff' }}>{selectedWorker ? selectedWorker.name : 'Worker'}</strong></span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>{log.productName}</div>
                      </div>
                    </div>
                    
                    {/* Input/Output Data */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#A3AED0' }}>Issued Steel (Input):</span>
                        <strong style={{ color: '#ffffff' }}>{log.materialConsumedQty} kg {log.materialConsumedName ? 'Sheets' : ''}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#A3AED0' }}>Yield (Output):</span>
                        <strong style={{ color: 'var(--color-green)' }}>{log.quantityProduced} pcs {log.productName}</strong>
                      </div>
                    </div>
                  </div>

`;
  
  code = code.substring(0, startIndex) + newContent + code.substring(endIndex);
  fs.writeFileSync('src/views/FlowReportView.tsx', code);
  console.log("Successfully replaced grid with kitchen station style box");
} else {
  console.log("Could not find the markers to replace.");
}
