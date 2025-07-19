const express = require("express");
const {
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, authorize("jobSeeker"), getMyApplications);

router
  .route("/:id")
  .put(protect, authorize("employer"), updateApplicationStatus)
  .delete(protect, authorize("jobSeeker"), deleteApplication);

module.exports = router;
