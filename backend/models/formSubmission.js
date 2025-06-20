const mongoose = require("mongoose");

const formSubmissionSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service",
    required: true,
  },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  data: { type: Object, required: true },
  status: { type: String, default: "Pending" },
  description: { type: String },
  submittedAt: { type: Date, default: Date.now },
  actionTakenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  actionTakenAt: {
    type: Date,
  },
});

module.exports = mongoose.model("FormSubmission", formSubmissionSchema);
