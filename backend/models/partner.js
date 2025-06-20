const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema({
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
module.exports = mongoose.model("Partner", PartnerSchema);
