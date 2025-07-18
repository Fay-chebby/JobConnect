const mongoose = require("mongoose");
const User = require("./user");

// Education Schema
const EducationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, "Please provide an institution name"],
  },
  degree: {
    type: String,
    required: [true, "Please provide a degree"],
  },
  field: {
    type: String,
    required: [true, "Please provide a field of study"],
  },
  startDate: {
    type: Date,
    required: [true, "Please provide a start date"],
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
});

// Work Experience Schema
const WorkExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Please provide a company name"],
  },
  position: {
    type: String,
    required: [true, "Please provide a position title"],
  },
  startDate: {
    type: Date,
    required: [true, "Please provide a start date"],
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
});

// Contact Info Schema
const ContactInfoSchema = new mongoose.Schema({
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  website: {
    type: String,
  },
});

// Job Seeker Schema
const JobSeekerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name"],
  },
  bio: {
    type: String,
  },
  skills: [String],
  education: [EducationSchema],
  workHistory: [WorkExperienceSchema],
  resume: {
    type: String, // URL to stored resume
  },
  contactInfo: ContactInfoSchema,
});

const JobSeeker = User.discriminator("job-seeker", JobSeekerSchema);

module.exports = JobSeeker;
