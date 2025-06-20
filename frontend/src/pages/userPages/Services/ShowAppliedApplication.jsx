import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye} from "react-icons/fa";

const ShowAppliedApplication = () => {
  const [applications, setApplications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [rejectedReason, setRejectedReason] = useState("");

  // Extract status from query params
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get("status") || "Pending";

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/user/show-all-applied-application",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Filter by status
        const filtered = res.data.filter((app) => app.status === statusFilter);
        setApplications(filtered);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      }
    };

    fetchApplications();
  }, [statusFilter]);

  // Tab button handler
  const handleTabClick = (status) => {
    navigate(`/application-status?status=${status}`);
  };

  const handleOpenModal = (reason) => {
    setRejectedReason(reason);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRejectedReason("");
  };

  return (
    <div className="mx-auto px-4 py-5 lg:mt-20 text-gray-800 dark:text-gray-200">
      {/* Banner */}
      <div
        className="relative w-full h-56 rounded-lg overflow-hidden mb-8"
        style={{
          backgroundImage: `url("https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2025/02/202502061433080426.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">
            Your Applied Applications
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {["Pending", "Accepted", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => handleTabClick(status)}
            className={`px-4 py-2 rounded-md font-medium cursor-pointer transition ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 max-w-7xl mx-auto px-4 py-12">
        {applications.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">
            No {statusFilter.toLowerCase()} applications found.
          </p>
        ) : (
          <div className="space-y-4 w-full max-w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            {applications.map((app, index) => (
              <div
                key={index}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-md bg-white dark:bg-gray-700 relative pb-12"
              >
                {app.status === "Rejected" && app.description && (
                  <>
                    {/* View Reason on desktop */}
                    <button
                      className="hidden md:flex absolute top-4 right-4 text-blue-600 items-center text-sm cursor-pointer"
                      onClick={() => handleOpenModal(app.description)}
                    >
                      <FaEye className="mr-1" /> View Reason
                    </button>

                    {/* View Reason on mobile */}
                    <button
                      className="absolute bottom-4 right-4 flex md:hidden text-blue-600 hover:underline items-center text-sm"
                      onClick={() => handleOpenModal(app.description)}
                    >
                      <FaEye className="mr-1" /> View Reason
                    </button>
                  </>
                )}

                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                  {app?.serviceId?.name || "Untitled Service"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                  Submitted on: {new Date(app.submittedAt).toLocaleString()}
                </p>
                <p
                  className={`text-sm font-bold mb-2 ${
                    app.status === "Accepted"
                      ? "text-green-600 dark:text-green-400"
                      : app.status === "Rejected"
                      ? "text-red-600 dark:text-red-400"
                      : "text-yellow-700 dark:text-yellow-400"
                  }`}
                >
                  Status: {app.status}
                </p>

                <div className="mt-2 space-y-1">
                  {Object.entries(app.data).map(([key, value]) => (
                    <p key={key} className="text-gray-800 dark:text-gray-200">
                      <span className="font-medium">{key}:</span>{" "}
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-[90%] max-w-3xl mx-auto relative text-gray-800 dark:text-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
              Rejection Reason
            </h2>
            <p className="text-lg leading-relaxed">{rejectedReason}</p>
            <button
              className="absolute top-4 right-5 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white text-2xl font-bold"
              onClick={handleCloseModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAppliedApplication;
