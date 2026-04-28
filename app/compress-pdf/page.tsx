import ConverterTool from "@/components/ConverterTool";

export default function CompressPdfPage() {
  return (
    <ConverterTool
      title="Compress PDF"
      description="Reduce your PDF file size while maintaining quality"
      acceptedFormats=".pdf"
      mimeTypes={{ "application/pdf": [".pdf"] }}
      conversionType="compress-pdf"
      icon="🗜️"
      outputFormat="Compressed PDF (.pdf)"
      steps={[
        "Select or drag & drop your PDF file",
        'Click the "Convert to Compressed PDF (.pdf)" button',
        "Wait a few seconds while we compress your file",
        "Download your compressed PDF",
      ]}
    />
  );
}
