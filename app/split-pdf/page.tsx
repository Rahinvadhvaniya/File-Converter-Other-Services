import ConverterTool from "@/components/ConverterTool";

export default function SplitPdfPage() {
  return (
    <ConverterTool
      title="Split PDF"
      description="Extract specific pages or ranges from your PDF document"
      acceptedFormats=".pdf"
      mimeTypes={{ "application/pdf": [".pdf"] }}
      conversionType="split-pdf"
      icon="✂️"
      outputFormat="Split PDF (.pdf)"
      steps={[
        "Select or drag & drop your PDF file",
        "Enter the page range you want to extract (e.g. 1-3 or 1,3,5)",
        'Click the "Convert to Split PDF (.pdf)" button',
        "Download your extracted pages as a PDF",
      ]}
    />
  );
}
