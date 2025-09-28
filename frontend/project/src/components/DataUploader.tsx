import { ChangeEvent, useState } from "react";

function DataUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus("idle"); // Reset status when a new file is chosen
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    setUploadStatus("uploading");
    setMessage("Uploading...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/upload_data", {
        method: "POST",
        body: formData,
      });

      const result: { message?: string; error?: string } =
        await response.json();

      if (response.ok) {
        setUploadStatus("success");
        setMessage(result.message || "Upload successful!");
      } else {
        setUploadStatus("error");
        setMessage(result.error || "An unknown error occurred.");
      }
    } catch (error) {
      setUploadStatus("error");
      setMessage("Failed to connect to the server.");
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Append New Data
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Upload a new Excel file (.xls or .xlsx) to add its data to the database.
        The dashboard will need to be refreshed to reflect the changes.
      </p>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xls,.xlsx"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploadStatus === "uploading"}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
        </button>
      </div>
      {message && (
        <p
          className={`mt-4 text-sm ${
            uploadStatus === "success"
              ? "text-green-600"
              : uploadStatus === "error"
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default DataUploader;
