import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../components/commonComponent/CrudComponent/DynamicFormComponent";

const addGallery = () => {
const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([
    { imageUrl: "" },
  ]);

  const handleGalleryChange = (index, field, value) => {
    const updatedItems = [...galleryItems];
    updatedItems[index][field] = value;
    setGalleryItems(updatedItems);
  };

  const handleAddGallery = () => {
    setGalleryItems([...galleryItems, { imageUrl: "" }]);
  };

  const handleRemoveGallery = (index) => {
    const updatedItems = [...galleryItems];
    updatedItems.splice(index, 1);
    setGalleryItems(updatedItems);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const dataToSend = {
        ...formData,
        galleryItems,
      };

      await axios.post("http://localhost:5000/admin/add-gallery", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Gallery added successfully!");
      navigate("/admin/view-all-gallery");
    } catch (error) {
      toast.error("Failed to add Gallery item");
      console.error(error);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
]
  return (
    <div className="sm:px-4 md:px-6 py-6">
      <div className="mb-6 bg-white p-6 border rounded-xl shadow w-full">
        <h3 className="text-sm font-semibold mb-4 text-gray-700">
          Add Image Link
        </h3>

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
      <DynamicForm
        fields={fields}
        onSubmit={handleFormSubmit}
        submitText="Save Gallery"
      />
    </div>
  );
};

export default addGallery;
