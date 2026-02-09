
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn("No data available to export.");
    return;
  }

  // Get headers from the first object keys
  const headers = Object.keys(data[0]);
  
  // Construct CSV content
  const csvRows = [];
  
  // Add Header Row
  csvRows.push(headers.join(','));

  // Add Data Rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      // Handle null/undefined
      if (val === null || val === undefined) return '""';
      
      // Handle arrays (like claims docs)
      const stringVal = Array.isArray(val) ? val.join('; ') : String(val);
      
      // Escape double quotes and wrap in quotes
      const escaped = stringVal.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  // Create Blob and Trigger Download
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
