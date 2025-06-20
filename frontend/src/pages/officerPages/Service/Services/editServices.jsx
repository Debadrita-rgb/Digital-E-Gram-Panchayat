import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../../components/commonComponent/CrudComponent/DynamicFormComponent";

const EditServices = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const navigate = useNavigate();

  // Fetch service by ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/admin/get-single-service/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setService(data);
      })
      .catch((err) => console.error("Error fetching Service:", err));
  }, [id]);

  // Fetch categories
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/admin/get-maincategory", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMainCategories(data);
      })
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  useEffect(() => {
    if (service && mainCategories.length > 0) {
      const categoryOptions = mainCategories.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));
      const selectedCategory = categoryOptions.find(
        (opt) => opt.value === service.category
      );

      setFormFields([
        {
          name: "name",
          label: "Service Name",
          value: service.name,
        },
        {
          name: "image",
          label: "Image Link",
          value: service.image,
          type: "text",
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          value: service.category,
          options: categoryOptions,
        },
        {
          name: "description",
          label: "Description",
          value: service.description,
          type: "tiptap",
        },
      ]);
    }
  }, [service, mainCategories]);
  

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/admin/update-service/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error("Update failed");
      toast.success("Service updated successfully");
      
      navigate("/officer/view-all-services");
      
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update failed");
    }
  };

  if (!formFields.length) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <DynamicForm
        fields={formFields}
        onSubmit={handleSubmit}
        submitText="Update Service"
      />
    </div>
  );
};

export default EditServices;
