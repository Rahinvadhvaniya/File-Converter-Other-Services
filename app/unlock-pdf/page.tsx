import ConverterTool from "@/components/ConverterTool";

export default function UnlockPdfPage() {
  return (
    <ConverterTool
      title="Unlock PDF"
      description="Remove password protection from your PDF files"
      acceptedFormats=".pdf"
      mimeTypes={{ "application/pdf": [".pdf"] }}
      conversionType="unlock-pdf"
      icon="🔓"
      outputFormat="Unlocked PDF (.pdf)"
      steps={[
        "Select or drag & drop your password-protected PDF",
        "Enter the PDF password if required",
        'Click the "Convert to Unlocked PDF (.pdf)" button',
        "Download your unlocked PDF document",
      ]}
    />
  );
}
