const Job = require("../models/Job");
const Employer = require("../models/Employer");
const asyncHandler = require("express-async-handler");

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer only)
exports.createJob = asyncHandler(async (req, res) => {
  // Check if user has employer profile
  const employer = await Employer.findOne({ user: req.user.id });

  if (!employer) {
    res.status(400);
    throw new Error("Employer profile not found");
  }

  // Add employer to job data
  req.body.employer = employer._id;

  const job = await Job.create(req.body);

  res.status(201).json({
    success: true,
    data: job,
  });
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from matching
  const removeFields = ["select", "sort", "page", "limit", "search"];
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  let query = Job.find(JSON.parse(queryStr)).populate({
    path: "employer",
    select: "companyName location logo",
  });

  // Search
  if (req.query.search) {
    query = Job.find({
      $text: { $search: req.query.search },
    }).populate({
      path: "employer",
      select: "companyName location logo",
    });
  }

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Job.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const jobs = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: jobs.length,
    pagination,
    data: jobs,
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate({
    path: "employer",
    select:
      "companyName industry description website location logo companySize",
  });

  if (!job) {
    res.status(404);
    throw new Error(`Job not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only - owner)
exports.updateJob = asyncHandler(async (req, res) => {
  const employer = await Employer.findOne({ user: req.user.id });

  if (!employer) {
    res.status(400);
    throw new Error("Employer profile not found");
  }

  let job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error(`Job not found with id of ${req.params.id}`);
  }

  // Make sure user is job owner
  if (job.employer.toString() !== employer._id.toString()) {
    res.status(401);
    throw new Error(`Not authorized to update this job`);
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: job,
  });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only - owner)
exports.deleteJob = asyncHandler(async (req, res) => {
  const employer = await Employer.findOne({ user: req.user.id });

  if (!employer) {
    res.status(400);
    throw new Error("Employer profile not found");
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error(`Job not found with id of ${req.params.id}`);
  }

  // Make sure user is job owner
  if (job.employer.toString() !== employer._id.toString()) {
    res.status(401);
    throw new Error(`Not authorized to delete this job`);
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get jobs by employer
// @route   GET /api/employers/:employerId/jobs
// @access  Public
exports.getEmployerJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employer: req.params.employerId });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});
