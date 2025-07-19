const User = require("../models/user");
const JobSeeker = require("../models/JobSeeker");
const Employer = require("../models/Employer");
const asyncHandler = require("express-async-handler");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create profile based on role
  if (role === "jobSeeker") {
    await JobSeeker.create({
      user: user._id,
    });
  } else if (role === "employer") {
    // For employers, we require additional fields
    const { companyName, industry, description, location, companySize } =
      req.body;

    if (
      !companyName ||
      !industry ||
      !description ||
      !location ||
      !companySize
    ) {
      await User.findByIdAndDelete(user._id);
      res.status(400);
      throw new Error("Please provide all required employer fields");
    }

    await Employer.create({
      user: user._id,
      companyName,
      industry,
      description,
      location,
      companySize,
    });
  }

  // Generate token
  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    token,
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide an email and password");
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  let profile;
  if (user.role === "jobSeeker") {
    profile = await JobSeeker.findOne({ user: req.user.id });
  } else if (user.role === "employer") {
    profile = await Employer.findOne({ user: req.user.id });
  }

  res.status(200).json({
    success: true,
    data: {
      user,
      profile,
    },
  });
});
