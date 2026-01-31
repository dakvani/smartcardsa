export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) {
    return;
  }

  // Get headers from first row
  const headers = Object.keys(data[0]);

  // Convert data to CSV format
  const csvRows: string[] = [];
  
  // Add header row
  csvRows.push(headers.map(h => `"${h}"`).join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      
      // Handle different types
      if (value === null || value === undefined) {
        return '""';
      }
      if (typeof value === 'object') {
        // Escape quotes and wrap in quotes
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`;
      }
      return `"${String(value)}"`;
    });
    csvRows.push(values.join(','));
  }

  // Create blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
