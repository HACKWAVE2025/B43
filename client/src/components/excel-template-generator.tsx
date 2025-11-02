import React from 'react';
import * as XLSX from 'xlsx';

export function downloadExcelTemplate() {
  // Create sample data
  const templateData = [
    {
      anxietyLevel: 10,
      mentalHealthHistory: 'No',
      headache: 3,
      financialCondition: 'Yes',
      safety: 4,
    },
  ];

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 22 },
    { wch: 12 },
    { wch: 20 },
    { wch: 10 },
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mental Health Data');

  // Generate file and trigger download
  XLSX.writeFile(workbook, 'vishuddhi_mental_health_template.xlsx');
}

export function ExcelTemplateButton() {
  return (
    <button
      onClick={downloadExcelTemplate}
      className="text-sm text-blue-600 hover:text-blue-800 underline"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        font: 'inherit',
      }}
    >
      Download Excel Template
    </button>
  );
}
