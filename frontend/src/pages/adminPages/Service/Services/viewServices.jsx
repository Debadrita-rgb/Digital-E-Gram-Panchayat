import React, { useState, useEffect } from "react";
import TableComponent from "../../../../components/commonComponent/CrudComponent/TableComponent";
import { toast } from "react-toastify";

const viewServices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchServicesAndCategories = async () => {
      try {
        const [serviceRes, categoryRes] = await Promise.all([
          fetch("http://localhost:5000/admin/get-service", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/admin/get-maincategory", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [serviceData, categoryData] = await Promise.all([
          serviceRes.json(),
          categoryRes.json(),
        ]);

        setCategories(categoryData);

        // Add category name into each service
        const merged = serviceData.map((service) => {
          const cat = categoryData.find((c) => c._id === service.category);
          return { ...service, categoryName: cat?.name || "Unknown" };
        });

        setServices(merged);
      } catch (err) {
        console.error("Error fetching services or categories:", err);
      }
    };

    fetchServicesAndCategories();
  }, []);
  

  const filteredItems = (services || [])
    .filter((item) => {
      const matchesName = item.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesName && matchesCategory;
    })
    .map((item, index) => ({
      Id: index + 1,
      Servicesname: item.name,
      Category: item.categoryName || "N/A",
      id: item._id,
      isActive: item.isActive,
      editPath: `/admin/edit-services/${item._id}`,
    }));


  const handleToggleActive = async (id, isActive) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/admin/toggle-service-status/${id}`,
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

      setServices((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isActive } : item))
      );

      toast.success(
        `Services ${isActive ? "activated" : "deactivated"} successfully`
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
        `http://localhost:5000/admin/delete-service/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setServices((prev) => prev.filter((item) => item._id !== id));
      toast.success("Services deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow-md w-full">
      <div className="">
        <select
          className="border px-3 py-2 rounded-xl lg:w-1/3 md:w-1/3 border-black text-black w-full"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:px-4 md:px-6 py-6">
        <TableComponent
          title="Services"
          columns={["Id", "Servicesname", "Category"]}
          data={filteredItems}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleToggleActive={handleToggleActive}
          handleDelete={handleDelete}
          showAddButton={true}
          addPath="/admin/add-services"
        />
      </div>
    </div>
  );
};

export default viewServices;

