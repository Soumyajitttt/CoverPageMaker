import React, { useRef, useState } from "react";
import "./CoverPreview.css";

// A collection of college/university photo search URLs using Unsplash
const COLLEGE_PHOTOS = [
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80",
  "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&q=80",
];

export default function CoverPreview({ data, onBack }) {
  const coverRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [photoIndex] = useState(() => Math.floor(Math.random() * COLLEGE_PHOTOS.length));

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(coverRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`cover-page-${data.userName.replace(/\s+/g, "-")}.pdf`);
    } catch (err) {
      alert("Download failed. Please try again.");
      console.error(err);
    }
    setDownloading(false);
  };

  const handleDownloadPNG = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(coverRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `cover-page-${data.userName.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      alert("Download failed. Please try again.");
    }
    setDownloading(false);
  };

  return (
    <div className="preview-wrapper">
      <div className="preview-controls">
        <button className="back-btn" onClick={onBack}>
          ← Edit Details
        </button>
        <div className="download-group">
          <button className="dl-btn dl-pdf" onClick={handleDownloadPDF} disabled={downloading}>
            {downloading ? "⏳ Processing..." : "⬇ Download PDF"}
          </button>
          <button className="dl-btn dl-png" onClick={handleDownloadPNG} disabled={downloading}>
            {downloading ? "⏳ Processing..." : "⬇ Download PNG"}
          </button>
        </div>
      </div>

      <div className="cover-scale-wrapper">
        <div className="cover-page" ref={coverRef}>
          {/* Outer ornamental border */}
          <div className="cover-outer-border">
            <div className="cover-inner-border">

              {/* Top decorative bar */}
              <div className="cover-top-bar">
                <div className="bar-line" />
                <div className="bar-diamond">✦</div>
                <div className="bar-line" />
              </div>

              {/* College Name */}
              <div className="cover-college-block">
                <div className="college-ornament-left">—</div>
                <h1 className="cover-college-name">{data.collegeName}</h1>
                <div className="college-ornament-right">—</div>
              </div>
              {data.department && (
                <p className="cover-department">Department of {data.department}</p>
              )}

              {/* Divider */}
              <div className="cover-divider">
                <span className="divider-line" />
                <span className="divider-icon">◆</span>
                <span className="divider-line" />
              </div>

              {/* College Photo */}
              <div className="cover-photo-frame">
                <img
                  src={COLLEGE_PHOTOS[photoIndex]}
                  alt="College campus"
                  className="cover-photo"
                  crossOrigin="anonymous"
                />
                <div className="photo-caption">Campus View</div>
              </div>

              {/* Thin separator */}
              <div className="cover-thin-sep" />

              {/* Subject title block */}
              {data.subject && (
                <div className="cover-subject-block">
                  <p className="subject-label">PROJECT / ASSIGNMENT</p>
                  <h2 className="cover-subject">{data.subject}</h2>
                </div>
              )}

              {/* Decorative middle line */}
              <div className="cover-divider small">
                <span className="divider-line" />
                <span className="divider-dot" />
                <span className="divider-line" />
              </div>

              {/* Student Details + Signature block */}
              <div className="cover-details-row">
                {/* Left: Student Info */}
                <div className="cover-info-table">
                  <div className="info-row">
                    <span className="info-key">Submitted By</span>
                    <span className="info-colon">:</span>
                    <span className="info-val student-name">{data.userName}</span>
                  </div>
                  {data.rollNo && (
                    <div className="info-row">
                      <span className="info-key">Roll No.</span>
                      <span className="info-colon">:</span>
                      <span className="info-val">{data.rollNo}</span>
                    </div>
                  )}
                  {data.regNo && (
                    <div className="info-row">
                      <span className="info-key">Reg. No.</span>
                      <span className="info-colon">:</span>
                      <span className="info-val">{data.regNo}</span>
                    </div>
                  )}
                  {data.yearOfStudy && (
                    <div className="info-row">
                      <span className="info-key">Year</span>
                      <span className="info-colon">:</span>
                      <span className="info-val">{data.yearOfStudy}</span>
                    </div>
                  )}
                  {(data.division || data.section) && (
                    <div className="info-row">
                      <span className="info-key">Div / Section</span>
                      <span className="info-colon">:</span>
                      <span className="info-val">
                        {[data.division, data.section].filter(Boolean).join(" / ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Teacher Signature Box */}
                <div className="teacher-sign-box">
                  <div className="sign-area" />
                  <p className="sign-label">Teacher's Signature</p>
                </div>
              </div>

              {/* Bottom decorative bar */}
              <div className="cover-bottom-bar">
                <div className="bar-line" />
                <div className="bar-diamond small">✦</div>
                <div className="bar-line" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
