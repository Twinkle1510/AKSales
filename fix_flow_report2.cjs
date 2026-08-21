const fs = require('fs');
let code = fs.readFileSync('src/views/FlowReportView.tsx', 'utf8');

const startMarker = "                  {/* Kitchen-Station Style Summary Box */}";
const endMarker = "                  {/* Flow Footer Metrics */}"; // Next section

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = `
                  {/* Two-Column Dark Navy Summary Boxes for Input & Output */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                    
                    {/* INPUT MATERIAL BOX */}
                    <div style={{ backgroundColor: '#120F3A', padding: '16px', borderRadius: '8px', color: '#ffffff', fontSize: '13px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '90px', height: '70px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                          {log.materialPhoto ? (
                            <img src={log.materialPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Input" />
                          ) : (
                            <div style={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'var(--color-orange)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '4px' }}>INPUT MATERIAL</div>
                          <div style={{ fontWeight: 700, fontSize: '14px', lineHeight: '1.3' }}>{log.materialConsumedName || 'SS Sheets'}</div>
                        </div>
                      </div>
                      
                      <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#A3AED0' }}>Issued Steel:</span>
                          <strong style={{ color: '#ffffff', fontSize: '14px' }}>{log.materialConsumedQty} KG</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#A3AED0' }}>Fabricator:</span>
                          <strong style={{ color: '#ffffff' }}>{log.workerName}</strong>
                        </div>
                      </div>
                    </div>

                    {/* OUTPUT PRODUCT BOX */}
                    <div style={{ backgroundColor: '#120F3A', padding: '16px', borderRadius: '8px', color: '#ffffff', fontSize: '13px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '90px', height: '70px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                          {log.productPhoto ? (
                            <img src={log.productPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Output" />
                          ) : (
                            <div style={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'var(--color-green)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '4px' }}>FINISHED PRODUCT</div>
                          <div style={{ fontWeight: 700, fontSize: '14px', lineHeight: '1.3' }}>{log.productName}</div>
                        </div>
                      </div>
                      
                      <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#A3AED0' }}>Yield (Output):</span>
                          <strong style={{ color: 'var(--color-green)', fontSize: '14px' }}>{log.quantityProduced} pcs</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#A3AED0' }}>Status:</span>
                          <strong style={{ color: log.status === 'Approved' ? 'var(--color-green)' : 'var(--color-orange)' }}>{log.status}</strong>
                        </div>
                      </div>
                    </div>

                  </div>

`;
  
  code = code.substring(0, startIndex) + newContent + code.substring(endIndex);
  fs.writeFileSync('src/views/FlowReportView.tsx', code);
  console.log("Successfully replaced with dual navy boxes.");
} else {
  console.log("Could not find the markers to replace.");
}
