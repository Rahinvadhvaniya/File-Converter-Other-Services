# File Converter - Online File Conversion Service

A modern, free online file converter built with Next.js and TypeScript. Convert PDFs, images, and documents easily with a beautiful, responsive interface.

## Features

- 📄 **PDF Conversions**: Convert PDF to Word, Excel, PowerPoint, JPG, and more
- 🖼️ **Image Tools**: Convert between JPG, PNG, WebP, and other image formats
- 📝 **Document Conversion**: Word, Excel, PowerPoint format conversions
- 🗜️ **File Compression**: Reduce file sizes efficiently
- ✂️ **PDF Tools**: Merge, split, rotate, and organize PDF pages
- 🚀 **Fast & Easy**: Simple drag-and-drop interface
- 🔒 **Secure**: Files are encrypted and automatically deleted after processing
- ☁️ **Cloud-Based**: No installation required, works on any device

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **File Upload**: react-dropzone
- **PDF Processing**: pdf-lib
- **Image Processing**: Sharp

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Rahinvadhvaniya/File-Converter-Other-Services.git
cd File-Converter-Other-Services
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── upload/        # File upload endpoint
│   │   └── convert/       # File conversion endpoint
│   ├── pdf-to-word/       # PDF to Word conversion page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer component
│   ├── FileUploader.tsx   # File upload component
│   └── FeatureGrid.tsx    # Feature cards grid
├── lib/                   # Utility functions
├── public/               # Static assets
└── uploads/              # Temporary file storage (auto-deleted)
```

## Available Conversion Tools

### PDF Tools
- PDF to Word
- PDF to Excel
- PDF to PowerPoint
- PDF to JPG
- Compress PDF
- Merge PDF
- Split PDF
- Rotate PDF
- Unlock PDF

### Document Conversions
- Word to PDF
- Excel to PDF
- PowerPoint to PDF

### Image Conversions
- JPG to PDF
- PNG to PDF
- Image format conversions

## API Endpoints

### POST /api/upload
Upload a file for conversion
- **Body**: FormData with file
- **Response**: `{ success, filename, originalName, size, type }`

### POST /api/convert
Convert uploaded file
- **Body**: `{ filename, conversionType }`
- **Response**: `{ success, message, downloadUrl }`

## Development

### Running in Development Mode

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by [ilovepdf.com](https://www.ilovepdf.com/)
- Built with modern web technologies
- Designed for performance and user experience

## Contact

For questions or support, please open an issue on GitHub.
