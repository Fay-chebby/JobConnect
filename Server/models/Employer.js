const mongoose = require("mongoose");

const EmployerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyName: {
    type: String,
    required: [true, "Please provide company name"],
    trim: true,
  },
  industry: {
    type: String,
    required: [true, "Please provide industry"],
  },
  description: {
    type: String,
    required: [true, "Please provide company description"],
  },
  website: {
    type: String,
  },
  location: {
    type: String,
    required: [true, "Please provide company location"],
  },
  logo: {
    type: String,
    default: "default-logo.jpg",
  },
  companySize: {
    type: String,
    enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    required: [true, "Please provide company size"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employer", EmployerSchema);
