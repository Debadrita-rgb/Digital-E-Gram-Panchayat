import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../../components/commonComponent/CrudComponent/DynamicFormComponent";
import { jwtDecode } from "jwt-decode";

const AddCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const categoryFields = [
    // ...(id
    //   ? [
    //       {
    //         name: "undercategory",
    //         label: "Under Category",
    //         type: "text",
    //         value: id,
    //         readOnly: true,
    //       },
    //     ]
    //   : []),
    { name: "name", label: "Category Name", type: "text" },
    { name: "image", label: "Image Link", type: "text" },
    { name: "description", label: "Description", type: "tiptap" },
  ];

  const handleAddCategory = async (data) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const decoded = jwtDecode(token);
    const createdBy = decoded.id || decoded.userId || decoded._id;
    try {
      const res = await fetch("http://localhost:5000/admin/add-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          createdBy,
          role,
          undercategory: id,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success("Category added successfully");
        if(id != null){
          navigate(`/admin/view-subcategory/${id}`);
        }else{
          navigate("/admin/view-all-category");
        }
        
      } else {
        toast.error(json.error || "Failed to add Category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add Category");
    }
  };

  return (
    <div className="sm:px-4 md:px-6 py-6">
      <DynamicForm
        fields={categoryFields}
        onSubmit={handleAddCategory}
        submitText="Add Category"
      />
    </div>
  );
};

export default AddCategory;
