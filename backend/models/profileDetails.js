const mongoose = require("mongoose");

const ProfileDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: String },
  profilePhoto: { type: String },
  items: [
    {
      documents: { type: String },
      title: { type: String }, 
      text: { type: String }, 
    },
  ],
  gender: { type: String },
  dob: { type: Date },
  createdAt: {  type: Date, default: Date.now },
});

module.exports = mongoose.model("ProfileDetails", ProfileDetailsSchema);
