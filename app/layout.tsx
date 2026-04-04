import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: "File Converter - Convert PDF, Images, Documents Online",
  description: "Free online file converter. Convert PDF to Word, Excel, Images and more. Compress, merge, split PDF files easily.",
  keywords: "file converter, pdf converter, image converter, pdf to word, pdf to excel, online converter",
  authors: [{ name: "FileConverter" }],
  openGraph: {
    title: "File Converter - Convert PDF, Images, Documents Online",
    description: "Free online file converter. Convert PDF to Word, Excel, Images and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en">
      <head>
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
