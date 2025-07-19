const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { createEmployerProfile } = require("../controllers/employerController");

router.post("/", protect, authorize("employer"), createEmployerProfile);

module.exports = router;
