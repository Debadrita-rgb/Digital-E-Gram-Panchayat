const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const profilePath = path.join(__dirname, "../uploads/profile");
const documentPath = path.join(__dirname, "../uploads/document");

fs.mkdirSync(profilePath, { recursive: true });
fs.mkdirSync(documentPath, { recursive: true });

// Dynamic storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profilePhoto") {
      cb(null, profilePath);
    } else if (file.fieldname.match(/^documents\[\d+\]\[file\]$/)) {
      cb(null, documentPath);
    } else {
      cb(new Error("Unknown field name"));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
