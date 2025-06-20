import React, { useState, useEffect } from "react";
import TableComponent from "../../../components/commonComponent/CrudComponent/TableComponent";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const viewPartner = () => {
  const [partnerItems, setPartnerItems] = useState([]);

  //show all data
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/admin/get-partner", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPartnerItems(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filteredItems = (partnerItems || []).map((item, index) => ({
    Id: index + 1,
    Image: (
      <img
        src={item.image}
        alt={`Partner ${index + 1}`}
        className="w-10 h-10 object-cover rounded"
      />
    ),
    id: item._id,
    isActive: item.isActive,
    editPath: false,
  }));

  //change the active and inactive section
  const handleToggleActive = async (id, isActive) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/admin/toggle-partner-status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive }),
        }
      );
      const updatedItem = await res.json();

      // Optionally update the UI without refetching:
      setPartnerItems((prev) =>
        prev.map((item) =>
          item._id === updatedItem.updated._id ? updatedItem.updated : item
        )
      );
      toast.success(
        `Partner ${isActive ? "activated" : "deactivated"} successfully`
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
        `http://localhost:5000/admin/delete-partner/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setPartnerItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Partner deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="sm:px-4 md:px-6 py-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <TableComponent
        title="Partner"
        columns={["Id", "Image"]}
        data={filteredItems}
        addPath="/admin/add-partner"
        handleToggleActive={handleToggleActive}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default viewPartner;
