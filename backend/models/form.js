// models/FormSchema.js
const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "text",
      "textarea",
      "radio",
      "checkbox",
      "date",
      "email",
      "file",
      "number",
      "password",
    ],
    required: true,
  },
  options: [String], // for radio/checkbox
});

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  fields: [FieldSchema],
});

module.exports = mongoose.model("FormSchema", FormSchema);
