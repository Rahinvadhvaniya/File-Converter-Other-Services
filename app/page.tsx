import FileUploader from "@/components/FileUploader";
import FeatureGrid from "@/components/FeatureGrid";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
          Every tool you need to work with PDFs and files in one place
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Convert, compress, and edit files online for free. Fast, secure, and easy to use.
        </p>
      </section>

      <section className="mb-16">
        <FileUploader />
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">All the tools you need</h2>
        <FeatureGrid />
      </section>

      <section className="mt-16 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Why choose our File Converter?</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div>
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-bold text-xl mb-2">Fast & Easy</h3>
            <p className="text-gray-600">Convert files in seconds with our powerful tools</p>
          </div>
          <div>
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-bold text-xl mb-2">Secure</h3>
            <p className="text-gray-600">Your files are encrypted and deleted after processing</p>
          </div>
          <div>
            <div className="text-4xl mb-3">☁️</div>
            <h3 className="font-bold text-xl mb-2">Cloud-Based</h3>
            <p className="text-gray-600">No installation required. Works on any device</p>
          </div>
        </div>
      </section>
    </div>
  );
}
