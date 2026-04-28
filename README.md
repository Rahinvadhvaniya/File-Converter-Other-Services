# File Converter - Online File Conversion Service

A modern, free online file converter built with Next.js 15, TypeScript, and Tailwind CSS. All 12 conversion tools work entirely server-side — no external services required.

## Live Tools

| Tool | Route |
|------|-------|
| PDF to Word | `/pdf-to-word` |
| PDF to Excel | `/pdf-to-excel` |
| PDF to JPG | `/pdf-to-jpg` |
| PDF to PowerPoint | `/pdf-to-ppt` |
| Word to PDF | `/word-to-pdf` |
| Excel to PDF | `/excel-to-pdf` |
| JPG to PDF | `/jpg-to-pdf` |
| Compress PDF | `/compress-pdf` |
| Merge PDF | `/merge-pdf` |
| Split PDF | `/split-pdf` |
| Rotate PDF | `/rotate-pdf` |
| Unlock PDF | `/unlock-pdf` |

## Features

- 🚀 **12 real conversion tools** — all functional, no demo stubs
- 📁 **Drag & drop interface** — powered by react-dropzone
- 🔒 **Secure** — files auto-deleted after 1 hour
- ✅ **50MB file size limit** with server-side validation
- 💰 **Pricing page** at `/pricing` with Free / Pro / Enterprise tiers
- ☁️ **Vercel-ready** — includes `vercel.json` configuration

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **File Upload**: react-dropzone
- **PDF Processing**: pdf-lib
- **Image Processing**: sharp
- **Word (.docx)**: docx, mammoth
- **Excel (.xlsx)**: exceljs
- **PowerPoint (.pptx)**: pptxgenjs

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Rahinvadhvaniya/File-Converter-Other-Services.git
cd File-Converter-Other-Services
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── upload/          # POST — validate & save uploaded file
│   │   ├── convert/         # POST — run conversion
│   │   └── download/[filename]/  # GET — serve converted file
│   ├── pdf-to-word/
│   ├── pdf-to-excel/
│   ├── pdf-to-jpg/
│   ├── pdf-to-ppt/
│   ├── word-to-pdf/
│   ├── excel-to-pdf/
│   ├── jpg-to-pdf/
│   ├── compress-pdf/
│   ├── merge-pdf/
│   ├── split-pdf/
│   ├── rotate-pdf/
│   ├── unlock-pdf/
│   ├── pricing/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ConverterTool.tsx    # Reusable converter UI (upload → convert → download)
│   ├── AdSense.tsx          # Google AdSense component
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── FileUploader.tsx
│   └── FeatureGrid.tsx
├── lib/
│   ├── converters.ts        # All 12 conversion implementations
│   ├── validation.ts        # File size & filename sanitization
│   └── cleanup.ts           # Auto-delete old files (>1 hour)
├── .env.example
├── vercel.json
└── DEPLOYMENT.md
```

## API Endpoints

### POST `/api/upload`
- **Body**: `FormData` with `file`
- **Response**: `{ success, filename, originalName, size, type }`

### POST `/api/convert`
- **Body**: `{ filename, conversionType, options? }`
- **Response**: `{ success, message, downloadUrl, filename }`

### GET `/api/download/[filename]`
- Serves converted file from the `outputs/` directory

## Environment Variables

See `.env.example` for all available variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense publisher ID |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions including Vercel one-click deploy.

## License

MIT
