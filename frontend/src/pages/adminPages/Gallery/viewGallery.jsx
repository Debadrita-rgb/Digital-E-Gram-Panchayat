import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TableComponent from "../../../components/commonComponent/CrudComponent/TableComponent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const viewGallery = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [gallery, setGallery] = useState([]);
    const [activeRole, setActiveRole] = useState("Gallery");

    useEffect(() => {
      const token = localStorage.getItem("token");
      fetch("http://localhost:5000/admin/get-gallery", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setGallery(data))
        .catch((err) => console.error("Fetch error:", err));
    }, []);

    const filteredGallerys = gallery
      .filter((g) => g.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((g, index) => ({
        Id: index + 1,
        Name: g.name,
        id: g._id,
        isActive: g.isActive,
        editPath: `/admin/edit-gallery/${g._id}`,
      }));

    const handleToggleActive = async (id, isActive) => {
      const token = localStorage.getItem("token");
      const foundGallery = gallery.find((u) => u._id === id);
      try {
        const res = await fetch(
          `http://localhost:5000/admin/toggle-gallery-status/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive }),
          }
        );
        const updated = await res.json();
        setGallery((prev) =>
          prev.map((u) => (u._id === updated.updated._id ? updated.updated : u))
        );
        toast.success(
          `Gallery ${isActive ? "activated" : "deactivated"} successfully`
        );
      } catch (err) {
        toast.error("Status toggle failed");
      }
    };

    const handleDelete = async (id) => {
      const token = localStorage.getItem("token");
      if (!window.confirm("Are you sure you want to delete this gallery?")) return;
      try {
        await fetch(`http://localhost:5000/admin/delete-gallery/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setGallery((prev) => prev.filter((u) => u._id !== id));
        toast.success(`${activeRole} deleted successfully`);
      } catch (err) {
        toast.error("Delete failed");
      }
    };

    return (
      <div className="sm:px-4 md:px-6 py-6">
        <ToastContainer position="top-right" autoClose={2000} />
        <TableComponent
          title="Gallery"
          addPath="/admin/add-gallery"
          columns={["Id", "Name"]}
          data={filteredGallerys}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleToggleActive={handleToggleActive}
          handleDelete={handleDelete}
          showAddButton={true}
        />
      </div>
    );
  };

export default viewGallery;
