const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // or whatever your frontend port is
    credentials: true,
  })
);
app.use(express.json());

const PORT = process.env.PORT || 5000;
const path = require("path");

// Routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require("./routes/userRoutes");
// const managerRoutes = require("./routes/managerRoutes");
// const headcookRoutes = require("./routes/headcookRoutes");
// const supervisorRoutes = require("./routes/supervisorRoutes");
const commonRoutes = require("./routes/commonRoutes");

app.use('/admin', adminRoutes);  
// app.use("/voyager", voyagerRoutes);  
// app.use("/manager", managerRoutes);  
// app.use("/headcook", headcookRoutes);  
app.use("/user", userRoutes);  
app.use("/common", commonRoutes);
app.use(
  "/uploads/profile",
  express.static(path.join(__dirname, "uploads/profile"))
);
app.use(
  "/uploads/document",
  express.static(path.join(__dirname, "uploads/document"))
);
app.listen(PORT, ()=>{
    console.log(`Server is running on port 5000`);
})