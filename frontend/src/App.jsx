import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTopButton from "./components/userComponents/ScrollToTopButton.jsx";

import LoginPage from "./pages/LoginPage/LoginPage";
import UserLayout from "./pages/userPages/layouts/UserLayout";

//admin
//admin routes
import AdminLayout from "./components/layout/admin/adminLayout.jsx";
import AdminDashboard from "./pages/adminPages/AdminDashboard/AdminDashboard.jsx";

//FormEditorPage
import FormEditorPage from "./pages/adminPages/FormEditorPage/FormEditorPage.jsx"
//Category
import AdminCategory from "./pages/adminPages/Service/Category/viewCategory.jsx";
import AdminAddCategory from "./pages/adminPages/Service/Category/addCategory.jsx";
import AdmineditCategory from "./pages/adminPages/Service/Category/editCategory.jsx";
import ViewSubCategory from "./pages/adminPages/Service/Category/ViewSubCategory.jsx";

//Admin Services
import AdminServices from "./pages/adminPages/Service/Services/viewServices.jsx";
import AdminAddServices from "./pages/adminPages/Service/Services/addServices.jsx";
import AdmineditServices from "./pages/adminPages/Service/Services/editServices.jsx";

//Admin Contact
import AdminContact from "./pages/adminPages/Contact/Contact.jsx";

//Admin Feedback
import AdminFeedback from "./pages/adminPages/Feedback/Feedback.jsx";

//User
import AdminUser from "./pages/adminPages/User/viewUser.jsx";
import AdminAddUser from "./pages/adminPages/User/addUser.jsx";
import AdmineditUser from "./pages/adminPages/User/editUser.jsx";

import ViewAllApplication from "./pages/adminPages/ViewAllApplication/ViewAllApplication.jsx";

//Gallery
import AdminGallery from "./pages/adminPages/Gallery/viewGallery.jsx";
import AdminAddGallery from "./pages/adminPages/Gallery/addGallery.jsx";
import AdmineditGallery from "./pages/adminPages/Gallery/editGallery.jsx";

//Partner
import AdminPartner from "./pages/adminPages/Partner/viewPartner.jsx";
import AdminAddPartner from "./pages/adminPages/Partner/addPartner.jsx";

//User Page frontend
import UserHomePage from "./pages/userPages/Index/Index";
import SignUp from "./pages/userPages/signUp/signUp";
import SignIn from "./pages/userPages/signIn/signIn";

//Service For User frontend
import CategorizedService from "./pages/userPages/Services/CategorizedService.jsx";
import ShowService from "./pages/userPages/Services/ShowService.jsx";
import Application from "./pages/userPages/Services/Application.jsx";
import ShowAppliedApplication from "./pages/userPages/Services/ShowAppliedApplication.jsx";
//AllServices
import AllServices from "./pages/userPages/Services/AllServices.jsx";

//Gallery Frontend
import AllGallery from "./pages/userPages/Gallery/Gallery.jsx";

//User View Profile
import ViewProfile from "./pages/userPages/viewProfile/viewProfile.jsx"

//Staff
import StaffLayout from "./components/layout/staff/staffLayout.jsx";
import StaffDashboard from "./pages/staffPages/staffDashboard/staffDashboard.jsx";

//Officer
import OfficerLayout from "./components/layout/officer/officerLayout.jsx";
import OfficerDashboard from "./pages/officerPages/officerDashboard/officerDashboard.jsx";

//Officer Services
import OfficerServices from "./pages/officerPages/Service/Services/viewServices.jsx";
import OfficerAddServices from "./pages/officerPages/Service/Services/addServices.jsx";
import OfficereditServices from "./pages/officerPages/Service/Services/editServices.jsx";

//aboutUs
import AboutUs from "./pages/userPages/aboutUs/aboutUs.jsx"

//User contact
import ContactUs from "./pages/userPages/contactUs/contactUs.jsx"

//User WebsitePolicies
import WebsitePolicies from "./pages/userPages/WebsitePolicies/WebsitePolicies.jsx"

//Help
import Help from "./pages/userPages/Help/help.jsx";

//User Feedback
import Feedback from "./pages/userPages/Feedback/feedback.jsx";

function App() {
  const { loading, isAuthenticated, role } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={2000} />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<LoginPage />} />
          <Route element={<UserLayout />}>
            <Route path="/" element={<UserHomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/all-gallery" element={<AllGallery />} />
            <Route path="/view-profile" element={<ViewProfile />} />
            <Route path="apply-service/:serviceId" element={<Application />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="help" element={<Help />} />
            <Route path="website-policies" element={<WebsitePolicies />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="all-services" element={<AllServices />} />
            <Route
              path="application-status"
              element={<ShowAppliedApplication />}
            />
            <Route
              path="/categorized-services/:categoryId"
              element={<CategorizedService />}
            />
            <Route path="/view-service/:serviceId" element={<ShowService />} />
          </Route>

          {isAuthenticated && role === "admin" && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              {/* Category */}
              <Route path="view-all-category" element={<AdminCategory />} />
              <Route path="add-category" element={<AdminAddCategory />} />
              <Route path="edit-category/:id" element={<AdmineditCategory />} />
              {/* sub category */}
              <Route
                path="/admin/view-subcategory/:id"
                element={<ViewSubCategory />}
              />
              <Route
                path="/admin/add-subcategory/:id"
                element={<AdminAddCategory />}
              />
              <Route
                path="/admin/edit-subcategory/:id"
                element={<AdmineditCategory />}
              />
              {/* Services */}
              <Route path="view-all-services" element={<AdminServices />} />
              <Route path="add-services" element={<AdminAddServices />} />
              <Route path="edit-services/:id" element={<AdmineditServices />} />
              {/* User */}
              <Route path="view-all-user" element={<AdminUser />} />
              <Route path="add-user" element={<AdminAddUser />} />
              <Route path="edit-user/:id" element={<AdmineditUser />} />
              {/* Gallery  */}
              <Route path="view-all-gallery" element={<AdminGallery />} />
              <Route path="add-gallery" element={<AdminAddGallery />} />
              <Route path="edit-gallery/:id" element={<AdmineditGallery />} />
              {/* Partner  */}
              <Route path="view-all-partner" element={<AdminPartner />} />
              <Route path="add-partner" element={<AdminAddPartner />} />
              <Route path="category-form/:catId" element={<FormEditorPage />} />
              {/* Application Show */}
              <Route
                path="view-all-application"
                element={<ViewAllApplication />}
              />
              <Route path="view-contact" element={<AdminContact />} />
              <Route path="view-feedback" element={<AdminFeedback />} />
            </Route>
          )}
          {isAuthenticated && role === "staff" && (
            <Route path="/staff" element={<StaffLayout />}>
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route
                path="view-all-application"
                element={<ViewAllApplication />}
              />
            </Route>
          )}
          {isAuthenticated && role === "officer" && (
            <Route path="/officer" element={<OfficerLayout />}>
              <Route path="dashboard" element={<OfficerDashboard />} />
              {/* Services */}
              <Route path="view-all-services" element={<OfficerServices />} />
              <Route path="add-services" element={<OfficerAddServices />} />
              <Route
                path="edit-services/:id"
                element={<OfficereditServices />}
              />

              <Route
                path="view-all-application"
                element={<ViewAllApplication />}
              />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
      <ScrollToTopButton />
    </div>
  );
}

export default App;
