const Employer = require("../models/Employer");
const asyncHandler = require("express-async-handler");

// @desc    Create Employer Profile
// @route   POST /api/employers
// @access  Private (Employer)
exports.createEmployerProfile = asyncHandler(async (req, res) => {
  const { companyName, industry, description, website, location, companySize } =
    req.body;

  // Prevent duplicate profile for the same user
  const existing = await Employer.findOne({ user: req.user.id });
  if (existing) {
    res.status(400);
    throw new Error("Employer profile already exists");
  }

  const employer = await Employer.create({
    user: req.user.id,
    companyName,
    industry,
    description,
    website,
    location,
    companySize,
  });

  res.status(201).json({
    success: true,
    data: employer,
  });
});
