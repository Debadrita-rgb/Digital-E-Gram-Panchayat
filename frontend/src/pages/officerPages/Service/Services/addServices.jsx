import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../../components/commonComponent/CrudComponent/DynamicFormComponent";

const AddServices = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [showSubSelect, setShowSubSelect] = useState(false);

  const [formFields, setFormFields] = useState([
    { name: "name", label: "Service Name", type: "text" },
    { name: "image", label: "Image Link", type: "text" },
    { name: "category", label: "Main Category", type: "select", options: [] },
    { name: "description", label: "Description", type: "tiptap" },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/admin/get-maincategory", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      
      .then((data) => {
        setMainCategories(data);
        setFormFields((prev) =>
          prev.map((field) =>
            field.name === "category"
              ? {
                  ...field,
                  options: data.map((cat) => ({
                    label: cat.name,
                    value: cat._id,
                  })),
                }
              : field
          )
        );
      })
      .catch((err) => {
        console.error("Failed to fetch categories", err);
      });
  }, []);

  const handleDynamicFieldChange = async (name, value) => {
    if (name === "category") {
      setSelectedMainCategory(value);
      console.log("value", value);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `http://localhost:5000/admin/get-categorized-subcategory?category=${value}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const subData = await res.json();
        console.log("Subcategories fetched:", subData);
        setSubCategories(subData);

        if (subData.length > 0) {
          setShowSubSelect(true);

          // Add subcategory select field
          setFormFields((prev) => {
            const alreadyExists = prev.some((f) => f.name === "subcategory");
            if (!alreadyExists) {
              return [
                ...prev.slice(0, 3), // insert after category
                {
                  name: "subcategory",
                  label: "Subcategory",
                  type: "select",
                  options: subData.map((sub) => ({
                    label: sub.name,
                    value: sub._id,
                  })),
                },
                ...prev.slice(3),
              ];
            } else {
              // Update options if already added
              return prev.map((f) =>
                f.name === "subcategory"
                  ? {
                      ...f,
                      options: subData.map((sub) => ({
                        label: sub.name,
                        value: sub._id,
                      })),
                    }
                  : f
              );
            }
          });
        } else {
          setShowSubSelect(false);
          setFormFields((prev) => prev.filter((f) => f.name !== "subcategory"));
        }
      } catch (err) {
        console.error("Subcategory fetch failed", err);
        toast.error("Could not fetch subcategories");
      }
    }
  };

  const handleAddServices = async (data) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const decoded = jwtDecode(token);
    const createdBy = decoded.id || decoded.userId || decoded._id;

    try {
      const res = await fetch("http://localhost:5000/admin/add-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          createdBy,
          role,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success("Service added successfully");
        navigate("/officer/view-all-services");
      } else {
        toast.error(json.error || "Failed to add service");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add service");
    }
  };

  return (
    <div className="w-full px-10 py-8 ">
      <DynamicForm
        fields={formFields}
        onSubmit={handleAddServices}
        // onChange={handleDynamicFieldChange} 
        submitText="Add Service"
      />
    </div>
  );
};

export default AddServices;
