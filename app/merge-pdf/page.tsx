import ConverterTool from "@/components/ConverterTool";

export default function MergePdfPage() {
  return (
    <ConverterTool
      title="Merge PDF"
      description="Combine multiple PDF files into one document"
      acceptedFormats=".pdf"
      mimeTypes={{ "application/pdf": [".pdf"] }}
      conversionType="merge-pdf"
      icon="🔗"
      outputFormat="Merged PDF (.pdf)"
      multiple={true}
      steps={[
        "Select or drag & drop multiple PDF files",
        "Files will be merged in the order they are selected",
        'Click the "Convert to Merged PDF (.pdf)" button',
        "Download your merged PDF document",
      ]}
    />
  );
}
