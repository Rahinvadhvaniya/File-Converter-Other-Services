import ConverterTool from "@/components/ConverterTool";

export default function WordToPdfPage() {
  return (
    <ConverterTool
      title="Word to PDF Converter"
      description="Convert your Word documents to PDF format instantly"
      acceptedFormats=".docx,.doc"
      mimeTypes={{
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        "application/msword": [".doc"],
      }}
      conversionType="word-to-pdf"
      icon="📝"
      outputFormat="PDF Document (.pdf)"
      steps={[
        "Select or drag & drop your Word document",
        'Click the "Convert to PDF Document (.pdf)" button',
        "Wait a few seconds for the conversion",
        "Download your converted PDF file",
      ]}
    />
  );
}
