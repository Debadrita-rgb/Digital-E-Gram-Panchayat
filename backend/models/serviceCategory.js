const mongoose = require("mongoose");

const serviceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: { type: String, required: true },
  role: { type: String, required: true },
  undercategory: { type: String, required: true, default: 0 },
  image: {
    type: String,
    // required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("serviceCategory",serviceCategorySchema);
