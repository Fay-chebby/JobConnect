const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  message: {
    type: String,
    required: [true, "Please provide a message"],
  },
  read: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ["application", "status", "message", "system"],
    default: "system",
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
