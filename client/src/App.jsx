import React, { useState } from "react";
import CoverForm from "./components/CoverForm";
import CoverPreview from "./components/CoverPreview";
import "./App.css";

function App() {
  const [formData, setFormData] = useState(null);
  const [step, setStep] = useState("form"); // "form" | "preview"

  const handleGenerate = (data) => {
    setFormData(data);
    setStep("preview");
  };

  const handleBack = () => {
    setStep("form");
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">✦</span>
            <span className="logo-text">CoverCraft</span>
          </div>
          <p className="tagline">Academic Project Cover Page Generator</p>
        </div>
      </header>

      <main className="app-main">
        {step === "form" ? (
          <CoverForm onGenerate={handleGenerate} initialData={formData} />
        ) : (
          <CoverPreview data={formData} onBack={handleBack} />
        )}
      </main>

      <footer className="app-footer">
        <p>CoverCraft &copy; {new Date().getFullYear()} — Crafted for students, by design.</p>
      </footer>
    </div>
  );
}

export default App;
