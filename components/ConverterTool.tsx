"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";

interface ConverterToolProps {
  title: string;
  description: string;
  acceptedFormats: string;
  mimeTypes: Record<string, string[]>;
  conversionType: string;
  icon: string;
  steps: string[];
  outputFormat: string;
  multiple?: boolean;
  options?: Record<string, string>;
}

export default function ConverterTool({
  title,
  description,
  mimeTypes,
  conversionType,
  icon,
  steps,
  outputFormat,
  multiple = false,
}: ConverterToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFilename, setOutputFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [rotateAngle, setRotateAngle] = useState("90");
  const [password, setPassword] = useState("");

  const onDrop = useCallback(
    (accepted: File[]) => {
      setFiles(multiple ? accepted : accepted.slice(0, 1));
      setDownloadUrl(null);
      setOutputFilename(null);
      setError(null);
    },
    [multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: mimeTypes,
    multiple,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setConverting(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const uploadedFilenames: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || "Upload failed");
        }

        const uploadData = await uploadRes.json();
        uploadedFilenames.push(uploadData.filename);
      }

      const options: Record<string, unknown> = {};
      if (conversionType === "split-pdf" && pageRange) options.pages = pageRange;
      if (conversionType === "rotate-pdf") options.angle = parseInt(rotateAngle);
      if (conversionType === "unlock-pdf" && password) options.password = password;
      if (conversionType === "merge-pdf" && uploadedFilenames.length > 1) {
        options.mergeFiles = uploadedFilenames.slice(1);
      }

      const convertRes = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: uploadedFilenames[0],
          conversionType,
          options,
        }),
      });

      if (!convertRes.ok) {
        const data = await convertRes.json();
        throw new Error(data.error || "Conversion failed");
      }

      const convertData = await convertRes.json();
      setDownloadUrl(convertData.downloadUrl);
      setOutputFilename(convertData.filename);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Conversion failed. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setDownloadUrl(null);
    setOutputFilename(null);
    setError(null);
    setPageRange("");
    setPassword("");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-red-600 hover:text-red-700 flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{icon}</div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-gray-600 text-lg">{description}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {!downloadUrl ? (
            <>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-red-400 hover:bg-red-50/30"
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-5xl mb-4">📁</div>
                {isDragActive ? (
                  <p className="text-red-600 font-semibold text-lg">Drop your file here...</p>
                ) : (
                  <>
                    <p className="text-gray-700 font-semibold text-lg mb-1">
                      Drag & drop {multiple ? "files" : "a file"} here
                    </p>
                    <p className="text-gray-500 text-sm">or click to browse</p>
                  </>
                )}
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl flex-shrink-0">📄</span>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(i)}
                        className="text-red-500 hover:text-red-700 ml-3 flex-shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              )}

              {conversionType === "split-pdf" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Range (e.g. 1-3 or 1,3,5)
                  </label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="Leave blank for page 1 only"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              )}

              {conversionType === "rotate-pdf" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rotation Angle
                  </label>
                  <select
                    value={rotateAngle}
                    onChange={(e) => setRotateAngle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value="90">90° Clockwise</option>
                    <option value="180">180°</option>
                    <option value="270">270° Clockwise (90° Counter-clockwise)</option>
                  </select>
                </div>
              )}

              {conversionType === "unlock-pdf" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PDF Password (if any)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password if PDF is protected"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleConvert}
                disabled={files.length === 0 || converting}
                className="mt-6 w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {converting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Converting...
                  </span>
                ) : (
                  `Convert to ${outputFormat}`
                )}
              </button>

              <div className="mt-4 flex flex-wrap gap-3 justify-center text-sm text-gray-500">
                <span>✓ Files deleted after conversion</span>
                <span>✓ Max file size: 50MB</span>
                <span>✓ Secure &amp; private</span>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Conversion Complete!</h2>
              <p className="text-gray-500 mb-6">
                Your file has been converted to {outputFormat}
              </p>
              <a
                href={downloadUrl}
                download={outputFilename ?? undefined}
                className="inline-block bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-pink-700 transition mb-4"
              >
                ⬇ Download {outputFormat}
              </a>
              <div className="mt-4">
                <button
                  onClick={handleReset}
                  className="text-red-600 hover:text-red-700 font-medium underline"
                >
                  Convert another file
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
          <h2 className="font-bold text-xl mb-4">How to use:</h2>
          <ol className="space-y-2 text-gray-700">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-bold text-red-600 flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
