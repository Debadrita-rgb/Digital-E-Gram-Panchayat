const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  name: { type: String },
  galleryItems: [
    {
      imageUrl: { type: String, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true, // This determines if the item is active
  },
});
module.exports = mongoose.model("Gallery", GallerySchema);
