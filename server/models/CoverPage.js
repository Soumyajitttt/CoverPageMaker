const mongoose = require("mongoose");

const coverPageSchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true },
    userName: { type: String, required: true },
    rollNo: { type: String, default: "" },
    regNo: { type: String, default: "" },
    subject: { type: String, default: "" },
    division: { type: String, default: "" },
    section: { type: String, default: "" },
    department: { type: String, default: "" },
    yearOfStudy: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoverPage", coverPageSchema);
