import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../components/commonComponent/CrudComponent/DynamicFormComponent";

const AddUser = () => {
  const navigate = useNavigate();

  const userFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { label: "Staff", value: "Staff" },
        { label: "Officer", value: "Officer" },
      ],
    },
  ];

  const handleAddUser = async (data) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/admin/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success("User added successfully");
        navigate("/admin/view-all-user");
      } else {
        toast.error(json.error || "Failed to add user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add user");
    }
  };

  return (
    <div className="sm:px-4 md:px-6 py-6">
      <DynamicForm
        fields={userFields}
        onSubmit={handleAddUser}
        submitText="Add User"
      />
    </div>
  );
};

export default AddUser;
