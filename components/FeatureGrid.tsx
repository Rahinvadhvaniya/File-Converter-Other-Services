import Link from "next/link";

const features = [
  {
    title: "PDF to Word",
    description: "Convert PDF to editable Word documents",
    icon: "📄",
    href: "/pdf-to-word",
  },
  {
    title: "PDF to Excel",
    description: "Convert PDF to Excel spreadsheets",
    icon: "📊",
    href: "/pdf-to-excel",
  },
  {
    title: "PDF to JPG",
    description: "Convert PDF pages to JPG images",
    icon: "🖼️",
    href: "/pdf-to-jpg",
  },
  {
    title: "Word to PDF",
    description: "Convert Word documents to PDF",
    icon: "📝",
    href: "/word-to-pdf",
  },
  {
    title: "JPG to PDF",
    description: "Convert images to PDF documents",
    icon: "🎨",
    href: "/jpg-to-pdf",
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF file size",
    icon: "🗜️",
    href: "/compress-pdf",
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into one",
    icon: "🔗",
    href: "/merge-pdf",
  },
  {
    title: "Split PDF",
    description: "Extract pages from PDF",
    icon: "✂️",
    href: "/split-pdf",
  },
  {
    title: "Rotate PDF",
    description: "Rotate PDF pages",
    icon: "🔄",
    href: "/rotate-pdf",
  },
  {
    title: "PDF to PowerPoint",
    description: "Convert PDF to PPT presentations",
    icon: "📊",
    href: "/pdf-to-ppt",
  },
  {
    title: "Excel to PDF",
    description: "Convert Excel to PDF",
    icon: "📈",
    href: "/excel-to-pdf",
  },
  {
    title: "Unlock PDF",
    description: "Remove PDF password protection",
    icon: "🔓",
    href: "/unlock-pdf",
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {features.map((feature, index) => (
        <Link
          key={index}
          href={feature.href}
          className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-red-300 transition-all"
        >
          <div className="text-4xl mb-3">{feature.icon}</div>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-red-600 transition">
            {feature.title}
          </h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </Link>
      ))}
    </div>
  );
}
