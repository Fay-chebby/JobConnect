const mongoose = require("mongoose");

const JobSeekerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: {
    type: String,
    default: "",
  },
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  education: [
    {
      institution: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldOfStudy: {
        type: String,
        required: true,
      },
      fromDate: {
        type: Date,
        required: true,
      },
      toDate: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  experience: [
    {
      company: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      location: {
        type: String,
      },
      fromDate: {
        type: Date,
        required: true,
      },
      toDate: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  bio: {
    type: String,
  },
  location: {
    type: String,
  },
  website: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JobSeeker", JobSeekerSchema);
