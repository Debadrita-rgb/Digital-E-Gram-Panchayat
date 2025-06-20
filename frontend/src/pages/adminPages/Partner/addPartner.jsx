import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../components/commonComponent/CrudComponent/DynamicFormComponent";

const addPartner = () => {
  const navigate = useNavigate();

  const fields = [{ name: "image", label: "Image Link", type: "text" }];

  const handleFormSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/admin/add-partner", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Partner added successfully!");
      navigate("/admin/view-all-partner");
    } catch (error) {
      toast.error("Failed to add Catering item");
      console.error(error);
    }
  };

  return (
    <div className="sm:px-4 md:px-6 py-6">
      <DynamicForm
        fields={fields}
        onSubmit={handleFormSubmit}
        submitText="Add Partner"
      />
    </div>
  );
};

export default addPartner;
