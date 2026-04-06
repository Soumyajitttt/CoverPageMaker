# 📄 Project Cover Page Generator

A clean, modern, frontend-only web app to generate professional project file cover pages — no server required.

## 🚀 How to Use

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge recommended).
2. Fill in your details in the left panel:
   - **College / Institution Name** *(required)*
   - **Student Name** *(required)*
   - All other fields (Roll No, Reg No, Subject, Department, Year, etc.) are optional
3. Watch the live preview update on the right in real-time.
4. The app will **automatically fetch your college's image** from Wikipedia/Unsplash based on the college name you type.
5. Choose a **theme** (Minimal · Dark · Classic).
6. Click **↓ PDF** to download a print-ready A4 PDF, or **↓ PNG** for a high-res image.

## 🎨 Themes

| Theme | Style |
|-------|-------|
| **Minimal** | Clean white, bold black Bebas Neue typography |
| **Dark** | Deep black with lime-green accents |
| **Classic** | Cream paper with navy serif text |

## 🛠 Tech Stack

- **HTML5 + CSS3 + Vanilla JS** — no build step, no framework
- **Tailwind CSS** (CDN) — utility classes for the UI shell
- **html2canvas** — capture the cover page as a canvas
- **jsPDF** — convert canvas to PDF
- **Google Fonts** — Bebas Neue, Syne, DM Serif Display, Space Mono
- **Wikipedia API** — college image lookup (CORS-friendly, no API key needed)
- **Unsplash** — fallback image source

## 📁 File Structure

```
cover-page-generator/
├── index.html     # App shell & cover page template
├── style.css      # All theme styles & layout
├── app.js         # Logic: live preview, image fetch, PDF/PNG export
└── README.md      # This file
```

## 💡 Tips

- For best PDF quality, use **Chrome** or **Edge**.
- If your college image doesn't appear automatically, the app will show a placeholder — the PDF will still look great.
- The cover page is designed for **A4** paper (210mm × 297mm).
- Internet connection is required for fonts and college image lookup.

## 🖨 Printing

After downloading the PDF, open it in any PDF viewer and print at **100% scale** on A4 paper for perfect results.
