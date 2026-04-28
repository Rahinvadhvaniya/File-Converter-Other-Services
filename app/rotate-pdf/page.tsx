import ConverterTool from "@/components/ConverterTool";

export default function RotatePdfPage() {
  return (
    <ConverterTool
      title="Rotate PDF"
      description="Rotate all pages in your PDF to the correct orientation"
      acceptedFormats=".pdf"
      mimeTypes={{ "application/pdf": [".pdf"] }}
      conversionType="rotate-pdf"
      icon="🔄"
      outputFormat="Rotated PDF (.pdf)"
      steps={[
        "Select or drag & drop your PDF file",
        "Choose the rotation angle (90°, 180°, or 270°)",
        'Click the "Convert to Rotated PDF (.pdf)" button',
        "Download your rotated PDF document",
      ]}
    />
  );
}
