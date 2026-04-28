import ConverterTool from "@/components/ConverterTool";

export default function JpgToPdfPage() {
  return (
    <ConverterTool
      title="JPG to PDF Converter"
      description="Convert your JPG and PNG images to PDF documents"
      acceptedFormats=".jpg,.jpeg,.png"
      mimeTypes={{
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      }}
      conversionType="jpg-to-pdf"
      icon="🖼️"
      outputFormat="PDF Document (.pdf)"
      steps={[
        "Select or drag & drop your image file (JPG or PNG)",
        'Click the "Convert to PDF Document (.pdf)" button',
        "Wait a few seconds for the conversion",
        "Download your converted PDF file",
      ]}
    />
  );
}
