"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setConverting(true);

    try {
      // Simulate upload
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Upload failed");

      const uploadData = await uploadResponse.json();

      // Simulate conversion
      const convertResponse = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: uploadData.filename,
          conversionType: "pdf-to-word",
        }),
      });

      if (!convertResponse.ok) throw new Error("Conversion failed");

      alert("PDF converted to Word successfully! (Demo mode)");
      setFile(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Conversion failed. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-red-600 hover:text-red-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">PDF to Word Converter</h1>
          <p className="text-gray-600">
            Convert your PDF files to editable Word documents in seconds
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF file
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-red-50 file:text-red-700
                hover:file:bg-red-100
                cursor-pointer"
            />
          </div>

          {file && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={!file || converting}
            className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {converting ? "Converting..." : "Convert to Word"}
          </button>

          <div className="mt-6 text-sm text-gray-500 text-center">
            <p>✓ Files are automatically deleted after conversion</p>
            <p>✓ Maximum file size: 50 MB</p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
          <h2 className="font-bold text-xl mb-4">How to convert PDF to Word:</h2>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="font-bold text-red-600">1.</span>
              <span>Select your PDF file using the file picker above</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-red-600">2.</span>
              <span>Click the "Convert to Word" button</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-red-600">3.</span>
              <span>Wait a few seconds for the conversion to complete</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-red-600">4.</span>
              <span>Download your converted Word document</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
