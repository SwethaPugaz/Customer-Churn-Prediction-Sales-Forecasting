import Papa from "papaparse";
import React, { useCallback, useEffect, useRef, useState } from "react";

type Row = Record<string, any>;

const BACKEND_UPLOAD_URL = "http://127.0.0.1:5000/api/upload_csv"; // adjust if needed

const CsvUploadPage: React.FC = () => {
  const [csvData, setCsvData] = useState<Row[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [filename, setFilename] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"info" | "success" | "error">(
    "info"
  );
  const [dragActive, setDragActive] = useState(false);
  const lastFileRef = useRef<File | null>(null);

  // parse file with PapaParse
  const parseFile = useCallback((file: File) => {
    setStatusMessage(null);
    setUploading(true);
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data || []);
        setColumns(results.meta.fields || []);
        setUploading(false);
        setStatusMessage(`Parsed ${results.data?.length ?? 0} rows`);
        setStatusType("success");
      },
      error: (err) => {
        console.error("PapaParse error:", err);
        setCsvData([]);
        setColumns([]);
        setUploading(false);
        setStatusMessage("Failed to parse CSV file.");
        setStatusType("error");
      },
    });
  }, []);

  // handle input selection
  const handleFileInput = (file?: File | null) => {
    if (!file) return;
    // prevent re-parsing the same file object repeatedly
    if (
      lastFileRef.current &&
      file.name === lastFileRef.current.name &&
      file.size === lastFileRef.current.size
    ) {
      setStatusMessage("Same file selected — already parsed.");
      setStatusType("info");
      return;
    }
    lastFileRef.current = file;
    setFilename(file.name);
    parseFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    handleFileInput(file);
  };

  // drag & drop handlers
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setStatusMessage("Please upload a .csv file.");
      setStatusType("error");
      return;
    }
    handleFileInput(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  // remove selected file / clear preview
  const handleRemoveFile = () => {
    setFilename("");
    setCsvData([]);
    setColumns([]);
    lastFileRef.current = null;
    setStatusMessage(null);
    setStatusType("info");
  };

  // download parsed JSON
  const downloadJson = () => {
    if (!csvData.length) {
      setStatusMessage("No parsed data to download.");
      setStatusType("error");
      return;
    }
    const blob = new Blob(
      [JSON.stringify({ filename, rows: csvData }, null, 2)],
      {
        type: "application/json",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (filename || "data") + ".json";
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage("JSON download started.");
    setStatusType("success");
  };

  // upload original file to backend as multipart/form-data
  const uploadToServer = async () => {
    if (!lastFileRef.current) {
      setStatusMessage("No file selected to upload.");
      setStatusType("error");
      return;
    }

    setUploading(true);
    setStatusMessage("Uploading to server...");
    setStatusType("info");

    const form = new FormData();
    form.append("file", lastFileRef.current, lastFileRef.current.name);

    try {
      const resp = await fetch(BACKEND_UPLOAD_URL, {
        method: "POST",
        body: form,
      });
      const json = await resp.json().catch(() => null);

      if (resp.ok) {
        setStatusMessage((json?.message as string) || "Uploaded successfully.");
        setStatusType("success");
      } else {
        setStatusMessage(
          (json?.error as string) || `Upload failed (${resp.status})`
        );
        setStatusType("error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatusMessage("Failed to connect to server.");
      setStatusType("error");
    } finally {
      setUploading(false);
    }
  };

  // small UX: clear drag highlight when escape pressed
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDragActive(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white dark:to-gray-100 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: upload card */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-3xl">📤</span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-black dark:text-black">
                  Upload CSV Data
                </h1>
                <p className="text-sm text-black dark:text-gray-700 mt-1">
                  Drop a CSV file or click to choose. The CSV will be parsed
                  locally for preview. You can then upload the original file to
                  the server or download the parsed JSON.
                </p>
              </div>
            </div>

            <label
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              htmlFor="file-input"
              className={`mt-6 block rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                dragActive
                  ? "border-blue-500 bg-blue-50/60"
                  : "border-gray-200 bg-gray-100 dark:bg-white/60"
              }`}
            >
              <input
                id="file-input"
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (!f) return;
                  if (!f.name.toLowerCase().endsWith(".csv")) {
                    setStatusMessage("Only .csv files are supported.");
                    setStatusType("error");
                    return;
                  }
                  handleFileInput(f);
                }}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <div className="text-lg font-medium text-blue-600">
                  Click or drop CSV here
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Accepted: .csv · Max recommended size: 10MB
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  {filename || "No file selected"}
                </div>
              </div>
            </label>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={uploadToServer}
                disabled={!lastFileRef.current || uploading}
                className={`px-4 py-2 rounded-lg font-medium shadow-sm transition ${
                  !lastFileRef.current || uploading
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {uploading ? "Uploading..." : "Upload to Server"}
              </button>

              <button
                onClick={downloadJson}
                disabled={!csvData.length}
                className={`px-4 py-2 rounded-lg font-medium shadow-sm transition ${
                  !csvData.length
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Download JSON
              </button>

              <button
                onClick={handleRemoveFile}
                className="ml-auto text-sm text-red-600 hover:underline"
              >
                Remove File
              </button>
            </div>

            {statusMessage && (
              <div
                className={`mt-4 inline-block px-3 py-1 rounded-full text-sm ${
                  statusType === "success"
                    ? "bg-green-50 text-green-700"
                    : statusType === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {statusMessage}
              </div>
            )}
          </div>

          {/* Right: preview table */}
          <div className="flex-1">
            <div className="bg-gray-100 dark:bg-white rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-black">
                    Preview
                  </h2>
                  <div className="text-sm text-black dark:text-gray-700">
                    {csvData.length} rows • {columns.length} columns
                  </div>
                </div>
              </div>

              {csvData.length > 0 ? (
                <div className="overflow-auto max-h-[420px] border border-gray-100 dark:border-gray-700 rounded">
                  <table className="min-w-full text-sm">
                    <thead className="sticky top-0 bg-gray-200 dark:bg-white/50 z-10">
                      <tr>
                        {columns.map((col) => (
                          <th
                            key={col}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-black border-b"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.map((row, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx % 2 === 0
                              ? "bg-gray-100 dark:bg-white/5"
                              : "bg-gray-200 dark:bg-white/10"
                          }
                        >
                          {columns.map((col) => (
                            <td
                              key={col}
                              className="px-3 py-2 align-top border-b text-xs text-white dark:text-black"
                            >
                              {String(row[col] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  No preview available yet — pick a CSV to see a preview here.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          Tip: If your CSV has many columns, consider downloading the parsed
          JSON and inspecting it locally.
        </div>
      </div>
    </div>
  );
};

export default CsvUploadPage;
