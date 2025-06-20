// pages/FillForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaChevronDown, FaChevronUp } from "react-icons/fa";

const FillForm = () => {
  const { serviceId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [servicename, setServiceName] = useState();
  const navigate = useNavigate();
  const [details, setDetails] = useState();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [documentData, setDocumentData] = useState([
    { title: "", text: "", file: null },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/user/get-categorized-form/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setForm(res.data.form);
        setServiceName(res.data.service.name);
      });
  }, [serviceId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (userId && token) {
      const fetchUserProfile = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/user/get-full-userdetails/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setDetails({
            ...res.data,
            dob: res.data.dob ? res.data.dob.slice(0, 10) : "",
          });
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
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      };

      fetchUserProfile();
    }
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/user/submit-form",
        {
          serviceId,
          data: formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Form submitted! Status: Pending");
      setFormData({});
      setTimeout(() => {
        navigate("/application-status?status=Pending");
      }, 2000);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Form submission failed!");
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="mx-auto px-4 py-5 lg:mt-20 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Banner */}
      <div
        className="relative w-full h-56 rounded-lg overflow-hidden mb-8"
        style={{
          backgroundImage: `url("https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2025/02/202502061433080426.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0  bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">{servicename}</h1>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-200 dark:bg-gray-800 max-w-7xl mx-auto px-4 py-12 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        <div className="w-full max-w-full bg-gray-200 dark:bg-gray-900 p-6 rounded-lg ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={details?.name || ""}
                readOnly
                className="w-full px-4 py-2 border rounded shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={details?.phone || ""}
                readOnly
                className="w-full px-4 py-2 border rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                value={details?.email || ""}
                readOnly
                className="w-full px-4 py-2 border rounded shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={details?.gender || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                name="dob"
                value={details?.dob || ""}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Address
              </label>
              <input
                type="text"
                value={details?.address || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Document Section */}
            <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-md shadow-md border dark:border-gray-600">
              <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setShowDocuments((prev) => !prev)}
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Document Details
                </h2>
                <button className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  {showDocuments ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {showDocuments && (
                <div className="space-y-4 transition-all duration-300 bg-gray-200">
                  {documentData.map((entry, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end border p-4 rounded-md bg-gray-50 dark:bg-gray-700"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Identification Card{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={entry.title}
                          readOnly
                          className="px-4 py-2 border rounded shadow-sm w-full bg-gray-200 dark:bg-gray-600 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Identification Number
                        </label>
                        <input
                          type="text"
                          value={entry.text}
                          readOnly
                          className="px-4 py-2 border rounded shadow-sm w-full bg-gray-200 dark:bg-gray-600 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
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

      {/* Dynamic Form Section */}
      <div className="flex items-center justify-center bg-gray-200 dark:bg-gray-800 max-w-7xl mx-auto px-4 py-12 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        <div className="w-full max-w-full bg-gray-200 dark:bg-gray-900 p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {form.fields.map((field, idx) => (
                <div key={idx}>
                  <label className="block mb-1 font-semibold text-gray-800 dark:text-white">
                    {field.label}
                  </label>

                  {field.type === "text" && (
                    <input
                      type="text"
                      onChange={(e) =>
                        handleChange(field.label, e.target.value)
                      }
                      className="border p-2 w-full dark:bg-gray-700 dark:text-white"
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      onChange={(e) =>
                        handleChange(field.label, e.target.value)
                      }
                      className="border p-2 w-full dark:bg-gray-700 dark:text-white"
                      rows="4"
                    />
                  )}

                  {field.type === "radio" &&
                    field.options.map((opt, i) => (
                      <label
                        key={i}
                        className="block text-gray-800 dark:text-gray-200"
                      >
                        <input
                          type="radio"
                          name={field.label}
                          value={opt}
                          onChange={(e) =>
                            handleChange(field.label, e.target.value)
                          }
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}

                  {field.type === "checkbox" &&
                    field.options.map((opt, i) => (
                      <label
                        key={i}
                        className="block text-gray-800 dark:text-gray-200"
                      >
                        <input
                          type="checkbox"
                          name={field.label}
                          value={opt}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData((prev) => {
                              const existing = prev[field.label] || [];
                              return {
                                ...prev,
                                [field.label]: checked
                                  ? [...existing, opt]
                                  : existing.filter((val) => val !== opt),
                              };
                            });
                          }}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}

                  {field.type === "date" && (
                    <input
                      type="date"
                      onChange={(e) =>
                        handleChange(field.label, e.target.value)
                      }
                      className="border p-2 w-full dark:bg-gray-700 dark:text-white"
                    />
                  )}

                  {field.type === "email" && (
                    <input
                      type="email"
                      onChange={(e) =>
                        handleChange(field.label, e.target.value)
                      }
                      className="border p-2 w-full dark:bg-gray-700 dark:text-white"
                    />
                  )}

                  {field.type === "file" && (
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange(field.label, e.target.files[0])
                      }
                      className="border p-2 w-full dark:bg-gray-700 dark:text-white"
                    />
                  )}

                  {field.type === "number" && (
                    <input
                      type="number"
                      onChange={(e) =>
                        handleChange(field.label, e.target.value)
                      }
                      className="border p-2 w-full dark:bg-gray-700 dark:text-white"
                    />
                  )}

                  {field.type === "password" && (
                    <input
                      type="password"
                      onChange={(e) =>
                        handleChange(field.label, e.target.value)
                      }
                      className="border p-2 w-full dark:bg-gray-700 dark:text-white"
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FillForm;
