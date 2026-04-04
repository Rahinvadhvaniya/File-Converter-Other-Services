# Backend API Documentation

This document describes the backend API endpoints for the File Converter application.

## API Endpoints

### 1. Upload File
**POST** `/api/upload`

Upload a file for conversion.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field

**Response:**
```json
{
  "success": true,
  "filename": "1234567890-document.pdf",
  "originalName": "document.pdf",
  "size": 123456,
  "type": "application/pdf"
}
```

**Validation:**
- Maximum file size: 50 MB
- Filenames are sanitized to prevent path traversal attacks

---

### 2. Convert File
**POST** `/api/convert`

Convert a file from one format to another.

**Request:**
```json
{
  "filename": "1234567890-document.pdf",
  "conversionType": "pdf-to-word",
  "options": {
    "rotation": 90,
    "pageRanges": [{ "start": 0, "end": 2 }],
    "files": ["file1.pdf", "file2.pdf"],
    "password": "optional-password"
  }
}
```

**Conversion Types:**
- `pdf-to-word` - Convert PDF to Word document
- `pdf-to-excel` - Convert PDF to Excel spreadsheet
- `pdf-to-jpg` - Convert PDF pages to JPG images
- `word-to-pdf` - Convert Word to PDF
- `jpg-to-pdf` - Convert images to PDF
- `compress-pdf` - Compress PDF file size
- `merge-pdf` - Merge multiple PDFs into one
- `split-pdf` - Split PDF into multiple files
- `rotate-pdf` - Rotate PDF pages
- `pdf-to-ppt` - Convert PDF to PowerPoint
- `excel-to-pdf` - Convert Excel to PDF
- `unlock-pdf` - Remove PDF password protection

**Response:**
```json
{
  "success": true,
  "message": "File converted successfully",
  "filename": "1234567890-converted.docx",
  "downloadUrl": "/api/download/1234567890-converted.docx"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Conversion failed: reason"
}
```

---

### 3. Download File
**GET** `/api/download/[filename]`

Download a converted file.

**Response:**
- Binary file data with appropriate Content-Type header
- Content-Disposition header for automatic download

**Supported File Types:**
- PDF: `application/pdf`
- Word: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Excel: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- PowerPoint: `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- Images: `image/jpeg`, `image/png`
- HTML: `text/html`

---

## Conversion Options

### Rotate PDF
```json
{
  "rotation": 90  // Degrees to rotate (90, 180, 270)
}
```

### Split PDF
```json
{
  "pageRanges": [
    { "start": 0, "end": 2 },
    { "start": 3, "end": 5 }
  ]
}
```

### Merge PDF
```json
{
  "files": [
    "file1.pdf",
    "file2.pdf",
    "file3.pdf"
  ]
}
```

### Unlock PDF
```json
{
  "password": "pdf-password"  // Optional
}
```

---

## File Cleanup

Files are automatically organized in two directories:
- `uploads/` - Uploaded files
- `outputs/` - Converted files

The system includes automatic cleanup utilities:
- Files older than 1 hour are automatically deleted
- Cleanup runs every 30 minutes

---

## Security Features

1. **File Size Validation**: Maximum 50 MB per file
2. **Filename Sanitization**: Prevents path traversal attacks
3. **File Type Validation**: Only allowed file types are accepted
4. **Automatic Cleanup**: Old files are removed to prevent storage issues

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found (file not found)
- `500` - Internal Server Error (conversion failed)

---

## Libraries Used

- **pdf-lib**: PDF manipulation (merge, split, rotate, compress)
- **mammoth**: Word document processing
- **xlsx**: Excel file processing
- **sharp**: Image processing
- **Next.js**: API route handlers

---

## Example Usage

### Complete Conversion Flow

```javascript
// 1. Upload file
const formData = new FormData();
formData.append('file', file);

const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

const { filename } = await uploadResponse.json();

// 2. Convert file
const convertResponse = await fetch('/api/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filename,
    conversionType: 'pdf-to-word'
  })
});

const { downloadUrl } = await convertResponse.json();

// 3. Download converted file
window.location.href = downloadUrl;
```

---

## Development Notes

- For production use, consider using external storage (S3, etc.) instead of local filesystem
- Implement rate limiting to prevent abuse
- Add authentication for sensitive operations
- Use a job queue for long-running conversions
- Implement progress tracking for large files
