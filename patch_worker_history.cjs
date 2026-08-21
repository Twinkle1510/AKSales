const fs = require('fs');

let fileContent = fs.readFileSync('worker-app/src/App.tsx', 'utf8');

const searchMarkerStart = '                    workerProduction.map(p => (';
const searchMarkerEnd = '                      </div>\n                    ))\n                  )}';

const startIndex = fileContent.indexOf(searchMarkerStart);
const endIndex = fileContent.indexOf(searchMarkerEnd) + searchMarkerEnd.length;

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find replacement block");
    process.exit(1);
}

const replacement = `                    workerProduction.map(p => (
                      <div key={p.id} className="worker-card" style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 700 }}>{p.date}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Batch: {p.batchNumber}</div>
                          </div>
                          <span className={\`badge \${p.status === 'Approved' ? 'badge-success' : 'badge-pending'}\`}>
                            {p.status === 'Approved' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Product (Item)</span>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>{p.productName}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Quantity Yield</span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-green)' }}>{p.quantityProduced} Units</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fixed Wage Rate</span>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>₹ {currentWorker.baseRate} / Unit</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Calculation</span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{p.quantityProduced} x ₹{currentWorker.baseRate}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Earned</div>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)' }}>₹ {(p.quantityProduced * currentWorker.baseRate).toLocaleString()}</div>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>{p.status === 'Approved' ? \`Approved on \${p.approvedDate || p.date}\` : 'Pending supervisor approval'}</div>
                      </div>
                    ))
                  )}`;

fileContent = fileContent.substring(0, startIndex) + replacement + fileContent.substring(endIndex);

fs.writeFileSync('worker-app/src/App.tsx', fileContent);
console.log("Patched worker app history");
