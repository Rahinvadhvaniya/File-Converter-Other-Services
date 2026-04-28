import ConverterTool from "@/components/ConverterTool";

export default function PdfToPptPage() {
  return (
    <ConverterTool
      title="PDF to PowerPoint Converter"
      description="Convert your PDF files to PowerPoint presentations"
      acceptedFormats=".pdf"
      mimeTypes={{ "application/pdf": [".pdf"] }}
      conversionType="pdf-to-ppt"
      icon="📊"
      outputFormat="PowerPoint (.pptx)"
      steps={[
        "Select or drag & drop your PDF file",
        'Click the "Convert to PowerPoint (.pptx)" button',
        "Wait a few seconds for the conversion",
        "Download your converted PowerPoint presentation",
      ]}
    />
  );
}
