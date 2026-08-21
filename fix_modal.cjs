const fs = require('fs');

let fileContent = fs.readFileSync('src/views/PayrollView.tsx', 'utf8');

// I will just re-inject the missing div around the modal inner content.
// The file currently has:
/*
      </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)', width: '600px', maxHeight: '80vh',
*/

const searchStr = `          <div style={{
            backgroundColor: 'var(--bg-secondary)', width: '600px', maxHeight: '80vh',`;

const replacement = `      {/* History Modal */}
      {historyModalEmployee && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)', width: '600px', maxHeight: '80vh',`;

fileContent = fileContent.replace(searchStr, replacement);

fs.writeFileSync('src/views/PayrollView.tsx', fileContent);
console.log("Fixed modal wrapper!");
