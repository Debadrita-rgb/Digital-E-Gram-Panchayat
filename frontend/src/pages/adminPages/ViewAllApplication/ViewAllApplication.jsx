import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";

const ViewAllApplication = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [pendingApplication, setPendingApplication] = useState([]);
  const [acceptedApplication, setAcceptedApplication] = useState([]);
  const [rejectedApplication, setRejectedApplication] = useState([]);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [documentData, setDocumentData] = useState([
    { title: "", text: "", file: null },
  ]);
  const [rejectionModal, setRejectionModal] = useState({
    open: false,
    appId: null,
  });
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/admin/get-all-applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not OK");
        return res.json();
      })
      .then((data) => {
        setPendingApplication(data.Pending || []);
        setAcceptedApplication(data.Accepted || []);
        setRejectedApplication(data.Rejected || []);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filteredOrders =
    activeTab === "Pending"
      ? pendingApplication
      : activeTab === "Accepted"
      ? acceptedApplication
      : rejectedApplication;

  const handleOpenModal = async (userId) => {
    const token = localStorage.getItem("token");

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/admin/get-full-userdetails/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDetails(res.data);
        setProfilePhoto(res.data.profilePhoto);

        const existingDocs =
          Array.isArray(res.data.items) && res.data.items.length > 0
            ? res.data.items.map((doc) => ({
                title: doc.title,
                text: doc.text,
                file: doc.documents
                  ? `http://localhost:5000/uploads/document/${doc.documents}`
                  : null,
              }))
            : [{ title: "", text: "", file: null }];

        setDocumentData(existingDocs);

        setModalOpen(true);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  };
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const statusFromQuery = query.get("status");
    if (statusFromQuery) {
      setActiveTab(
        statusFromQuery.charAt(0).toUpperCase() + statusFromQuery.slice(1)
      );
    }
  }, []);

  const handleUpdateStatus = async (appId, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/admin/update-application-status",
        {
          appId,
          status,
          reason: status === "Rejected" ? rejectionReason : "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      toast.success(`Application ${status}`);
      setRejectionModal({ open: false, appId: null });
      setRejectionReason("");
      // Refresh page with updated status
      const newURL = new URL(window.location);
      newURL.searchParams.set("status", status.toLowerCase());
      window.location.href = newURL.toString();
    } catch (err) {
      console.error(err);
      toast.error("Error updating application");
    }
  };
  
  
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
        {["Pending", "Accepted", "Rejected"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${
              activeTab === status
                ? status === "Pending"
                  ? "bg-blue-500 text-white"
                  : status === "Accepted"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">No {activeTab} applications found.</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((app, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white w-full overflow-hidden break-words"
            >
              <h3 className="text-lg font-semibold text-blue-700">
                {app?.serviceId?.name || "Untitled Service"}
              </h3>

              <p className="text-sm text-gray-500 mb-1">
                Submitted At: {new Date(app.submittedAt).toLocaleString()}
              </p>

              <p className="text-sm text-gray-700 font-medium mb-1 flex flex-wrap items-center">
                Applicant: {app.submittedBy?.name} ({app.submittedBy?.phone})
                <button
                  className="text-blue-600 hover:underline ml-2"
                  onClick={() => handleOpenModal(app.submittedBy._id)}
                >
                  <FaEye />
                </button>
              </p>

              <p className="text-sm text-yellow-800 font-semibold">
                Status: {app.status}
              </p>

              {app.status === "Rejected" && app.description && (
                <p className="text-sm text-red-600 mt-1 font-medium">
                  Rejection Reason: {app.description}
                </p>
              )}

              <div className="mt-2 space-y-1 text-sm break-words">
                {Object.entries(app.data || {}).map(([key, value]) => (
                  <p key={key}>
                    <span className="font-medium capitalize">{key}:</span>{" "}
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </p>
                ))}
              </div>

              {activeTab === "Pending" && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    className="px-4 py-1 bg-green-500 text-white rounded"
                    onClick={() => handleUpdateStatus(app._id, "Accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-1 bg-red-500 text-white rounded"
                    onClick={() =>
                      setRejectionModal({ open: true, appId: app._id })
                    }
                  >
                    Reject
                  </button>
                </div>
              )}

              {app.status !== "Pending" && app.actionTakenBy && (
                <p className="text-sm text-green-800 mt-2 break-words">
                  Action By: {app.actionTakenBy?.name} (
                  {app.actionTakenBy?.email})
                  <br />
                  On: {new Date(app.actionTakenAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-lg">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-3 text-black text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Applicant Details
            </h2>
            <div className="flex items-center justify-center py-5 bg-gray-100">
              <div className="w-full max-w-full bg-white p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={details?.name || ""}
                      placeholder="Full Name"
                      readOnly
                      className="w-full px-4 py-2 border rounded shadow-sm bg-gray-200"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="text"
                      name="phone"
                      value={details?.phone || ""}
                      readOnly
                      placeholder="Phone Number"
                      className="w-full px-4 py-2 border rounded bg-gray-200 shadow-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={details?.email || ""}
                      placeholder="Email"
                      readOnly
                      className="w-full px-4 py-2 border rounded shadow-sm bg-gray-200"
                    />
                  </div>

                  <div className="">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={details?.address || ""}
                      placeholder="Address"
                      className="w-full px-4 py-2 border rounded shadow-sm bg-gray-200"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Photo
                    </label>

                    {profilePhoto && (
                      <img
                        src={
                          typeof profilePhoto === "string"
                            ? profilePhoto.startsWith("http")
                              ? profilePhoto
                              : `http://localhost:5000/uploads/profile/${profilePhoto}`
                            : URL.createObjectURL(profilePhoto)
                        }
                        alt="Profile"
                        className="mt-2 h-24 w-24 object-cover rounded-full border"
                      />
                    )}
                  </div>
                </div>
                <div className="mt-6 bg-white p-4 rounded-md shadow-md border">
                  <div
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => setShowDocuments((prev) => !prev)}
                  >
                    <h2 className="text-lg font-semibold text-gray-800">
                      Document Details
                    </h2>
                    <button className="text-gray-600 hover:text-black focus:outline-none">
                      {showDocuments ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {/* Collapsible Section */}
                  {showDocuments && (
                    <div className="space-y-4 transition-all duration-300">
                      {documentData.map((entry, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end border p-4 rounded-md bg-gray-50"
                        >
                          {/* Title */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Identification Card{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={entry.title}
                              readOnly
                              className="px-4 py-2 border rounded shadow-sm w-full bg-gray-200"
                            />
                          </div>

                          {/* Text */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Identification Number
                            </label>
                            <input
                              type="text"
                              placeholder="Text"
                              value={entry.text}
                              readOnly
                              className="px-4 py-2 border rounded shadow-sm w-full bg-gray-200"
                            />
                          </div>

                          {/* File */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Upload File
                            </label>
                            {entry.file && typeof entry.file === "string" && (
                              <a
                                href={entry.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 mt-2 inline-block"
                              >
                                <FaEye className="inline mr-1" /> View File
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setRejectionModal({ open: false, appId: null })}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Reject Application</h2>
            <textarea
              rows={4}
              placeholder="Enter rejection reason"
              className="w-full border rounded p-2 mb-4"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <button
              onClick={() =>
                handleUpdateStatus(rejectionModal.appId, "Rejected")
              }
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Submit Rejection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllApplication;
