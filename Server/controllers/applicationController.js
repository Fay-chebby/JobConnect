const Application = require("../models/Application");
const Job = require("../models/Job");
const JobSeeker = require("../models/JobSeeker");
const Employer = require("../models/Employer");
const asyncHandler = require("express-async-handler");

// @desc    Apply for job
// @route   POST /api/jobs/:jobId/applications
// @access  Private (Job Seeker only)
exports.applyForJob = asyncHandler(async (req, res) => {
  // Check if job exists
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error(`Job not found with id of ${req.params.jobId}`);
  }

  // Check if job is open
  if (job.status !== "open") {
    res.status(400);
    throw new Error("This job is no longer accepting applications");
  }

  // Check if application deadline has passed
  if (
    job.applicationDeadline &&
    new Date(job.applicationDeadline) < new Date()
  ) {
    res.status(400);
    throw new Error("Application deadline has passed");
  }

  // Check if user has jobseeker profile
  const jobSeeker = await JobSeeker.findOne({ user: req.user.id });

  if (!jobSeeker) {
    res.status(400);
    throw new Error("Job seeker profile not found");
  }

  // Check if already applied
  const alreadyApplied = await Application.findOne({
    job: req.params.jobId,
    jobSeeker: jobSeeker._id,
  });

  if (alreadyApplied) {
    res.status(400);
    throw new Error("You have already applied to this job");
  }

  // Create application
  const application = await Application.create({
    job: req.params.jobId,
    jobSeeker: jobSeeker._id,
    resume: req.body.resume || jobSeeker.resume,
    coverLetter: req.body.coverLetter,
  });

  res.status(201).json({
    success: true,
    data: application,
  });
});

// @desc    Get all applications for a job
// @route   GET /api/jobs/:jobId/applications
// @access  Private (Employer only - job owner)
exports.getJobApplications = asyncHandler(async (req, res) => {
  // Check if job exists
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error(`Job not found with id of ${req.params.jobId}`);
  }

  // Check if user is employer and owns the job
  const employer = await Employer.findOne({ user: req.user.id });

  if (!employer) {
    res.status(401);
    throw new Error("Not authorized to access this resource");
  }

  if (job.employer.toString() !== employer._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to access these applications");
  }

  const applications = await Application.find({
    job: req.params.jobId,
  }).populate({
    path: "jobSeeker",
    populate: {
      path: "user",
      select: "name email",
    },
  });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// @desc    Get applications by job seeker
// @route   GET /api/applications
// @access  Private (Job Seeker only)
exports.getMyApplications = asyncHandler(async (req, res) => {
  // Check if user has jobseeker profile
  const jobSeeker = await JobSeeker.findOne({ user: req.user.id });

  if (!jobSeeker) {
    res.status(400);
    throw new Error("Job seeker profile not found");
  }

  const applications = await Application.find({
    jobSeeker: jobSeeker._id,
  }).populate({
    path: "job",
    populate: {
      path: "employer",
      select: "companyName location logo",
    },
  });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Employer only - job owner)
exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  let application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error(`Application not found with id of ${req.params.id}`);
  }

  // Get job to check ownership
  const job = await Job.findById(application.job);

  if (!job) {
    res.status(404);
    throw new Error("Job associated with this application not found");
  }

  // Check if user is employer and owns the job
  const employer = await Employer.findOne({ user: req.user.id });

  if (!employer) {
    res.status(401);
    throw new Error("Not authorized to access this resource");
  }

  if (job.employer.toString() !== employer._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this application");
  }

  // Only allow status update
  application = await Application.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: application,
  });
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Job Seeker only - application owner)
exports.deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error(`Application not found with id of ${req.params.id}`);
  }

  // Check if user has jobseeker profile and owns the application
  const jobSeeker = await JobSeeker.findOne({ user: req.user.id });

  if (!jobSeeker) {
    res.status(401);
    throw new Error("Not authorized to access this resource");
  }

  if (application.jobSeeker.toString() !== jobSeeker._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this application");
  }

  await application.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
