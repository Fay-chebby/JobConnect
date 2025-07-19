const express = require("express");
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
} = require("../controllers/jobController");

const {
  applyForJob,
  getJobApplications,
} = require("../controllers/applicationController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Job routes
router.route("/").get(getJobs).post(protect, authorize("employer"), createJob);

router
  .route("/:id")
  .get(getJob)
  .put(protect, authorize("employer"), updateJob)
  .delete(protect, authorize("employer"), deleteJob);

// Application routes within jobs
router
  .route("/:jobId/applications")
  .post(protect, authorize("jobSeeker"), applyForJob)
  .get(protect, authorize("employer"), getJobApplications);

// Get jobs for a specific employer
router.route("/employers/:employerId").get(getEmployerJobs);

module.exports = router;
