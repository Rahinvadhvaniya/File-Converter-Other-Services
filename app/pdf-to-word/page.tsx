import ConverterTool from "@/components/ConverterTool";

export default function PdfToWordPage() {
  return (
    <ConverterTool
      title="PDF to Word Converter"
      description="Convert your PDF files to editable Word documents in seconds"
      acceptedFormats=".pdf"
      mimeTypes={{ "application/pdf": [".pdf"] }}
      conversionType="pdf-to-word"
      icon="📄"
      outputFormat="Word Document (.docx)"
      steps={[
        "Select or drag & drop your PDF file",
        'Click the "Convert to Word Document (.docx)" button',
        "Wait a few seconds for the conversion",
        "Download your converted Word document",
      ]}
    />
  );
}
