import React, { useState } from "react";
import Papa from "papaparse";

const CsvUploadPage: React.FC = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [filename, setFilename] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    setUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data as any[]);
        setColumns(results.meta.fields || []);
        setUploading(false);
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
            <span className="text-3xl">📤</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload CSV Data</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-center">Upload your CSV file to visualize and manipulate dashboard data.</p>
        </div>
        <label className="w-full flex flex-col items-center px-4 py-8 bg-gray-50 dark:bg-gray-900/20 rounded-xl border-2 border-dashed border-blue-400 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-800 transition mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <span className="text-blue-600 font-semibold">Click or drag CSV file here</span>
        </label>
        {uploading && (
          <div className="w-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-600">Uploading...</span>
          </div>
        )}
        {filename && !uploading && (
          <div className="mb-2 text-sm text-blue-700 font-medium">Uploaded: {filename}</div>
        )}
        {csvData.length > 0 ? (
          <div className="overflow-auto border rounded-lg w-full mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 border-b text-blue-700 dark:text-blue-300">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, i) => (
                  <tr key={i} className={i%2===0 ? "bg-gray-50 dark:bg-gray-900/10" : ""}>
                    {columns.map((col) => (
                      <td key={col} className="px-2 py-1 border-b">{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500 mt-4">No data uploaded yet.</div>
        )}
      </div>
    </div>
  );
};

export default CsvUploadPage;
