# 🔤 SindhiPaper AI - Verbatim OCR for Sindhi Text

A powerful web application that performs high-precision Optical Character Recognition (OCR) on Sindhi script using Google's Gemini AI. Upload images of handwritten or printed Sindhi question papers, and get perfectly formatted, editable digital versions.

![Sindhi OCR Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- **🎯 Verbatim Transcription**: Exact character-by-character transcription of Sindhi text
- **⚡ Lightning Fast**: Powered by Gemini Flash for rapid processing
- **52-Letter Sindhi Support**: Full support for the complete Sindhi alphabet
- **📝 Manual Editing**: Edit any field after transcription
- **📄 PDF Export**: Save formatted papers as PDF with one click
- **🎨 Beautiful UI**: Modern, intuitive interface with real-time preview
- **📱 Responsive**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sindhi-ocr
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run development server:
```bash
npm run dev
```

5. Open in browser:
```
http://localhost:3000
```

## 🏗️ Project Structure

```
sindhi-ocr/
├── components/          # React components
│   ├── Uploader.tsx    # File upload component
│   └── PaperPreview.tsx # Paper preview component
├── services/           # API services
│   └── geminiService.ts # Gemini AI integration
├── App.tsx             # Main application
├── types.ts            # TypeScript type definitions
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
├── netlify.toml        # Netlify deployment config
└── package.json        # Project dependencies
```

## 🎯 How It Works

1. **Upload**: Upload an image of a Sindhi question paper
2. **Process**: Gemini AI analyzes and transcribes the text with precision
3. **Review**: View the formatted output with proper Sindhi typography
4. **Edit**: Manually correct or add any missing information
5. **Export**: Save as PDF for printing or distribution

## 🔧 Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **AI/OCR**: Google Gemini AI (Flash model)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS (utility classes)
- **Deployment**: Netlify

## 📖 Usage Guide

### Uploading Images

- Supported formats: JPG, PNG
- Recommended resolution: 1000px width minimum
- Clear, well-lit images work best
- Both handwritten and printed text supported

### Editing Content

1. Click "Edit Paper" button after transcription
2. Modify any field in the edit panel
3. Click "Apply Data" to update the preview
4. Export as PDF when satisfied

### PDF Export

- Click "Save as PDF" button
- Browser print dialog will open
- Select "Save as PDF" as printer
- Choose location and save

### OCR Accuracy Issues

**Tips for better accuracy**:
- Use high-quality, well-lit images
- Ensure text is clearly visible
- Avoid shadows or glare
- Use images with high contrast

### Slow Processing

**Solutions**:
- App already uses Gemini Flash (fastest model)
- Check internet connection
- Verify Gemini API quota
- Try compressing images before upload

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Google Gemini AI for powerful OCR capabilities
- Sindhi language community
- All contributors and users

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for the Sindhi language community**
