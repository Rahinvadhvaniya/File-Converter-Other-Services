"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleConvert = async () => {
    if (files.length === 0) return;

    setConverting(true);

    // Simulate conversion process
    setTimeout(() => {
      setConverting(false);
      alert("Conversion complete! (Demo mode)");
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-red-600 bg-red-50"
            : "border-gray-300 hover:border-red-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {isDragActive ? (
            <p className="text-xl font-semibold text-red-600">Drop your files here...</p>
          ) : (
            <>
              <p className="text-xl font-semibold mb-2">
                Select files or drag & drop them here
              </p>
              <p className="text-gray-500 text-sm">
                PDF, DOC, JPG, PNG, and more supported
              </p>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Selected Files:</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleConvert}
            disabled={converting}
            className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {converting ? "Converting..." : "Convert Files"}
          </button>
        </div>
      )}
    </div>
  );
}
