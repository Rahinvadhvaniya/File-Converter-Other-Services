import ConverterTool from "@/components/ConverterTool";

export default function PdfToJpgPage() {
  return (
    <ConverterTool
      title="PDF to JPG Converter"
      description="Convert your PDF pages to high-quality JPG images"
      acceptedFormats=".pdf"
      mimeTypes={{ "application/pdf": [".pdf"] }}
      conversionType="pdf-to-jpg"
      icon="🖼️"
      outputFormat="PNG Image (.png)"
      steps={[
        "Select or drag & drop your PDF file",
        'Click the "Convert to PNG Image (.png)" button',
        "Wait a few seconds for the conversion",
        "Download your converted image file",
      ]}
    />
  );
}
