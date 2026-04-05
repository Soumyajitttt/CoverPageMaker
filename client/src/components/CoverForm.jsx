import React, { useState } from "react";
import axios from "axios";
import "./CoverForm.css";

const yearOptions = [
  "1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year",
];

const divOptions = ["A", "B", "C", "D", "E"];
const sectionOptions = ["Section 1", "Section 2", "Section 3", "Section 4"];

export default function CoverForm({ onGenerate, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      collegeName: "",
      userName: "",
      rollNo: "",
      regNo: "",
      subject: "",
      division: "",
      section: "",
      department: "",
      yearOfStudy: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.collegeName.trim()) errs.collegeName = "College name is required";
    if (!form.userName.trim()) errs.userName = "Your name is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await axios.post("/api/covers/save", form);
    } catch (_) {
      // If DB is down, still allow preview generation
    }
    setLoading(false);
    onGenerate(form);
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h1>Generate Your Cover Page</h1>
          <p>Fill in your details below. Fields marked <span className="req">*</span> are required.</p>
        </div>

        <form onSubmit={handleSubmit} className="cover-form">
          <div className="form-section">
            <h3 className="section-title">Institution Details</h3>
            <div className="field-group">
              <Field label="College / University Name" name="collegeName" value={form.collegeName}
                onChange={handleChange} required error={errors.collegeName} placeholder="e.g. St. Xavier's College" />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Student Details</h3>
            <div className="field-group two-col">
              <Field label="Full Name" name="userName" value={form.userName}
                onChange={handleChange} required error={errors.userName} placeholder="e.g. Arjun Sharma" />
              <Field label="Roll Number" name="rollNo" value={form.rollNo}
                onChange={handleChange} placeholder="e.g. 2301" />
              <Field label="Registration Number" name="regNo" value={form.regNo}
                onChange={handleChange} placeholder="e.g. REG/2023/001" />
              <Field label="Department" name="department" value={form.department}
                onChange={handleChange} placeholder="e.g. Computer Science" />
              <SelectField label="Year of Study" name="yearOfStudy" value={form.yearOfStudy}
                onChange={handleChange} options={yearOptions} placeholder="Select year" />
              <SelectField label="Division" name="division" value={form.division}
                onChange={handleChange} options={divOptions} placeholder="Select division" />
              <SelectField label="Section" name="section" value={form.section}
                onChange={handleChange} options={sectionOptions} placeholder="Select section" />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Project Details</h3>
            <div className="field-group">
              <Field label="Subject / Course Name" name="subject" value={form.subject}
                onChange={handleChange} placeholder="e.g. Data Structures and Algorithms" />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <><span className="btn-spinner" /> Generating...</>
            ) : (
              <><span>✦</span> Preview Cover Page</>
            )}
          </button>
        </form>
      </div>

      <div className="form-sidebar">
        <div className="tip-card">
          <div className="tip-icon">💡</div>
          <h4>Tips</h4>
          <ul>
            <li>Only your name and college name are mandatory.</li>
            <li>Add as many optional details as you like for a richer cover page.</li>
            <li>You can download your cover as a <strong>PDF</strong> or <strong>PNG</strong>.</li>
            <li>The cover includes a professional design with your institution's name prominently displayed.</li>
          </ul>
        </div>
        <div className="preview-hint">
          <div className="preview-hint-icon">🎨</div>
          <p>Your cover page will feature a clean, academic design with space for your teacher's signature.</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, required, error, placeholder }) {
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={name}>
        {label} {required && <span className="req">*</span>}
      </label>
      <input id={name} name={name} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete="off" />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, placeholder }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
