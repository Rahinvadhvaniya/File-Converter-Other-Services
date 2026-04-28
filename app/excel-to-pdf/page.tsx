import ConverterTool from "@/components/ConverterTool";

export default function ExcelToPdfPage() {
  return (
    <ConverterTool
      title="Excel to PDF Converter"
      description="Convert your Excel spreadsheets to PDF format"
      acceptedFormats=".xlsx,.xls"
      mimeTypes={{
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        "application/vnd.ms-excel": [".xls"],
      }}
      conversionType="excel-to-pdf"
      icon="📈"
      outputFormat="PDF Document (.pdf)"
      steps={[
        "Select or drag & drop your Excel file",
        'Click the "Convert to PDF Document (.pdf)" button',
        "Wait a few seconds for the conversion",
        "Download your converted PDF file",
      ]}
    />
  );
}
