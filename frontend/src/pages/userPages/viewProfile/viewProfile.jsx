import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";

const viewProfile = () => {
  const [details, setDetails] = useState();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState([
    { title: "", text: "", file: null },
  ]);

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
  
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleDocumentChange = (index, field, value) => {
    const updated = [...documentData];
    if (field === "file") {
      updated[index][field] = value.target.files[0];
    } else {
      updated[index][field] = value;
    }
    setDocumentData(updated);
  };

  const handleProfilePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const addDocumentRow = () => {
    setDocumentData([...documentData, { title: "", text: "" }]);
  };

  const removeDocumentRow = (index) => {
    // const updated = documentData.filter((_, i) => i !== index);
    // setDocumentData(updated);
    if (documentData.length > 1) {
      const updated = documentData.filter((_, i) => i !== index);
      setDocumentData(updated);
    }
  };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("token");
  //   const userId = localStorage.getItem("userId");

  //   const formData = new FormData();
  //   formData.append("name", details.name);
  //   formData.append("email", details.email);
  //   formData.append("phone", details.phone);
  //   formData.append("address", details.address);
  //   formData.append("dob", details.dob);
  //   formData.append("gender", details.gender);

  //   if (profilePhoto) {
  //     formData.append("profilePhoto", profilePhoto);
  //   }

  //   documentData.forEach((doc, index) => {
  //     formData.append(`documents[${index}][title]`, doc.title);
  //     formData.append(`documents[${index}][text]`, doc.text);

  //     // New uploads only:
  //     if (doc.file && typeof doc.file !== "string") {
  //       formData.append(`documents[${index}][file]`, doc.file);
  //     }
  //     // Always send the existing filename (not URL) as fallback:
  //     if (typeof doc.file === "string") {
  //       // doc.file is an URL like 'http://…/uploads/document/myfile.png'
  //       // extract only the filename portion:
  //       const filename = doc.file.split("/").pop();
  //       formData.append(`documents[${index}][file]`, filename);
  //     }
  //   });
    
    

  //   try {
  //     const res = await axios.post(
  //       `http://localhost:5000/user/update-profile/${userId}`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     toast.success("Profile updated successfully!");
  //     setTimeout(() => {
  //       navigate("/view-profile");
  //     }, 2000);

  //   } catch (err) {
  //     console.error("Error submitting profile:", err);
  //     alert("Failed to update profile.");
  //   }
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const formData = new FormData();
    formData.append("name", details.name);
    formData.append("email", details.email);
    formData.append("phone", details.phone);
    formData.append("address", details.address);
    formData.append("dob", details.dob);
    formData.append("gender", details.gender);

    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    documentData.forEach((doc, index) => {
      formData.append(`documents[${index}][title]`, doc.title);
      formData.append(`documents[${index}][text]`, doc.text);

      if (doc.file && typeof doc.file !== "string") {
        formData.append(`documents[${index}][file]`, doc.file);
      }
      if (typeof doc.file === "string") {
        const filename = doc.file.split("/").pop();
        formData.append(`documents[${index}][file]`, filename);
      }
    });

    try {
      await axios.post(
        `http://localhost:5000/user/update-profile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully!");

      // ✅ Refetch updated profile before navigating
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

      const updatedDocs =
        Array.isArray(res.data.items) && res.data.items.length > 0
          ? res.data.items.map((doc) => ({
              title: doc.title,
              text: doc.text,
              file: doc.documents
                ? `http://localhost:5000/uploads/document/${doc.documents}`
                : null,
            }))
          : [{ title: "", text: "", file: null }];
      setDocumentData(updatedDocs);

      setTimeout(() => {
        navigate("/view-profile");
      }, 1000);
    } catch (err) {
      console.error("Error submitting profile:", err);
      toast.error("Failed to update profile.");
    }
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
        <div className="absolute inset-0 bg-opacity-60 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">View Profile</h1>
        </div>
      </div>

      <div className="flex items-center justify-center py-5 bg-gray-100 dark:bg-gray-900 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={details?.name || ""}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-2 border rounded shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={details?.phone || ""}
                  readOnly
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded shadow-sm bg-gray-200 dark:bg-gray-600 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={details?.email || ""}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={details?.gender || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
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
                  className="w-full px-4 py-2 border rounded shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Profile Photo */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upload Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="w-full px-2 py-1 border rounded shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
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

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={details?.address || ""}
                  onChange={handleChange}
                  placeholder="Address"
                  rows={3}
                  className="w-full px-4 py-2 border rounded shadow-sm resize-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Document Section */}
            <div className="border-t dark:border-gray-600 pt-6">
              <h2 className="text-xl font-semibold mb-4">
                Identification Card Info
              </h2>
              {documentData.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end mb-4"
                >
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Identification Card{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={entry.title}
                      required
                      onChange={(e) =>
                        handleDocumentChange(index, "title", e.target.value)
                      }
                      className="px-4 py-2 border rounded shadow-sm w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Select title</option>
                      <option value="Aadhar">Aadhar Card</option>
                      <option value="Ration">Ration Card</option>
                      <option value="Voter">Voter ID</option>
                    </select>
                  </div>

                  {/* Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Identification Number
                    </label>
                    <input
                      type="text"
                      placeholder="Identification Number"
                      value={entry.text}
                      onChange={(e) =>
                        handleDocumentChange(index, "text", e.target.value)
                      }
                      minLength={entry.title === "Aadhar" ? 12 : undefined}
                      maxLength={entry.title === "Aadhar" ? 12 : undefined}
                      required
                      pattern={entry.title === "Aadhar" ? "\\d{12}" : undefined}
                      className="px-4 py-2 border rounded shadow-sm w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Upload File
                    </label>
                    {entry.file && typeof entry.file === "string" && (
                      <a
                        href={entry.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 mt-1 inline-block underline"
                      >
                        <FaEye />
                      </a>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleDocumentChange(index, "file", e)}
                      className="w-full px-2 py-1 border rounded shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    {documentData.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDocumentRow(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        −
                      </button>
                    )}
                    {documentData.length < 3 && (
                      <button
                        type="button"
                        onClick={addDocumentRow}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700"
            >
              Submit Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default viewProfile;
