const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  location: {
    type: String,
    required: [true, "Please add a location"],
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary"],
    required: [true, "Please specify job type"],
  },
  experienceLevel: {
    type: String,
    enum: ["Entry", "Associate", "Mid-Senior", "Director", "Executive"],
    required: [true, "Please specify experience level"],
  },
  salary: {
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    currency: {
      type: String,
      default: "USD",
    },
    period: {
      type: String,
      enum: ["hourly", "monthly", "yearly"],
      default: "yearly",
    },
  },
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  responsibilities: [
    {
      type: String,
    },
  ],
  qualifications: [
    {
      type: String,
    },
  ],
  benefits: [
    {
      type: String,
    },
  ],
  applicationDeadline: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["open", "closed", "draft"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for search
JobSchema.index({
  title: "text",
  description: "text",
  skills: "text",
});

module.exports = mongoose.model("Job", JobSchema);
