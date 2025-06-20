import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DynamicForm from "../../../components/commonComponent/CrudComponent/DynamicFormComponent";

const editGallery = () => {
  const navigate = useNavigate();
  const { id: galleryId } = useParams();
  const token = localStorage.getItem("token");
  const [initialData, setInitialData] = useState(null);

  const [galleryItems, setGalleryItems] = useState([
    { imageUrl: "" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/admin/get-single-gallery/${galleryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;
        setInitialData({
          name: data.name || "",
        });

        setGalleryItems(data.galleryItems || [{imageUrl: "" }]);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
        toast.error("Failed to load gallery.");
      }
    };

    if (galleryId) fetchData();
  }, [galleryId, token]);

  const handleAddGallery = () => {
    setGalleryItems([...galleryItems, { imageUrl: "" }]);
  };

  const handleRemoveGallery = (index) => {
    const updatedItems = [...galleryItems];
    updatedItems.splice(index, 1);
    setGalleryItems(updatedItems);
  };

  const handleGalleryChange = (index, field, value) => {
    const updatedItems = [...galleryItems];
    updatedItems[index][field] = value;
    setGalleryItems(updatedItems);
  };

  const handleSubmit = async (formData) => {
    try {
      const updatedData = {
        ...formData,
        galleryItems,
      };

      const res = await axios.put(
        `http://localhost:5000/admin/update-gallery/${galleryId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Gallery updated successfully!");
        navigate("/admin/view-all-gallery");
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed");
    }
  };

  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },]

  return (
    <div className="sm:px-4 md:px-6 py-6">
      <ToastContainer position="top-right" autoClose={2000} />

      <h2 className="text-xl font-bold mb-4">Edit Gallery</h2>

      {/* Gallery Items Section */}
      <div className="mb-6 bg-white p-6 border rounded-xl shadow w-full">
        <label className="block mb-4 text-sm font-semibold text-gray-700">
          Add Image Link
        </label>

        {galleryItems.map((item, index) => (
          <div
            key={index}
            className="mb-4 flex flex-col md:flex-row gap-4 items-center"
          >
            <input
              type="text"
              placeholder="Image URL"
              value={item.imageUrl}
              onChange={(e) =>
                handleGalleryChange(index, "imageUrl", e.target.value)
              }
              className="p-2 border w-full border-gray-300 rounded-lg focus:outline-none focus:ring text-black"
            />
            <button
              type="button"
              onClick={() => handleRemoveGallery(index)}
              className="text-red-600 font-bold px-2 py-1"
            >
              −
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddGallery}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Gallery
        </button>
      </div>

      {/* Dynamic Form */}
      {initialData ? (
        <DynamicForm
          fields={fields.map((f) => ({ ...f, value: initialData[f.name] }))}
          onSubmit={handleSubmit}
          submitText="Update Gallery"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default editGallery;
