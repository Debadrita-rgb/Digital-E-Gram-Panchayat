const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jsonwebtoken = require("../middleware/auth")("ADMIN");
const { generateToken, jwtAuthMiddleware } = require("../middleware/jwt");
const upload = require("../middleware/multer");
// Import your models (adjust paths as needed)
const User = require("../models/User");
const serviceCategory = require("../models/serviceCategory");
const Services = require("../models/service");
const Partner = require("../models/partner");
const Gallery = require("../models/gallery");
const ProfileDetails = require("../models/profileDetails");
const FormSchema = require("../models/form");
const FormSubmission = require("../models/formSubmission");
const Notification = require("../models/Notification")
const Contact = require("../models/Contact");
const Feedback = require("../models/Feedback");
const Slider = require("../models/slider");

const otpStore = {};

router.get(`/get-maincategory`, async (req, res) => {
  try {
    const items = await serviceCategory
      .find({ undercategory: 0 })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.get(`/get-slider`, async (req, res) => {
  try {
    const items = await Slider.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.get("/categorized-services/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
    const services = await Services.find({
      category: categoryId,
      isActive: true,
    }).sort({createdAt:-1});

    const category = await serviceCategory.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      categoryName: category.name,
      categoryImage: category.image,
      services,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/one-service/:serviceId", async (req, res) => {
  const { serviceId } = req.params;

  try {
    const service = await Services.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const category = await serviceCategory.findById(service.category);

    res.status(200).json({
      service,
      categoryName: category ? category.name : "Unknown Category",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /user/index-gallery
router.get("/index-gallery", async (req, res) => {
  try {
    const galleries = await Gallery.find({ isActive: true }).limit(9).sort({createdAt:-1}); // Adjust limit as needed

    // Only send _id, name, and first image from galleryItems
    const formatted = galleries.map((gallery) => ({
      _id: gallery._id,
      name: gallery.name,
      image: gallery.galleryItems?.[0]?.imageUrl || "", // first image or empty
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Index gallery fetch error:", err);
    res.status(500).json({ message: "Failed to load gallery" });
  }
});

router.get("/one-gallery/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    res.status(200).json({
      name: gallery.name,
      galleryItems: gallery.galleryItems || [],
    });
  } catch (err) {
    console.error("Error fetching single gallery:", err);
    res.status(500).json({ message: "Failed to fetch gallery" });
  }
});


router.post("/send-otp", (req, res) => {
  const { phone, password, name, role } = req.body;
  if (!phone || !password || !name)
    return res.status(400).json({ message: "Phone & password required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = { otp, password };

  res.status(200).json({ otp });
});

// Verify OTP and register user
router.post("/verify-otp", async (req, res) => {
  const { phone, otp, name } = req.body;
  const stored = otpStore[phone];

  if (!stored)
    return res.status(400).json({ message: "No OTP found for this number" });

  if (stored.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  try {
    const newUser = new User({ name, phone, role: "User", password: stored.password, });
    const savedUser = await newUser.save();

    const newProfile = new ProfileDetails({ userId: savedUser._id, });
    await newProfile.save();

    delete otpStore[phone];
    res.status(201).json({ message: "User registered and profile created" });
  } catch (err) {
    console.error("Error creating user and profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const userData = await User.findOne({ phone:phone, role: "User" });
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Given phone is not valid",
      });
    }

    if (!(await userData.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Password is not valid",
      });
    }

    const payload = {
      id: userData._id,
      role: "User", 
    };
    const token = generateToken(payload);
    const name = userData.name;
    const userId = userData.id;

    const profiledetails = await ProfileDetails.findOne({ userId: userData._id });
    // console.log(profiledetails);

    const profilePhoto = profiledetails.profilePhoto;

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      name,
      userId,
      profilePhoto,
    });
  } catch (err) {
    console.log("An error occured while admin login =", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/get-navbar-profileimage/:id", jwtAuthMiddleware, async (req, res) => {
    try {
      const userId = req.params.id;
      const profile = await ProfileDetails.findOne({ userId }).lean();
    return res.status(200).json({
      profilePhoto: profile?.profilePhoto || null,
    });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/checking-login/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email phone");
    if (!user) return res.status(404).json({ error: "User not found" });

    const profile = await ProfileDetails.findOne({ userId: user._id });

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: profile?.address || null,
      document: profile?.items?.length > 0 ? profile.items[0].documents : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/notifications", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/notifications/mark-read", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ message: "Server error" });
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
      gender: profile?.gender || "",
      dob: profile?.dob || "",
      items: profile?.items || [],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }

})

// router.post("/update-profile/:id", jwtAuthMiddleware, upload.any(), async (req, res) => {
//     try {
//       const userId = req.params.id;
//       const { name, email, phone, address } = req.body;

//       // Update user info (name, email, phone)
//       const user = await User.findById(userId);
//       if (user) {
//         user.name = name || user.name;
//         user.email = email || user.email;
//         user.phone = phone || user.phone;
//         await user.save();
//       }

//       // Get profile photo
//       const profilePhoto =
//         req.files?.find((file) => file.fieldname === "profilePhoto")
//           ?.filename || "";

//       // Extract documents
//       const documents = [];
//       const documentMap = {};

//       Object.keys(req.body).forEach((key) => {
//         const match = key.match(/^documents\[(\d+)\]\[(\w+)\]$/);
//         if (match) {
//           const index = match[1];
//           const field = match[2];

//           if (!documentMap[index]) documentMap[index] = {};
//           documentMap[index][field] = req.body[key] || "";
//         }
//       });

//       Object.entries(documentMap).forEach(([index, docFields]) => {
//         const file = req.files?.find(
//           (f) => f.fieldname === `documents[${index}][file]`
//         );

//         // Get previous filename if no new file
//         const previousFilename = docFields.file?.includes("/")
//           ? docFields.file.split("/").pop()
//           : "";

//         if (file || docFields.title || docFields.text || previousFilename) {
//           documents.push({
//             documents: file?.filename || previousFilename,
//             title: docFields.title || "",
//             text: docFields.text || "",
//           });
//         }
//       });
      

//       if (Array.isArray(req.body.documents)) {
//         req.body.documents.forEach((doc, index) => {
//           const file = req.files?.find(
//             (f) => f.fieldname === `documents[${index}][file]`
//           );

//           documents.push({
//             documents: file?.filename || "",
//             title: doc.title || "",
//             text: doc.text || "",
//           });
//         });
//       }

//       // Upsert profile
//       let profile = await ProfileDetails.findOne({ userId });

//       if (!profile) {
//         profile = new ProfileDetails({
//           userId,
//           address: address || "",
//           profilePhoto,
//           items: documents,
//         });
//       } else {
//         profile.address = address || profile.address;
//         if (profilePhoto) profile.profilePhoto = profilePhoto;
//         if (documents.length > 0) {
//           const existingDocs = profile.items || [];

//           const updatedDocs = documents
//             .map((newDoc) => {
//               const index = existingDocs.findIndex(
//                 (d) => d.title === newDoc.title
//               );
//               if (index !== -1) {
//                 existingDocs[index] = newDoc;
//                 return null; // already replaced
//               }
//               return newDoc;
//             })
//             .filter(Boolean);

//           profile.items = [...existingDocs, ...updatedDocs];
//         }
        
//       }

//       await profile.save();

//       res.status(200).json({ message: "Profile updated", profile });
//     } catch (error) {
//       console.error("Error in updating profile:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

router.post(
  "/update-profile/:id",
  jwtAuthMiddleware,
  upload.any(),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, phone, address, dob, gender } = req.body;

      // Update user info
      const user = await User.findById(userId);
      if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        await user.save();
      }

      // Get profile photo
      const profilePhoto =
        req.files?.find((file) => file.fieldname === "profilePhoto")
          ?.filename || "";

      // ✨ Refactored: Extract documents
      const rawDocs = Array.isArray(req.body.documents)
        ? req.body.documents
        : [];

      const documents = rawDocs.map((doc, index) => {
        const newFile = req.files?.find(
          (f) => f.fieldname === `documents[${index}][file]`
        );

        return {
          documents: newFile
            ? newFile.filename
            : typeof doc.file === "string"
            ? doc.file
            : "",
          title: doc.title || "",
          text: doc.text || "",
        };
      });

      // Upsert profile
      let profile = await ProfileDetails.findOne({ userId });

      if (!profile) {
        profile = new ProfileDetails({
          userId,
          address: address || "",
          gender: gender || "",
          dob: dob || "",
          profilePhoto,
          items: documents,
        });
      } else {
        profile.address = address || profile.address;
        profile.gender = gender || profile.gender;
        profile.dob = dob || profile.dob;
        if (profilePhoto) profile.profilePhoto = profilePhoto;

        if (documents.length > 0) {
          const existingDocs = profile.items || [];

          const updatedDocs = documents
            .map((newDoc) => {
              const index = existingDocs.findIndex(
                (d) => d.title === newDoc.title
              );
              if (index !== -1) {
                existingDocs[index] = newDoc;
                return null;
              }
              return newDoc;
            })
            .filter(Boolean);

          profile.items = [...existingDocs, ...updatedDocs];
        }
      }

      await profile.save();

      res.status(200).json({ message: "Profile updated", profile });
    } catch (error) {
      console.error("Error in updating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.get("/get-categorized-form/:serviceId", jwtAuthMiddleware, async (req, res) => {
  try {
    const service = await Services.findById(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const form = await FormSchema.findOne({ title: service.category });
    if (!form) {
      return res
        .status(404)
        .json({ message: "Form not found for this category" });
    }

    return res.status(200).json({form,service});
  } catch (error) {
    console.error("Error fetching form:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//form submission from apply page
router.post("/submit-form", jwtAuthMiddleware, async (req, res) => {
  try {
    const { serviceId, data } = req.body;
    const userId = req.user.id; // from token

    const submission = new FormSubmission({
      serviceId,
      submittedBy: userId,
      data,
      status: "Pending",
    });

    await submission.save();
    return res
      .status(200)
      .json({ message: "Form submitted successfully", status: "Pending" });
  } catch (error) {
    console.error("Form submission error:", error);
    return res.status(500).json({ message: "Failed to submit form" });
  }
});

//get all application by userid
router.get("/show-all-applied-application", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = await FormSubmission.find({ submittedBy: userId })
      .populate("serviceId")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const generateCRUDRoutes = (path, Model) => {
  //GET all items
  router.get(`/get-all-${path}`, async (req, res) => {
    try {
      const items = await Model.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(6);
      res.json(items);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  router.get(`/get-limited-${path}`, async (req, res) => {
    try {
      const items = await Model.find({isActive: true}).sort({ createdAt: -1 }).limit(6);
      res.json(items);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  router.get(`/get-total-${path}`, async (req, res) => {
    try {
      const items = await Model.find({ isActive: true }).sort({ createdAt: -1 })        
      res.json(items);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });
}

generateCRUDRoutes("service", Services);
generateCRUDRoutes("partner", Partner);


router.post("/submit-contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully to us. We will contact you soon" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/submit-feedback", async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;
    if (!name || !email || !message || !subject) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newFeedback = new Feedback({ name, email, message, subject });
    await newFeedback.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Thank you for your feedback.",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;