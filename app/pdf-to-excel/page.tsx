import ConverterTool from "@/components/ConverterTool";

export default function PdfToExcelPage() {
  return (
    <ConverterTool
      title="PDF to Excel Converter"
      description="Convert your PDF files to Excel spreadsheets in seconds"
      acceptedFormats=".pdf"
      mimeTypes={{ "application/pdf": [".pdf"] }}
      conversionType="pdf-to-excel"
      icon="📊"
      outputFormat="Excel Spreadsheet (.xlsx)"
      steps={[
        "Select or drag & drop your PDF file",
        'Click the "Convert to Excel Spreadsheet (.xlsx)" button',
        "Wait a few seconds for the conversion",
        "Download your converted Excel spreadsheet",
      ]}
    />
  );
}
