const mongoose = require("mongoose");

const SliderSchema = new mongoose.Schema({
  image: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("Slider", SliderSchema);
