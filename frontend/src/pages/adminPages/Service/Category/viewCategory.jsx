import React, { useState, useEffect } from "react";
import TableComponent from "../../../../components/commonComponent/CrudComponent/TableComponent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ViewCategory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/admin/get-maincategory", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategory(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filteredItems = (category || [])
    .filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((item, index) => {
      return {
        Id: index + 1,
        Categoryname: item.name,
        id: item._id,
        isActive: item.isActive,
        editPath: `/admin/edit-category/${item._id}`,
        // viewSubPath: `/admin/view-subcategory/${item._id}`,
        viewSubPath: `/admin/category-form/${item._id}`,
      };
    });

  const handleToggleActive = async (id, isActive) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/admin/toggle-category-status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive }),
        }
      );

      if (!res.ok) throw new Error("Toggle failed");

      setCategory((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isActive } : item))
      );

      toast.success(
        `Category ${isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  // delete
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!id) {
      console.error("Invalid ID passed to delete.");
      toast.error("Invalid item selected for deletion.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/admin/delete-category/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setCategory((prev) => prev.filter((item) => item._id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="sm:px-4 md:px-6 py-6">
      <div>
        <TableComponent
          title="Category"
          columns={["Id", "Categoryname"]}
          data={filteredItems}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleToggleActive={handleToggleActive}
          handleDelete={handleDelete}
          showAddButton={true}
          addPath="/admin/add-category"
          viewLabel="form"
        />
      </div>
    </div>
  );
};

export default ViewCategory;
