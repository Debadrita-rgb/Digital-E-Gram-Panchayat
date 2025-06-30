const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jsonwebtoken = require("../middleware/auth")("ADMIN");
const { generateToken, jwtAuthMiddleware } = require("../middleware/jwt");

// Import your models (adjust paths as needed)
const User = require("../models/User");
const serviceCategory = require("../models/serviceCategory");
const service = require("../models/service");
const Gallery = require("../models/gallery");
const Partner = require("../models/partner");
const FormSchema = require("../models/form");
const FormSubmission = require("../models/formSubmission");
const ProfileDetails = require("../models/profileDetails");
const Notification = require("../models/Notification");
const Contact = require("../models/Contact");
const Feedback = require("../models/Feedback");
const Slider = require("../models/slider");

//get total main category
router.get(`/get-maincategory`, jwtAuthMiddleware, async (req, res) => {
  try {
    const items = await serviceCategory
      .find({undercategory: 0})
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

//Get categorized category
router.get(`/get-categorized-subcategory`, jwtAuthMiddleware, async (req, res) => {
    try {
        const { category } = req.query;
        const items = await serviceCategory
          .find({ undercategory: category })
          .sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  }
);

router.get("/get-staff-users", jwtAuthMiddleware, async (req, res) => {
    try {
      const staffUsers = await User.find({
        role: { $in: ["Officer", "Staff"] },
      });
      res.json(staffUsers);
    } catch (error) {
      console.error("Error fetching staff users:", error);
      res.status(500).json({ error: "Failed to fetch staff users" });
    }
  });

// Save form schema

  router.post("/save-form", async (req, res) => {
    try {
      const { title, fields } = req.body;
      const form = await FormSchema.findOneAndUpdate(
        { title },
        { title, fields },
        { upsert: true, new: true }
      );
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get form schema by title
  router.get("/get-form/:catId", async (req, res) => {
    try {
      const form = await FormSchema.findOne({ title: req.params.catId });
      if (!form) return res.status(404).json({ message: "Form not found" });
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/get-full-userdetails/:id", jwtAuthMiddleware, async(req,res) => {
    try {
  
      const userId = req.params.id;
  
      const user = await User.findById(userId).lean();
      if (!user) return res.status(404).json({ error: "User not found" });
      const profile = await ProfileDetails.findOne({ userId }).lean();
  
      return res.status(200).json({
        ...user,
        profilePhoto: profile?.profilePhoto || null,
        address: profile?.address || "",
        items: profile?.items || [],
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  
  })
  
  router.get("/get-all-applications", jwtAuthMiddleware, async (req, res) => {
    try {
      const userRole = req.user.role?.toLowerCase();
      const userId = req.user.id;

      // Always fetch pending applications for all users
      const pending = await FormSubmission.find({ status: "Pending" })
        .populate("submittedBy", "name phone")
        .populate("serviceId", "name")
        .sort({ submittedAt: -1 });

      let acceptedQuery = { status: "Accepted" };
      let rejectedQuery = { status: "Rejected" };

      // Staff or Officer: restrict to own actions
      if (userRole === "staff" || userRole === "officer") {
        acceptedQuery.actionTakenBy = userId;
        rejectedQuery.actionTakenBy = userId;
      }

      const accepted = await FormSubmission.find(acceptedQuery)
        .populate("submittedBy", "name phone")
        .populate("actionTakenBy", "name email")
        .populate("serviceId", "name")
        .sort({ actionTakenAt: -1 });

      const rejected = await FormSubmission.find(rejectedQuery)
        .populate("submittedBy", "name phone")
        .populate("actionTakenBy", "name email")
        .populate("serviceId", "name")
        .sort({ actionTakenAt: -1 });

      return res.json({
        Pending: pending,
        Accepted: accepted,
        Rejected: rejected,
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
  
  
  // Update route to Accept/Reject an application
  router.post("/update-application-status", jwtAuthMiddleware, async (req, res) => {
      const { appId, status, reason } = req.body;
      const adminId = req.user.id;

      try {
        const updatedForm = await FormSubmission.findByIdAndUpdate(
          appId,
          {
            status,
            description: reason,
            actionTakenBy: adminId,
            actionTakenAt: new Date(),
          },
          { new: true }
        ).populate("serviceId", "name");

        if (!updatedForm) {
          return res.status(404).json({ message: "Application not found" });
        }

        const serviceName = updatedForm.serviceId?.name || "your service";

        await Notification.create({
          userId: updatedForm.submittedBy,
          message: `Your service ${serviceName} has been ${status}!`,
          serviceId: updatedForm.serviceId._id,
          applicationId: updatedForm._id,
          isRead: false,
          status: status,
        });

        res.json({ success: true, updatedForm });
      } catch (err) {
        console.error("Error updating status:", err);
        res.status(500).json({ message: "Server error" });
      }
    }
  );
  
  
  router.get(`/get-rolewise-service`, jwtAuthMiddleware, async (req, res) => {
    try {
      const userRole = req.user.role?.toLowerCase();
      const userId = req.user.id;

      let services;

      if (userRole === "admin") {
        services = await service.find().sort({createdAt: -1});
      } else if (userRole === "officer") {
        services = await service
          .find({ createdBy: userId })
          .sort({ createdAt: -1 });
      } else {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      res.status(200).json({ services });
    } catch (err) {
      console.error("Error fetching services:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

const generateCRUDRoutes = (path, Model) => {
  //GET all items
  router.get(`/get-${path}`, jwtAuthMiddleware, async (req, res) => {
    try {
      const items = await Model.find().sort({ createdAt: -1 });
      res.json(items);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  // GET single item by ID
  router.get(`/get-single-${path}/:id`, jwtAuthMiddleware, async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: "Item not found" });
      res.json(item);
    } catch (error) {
      console.error("GET single error:", error);
      res.status(500).json({ error: "Failed to fetch item" });
    }
  });

  // Add
  router.post(`/add-${path}`, jwtAuthMiddleware, async (req, res) => {
    try {
      const item = new Model(req.body);
      await item.save();
      res.json({ message: `${path} added`, item });
    } catch (error) {
      console.error("Server Error:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  });

  // PUT update item by ID
  router.put(`/update-${path}/:id`, jwtAuthMiddleware, async (req, res) => {
    try {
      const updatedItem = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedItem)
        return res.status(404).json({ error: "Item not found" });
      res.json(updatedItem);
    } catch (error) {
      console.error("PUT error:", error);
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  // DELETE item by ID
  router.delete(`/delete-${path}/:id`, jwtAuthMiddleware, async (req, res) => {
    try {
      const deletedItem = await Model.findByIdAndDelete(req.params.id);
      if (!deletedItem)
        return res.status(404).json({ error: "Item not found" });
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("DELETE error:", error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  // Toggle isActive
  router.patch(
    `/toggle-${path}-status/:id`,
    jwtAuthMiddleware,
    async (req, res) => {
      const { isActive } = req.body;
      try {
        const updated = await Model.findByIdAndUpdate(
          req.params.id,
          { isActive },
          { new: true }
        );
        res.json({ message: `${path} status updated`, updated });
      } catch (err) {
        console.error("Toggle Error:", err);
        res.status(500).json({ message: `Failed to toggle ${path} status` });
      }
    }
  );

  router.get(
    `/get-categorized-${path}`,
    jwtAuthMiddleware,
    async (req, res) => {
      try {
        const { category } = req.query;
        let query = {};

        if (category) {
          query.category = category;
        }

        const items = await Model.find(query);
        res.json(items);
      } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Failed to fetch items" });
      }
    }
  );

  // route to get all managers, head cooks, and supervisors
  router.get("/get-staff-users", jwtAuthMiddleware, async (req, res) => {
    try {
      const staffUsers = await User.find({
        role: { $in: ["MANAGER", "HEADCOOK", "SUPERVISOR"] },
      });
      res.json(staffUsers);
    } catch (error) {
      console.error("Error fetching staff users:", error);
      res.status(500).json({ error: "Failed to fetch staff users" });
    }
  });
  //add user
  router.post(`/add-user`, jwtAuthMiddleware, async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Add user failed:", error);
      res.status(400).json({ error: error.message });
    }
  });
};

// Generate routes for all admin sections
generateCRUDRoutes("category", serviceCategory);
generateCRUDRoutes("service", service);
generateCRUDRoutes("user", User);
generateCRUDRoutes("gallery", Gallery);
generateCRUDRoutes("partner", Partner);
generateCRUDRoutes("contact", Contact);
generateCRUDRoutes("feedback", Feedback);
generateCRUDRoutes("slider", Slider);

module.exports = router;