import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TableComponent from "../../../../components/commonComponent/CrudComponent/TableComponent";
import { toast } from "react-toastify";

const ViewSubCategory = () => {
  const { id } = useParams();   
  const [subcategories, setSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [parentcategory, setParentCategory] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        // Always fetch parent category name
        const resParent = await fetch(
          `http://localhost:5000/admin/get-single-category/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const parentData = await resParent.json();
        setParentCategory(parentData);

        // Fetch subcategories under this category
        const resSub = await fetch(
          `http://localhost:5000/admin/get-categorized-subcategory?category=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const subData = await resSub.json();
        setSubcategories(subData);
      } catch (err) {
        console.error("Error fetching category/subcategories:", err);
        toast.error("Failed to load category data");
      }
    };

    fetchData();
  }, [id]);
  

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
  
        setSubcategories((prev) =>
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
  
        setSubcategories((prev) => prev.filter((item) => item._id !== id));
        toast.success("Category deleted successfully");
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Delete failed");
      }
    };

  const filteredItems = subcategories
    .filter((item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((item, index) => {
        return {
            ID: index+1,
            id: item._id,
            Subcategoryname: item.name,
            isActive: item.isActive,
            editPath: `/admin/edit-subcategory/${item._id}`,
        }
    });

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Subcategories under:{" "}
        <span className="text-blue-600">
          {parentcategory?.name || "Loading..."}
        </span>
      </h2>
      <TableComponent
        title="Subcategory"
        columns={["ID", "Subcategoryname"]}
        data={filteredItems}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleToggleActive={handleToggleActive}
        handleDelete={handleDelete}
        addPath={`/admin/add-subcategory/${id}`}
      />
    </div>
  );
};

export default ViewSubCategory;
