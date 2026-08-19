/**
 * Utility functions for exporting data client-side to CSV (Excel-compatible) and PDF (via Styled Printing).
 */

// Helper to convert objects to CSV format and download it
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        let val = row[header];
        if (val === null || val === undefined) val = '';
        // Escape quotes and commas
        val = typeof val === 'string' ? val.replace(/"/g, '""') : val;
        return `"${val}"`;
      }).join(',')
    )
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper to generate a styled printable view for PDF generation
export const exportToPDF = (title: string, headers: string[], rows: any[][], filename: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF reports');
    return;
  }
  try {
    printWindow.document.title = filename;
  } catch (e) {
    // Ignore cross-origin title setting issues if any
  }

  const currentDate = new Date().toLocaleString();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title} - AKSales</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          margin: 40px;
          line-height: 1.6;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0d9488;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
        }
        .logo span {
          color: #0d9488;
        }
        .title {
          font-size: 20px;
          font-weight: 600;
          color: #0d9488;
          margin: 0;
        }
        .meta-info {
          font-size: 12px;
          color: #64748b;
          text-align: right;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 13px;
        }
        th {
          background-color: #0f172a;
          color: white;
          text-align: left;
          padding: 10px 12px;
          font-weight: 600;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .footer {
          margin-top: 50px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          text-align: center;
          font-size: 11px;
          color: #94a3b8;
        }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
        }
        .print-btn {
          background-color: #0d9488;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 20px;
          display: inline-flex;
          align-items: center;
        }
        .print-btn:hover {
          background-color: #0f766e;
        }
      </style>
    </head>
    <body>
      <div class="no-print">
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
      </div>
      <div class="header">
        <div>
          <div class="logo">AK<span>Sales</span></div>
          <div class="title">${title}</div>
        </div>
        <div class="meta-info">
          <div>Generated on: ${currentDate}</div>
          <div>Authorized Admin: Yes</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              ${row.map(cell => `<td>${cell !== null && cell !== undefined ? cell : ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>AKSales Factory Management & Admin Panel. All Rights Reserved. Confidential Document.</p>
      </div>

      <script>
        // Auto trigger print dialogue for ease of use
        window.onload = function() {
          // window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
