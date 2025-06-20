import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TableComponent from "../../../components/commonComponent/CrudComponent/TableComponent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [staff, setStaff] = useState([]);
  const [activeRole, setActiveRole] = useState("Staff");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/admin/get-staff-users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStaff(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filteredUsers = (staff || [])
    .filter((user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((user, index) => ({
      Id: index + 1,
      Name: user.name,
      Email: user.email,
      id: user._id,
      isActive: user.isActive,
      Role: user.role,
      editPath: `/admin/edit-user/${user._id}`,
    }));

    const handleToggleActive = async (id, isActive) => {
    const token = localStorage.getItem("token");
    const user = staff.find((u) => u._id === id);
    const role = user?.role || "User";
    try {
      const res = await fetch(
        `http://localhost:5000/admin/toggle-user-status/${id}`,
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
      setStaff((prev) =>
        prev.map((u) => (u._id === updated.updated._id ? updated.updated : u))
      );
      toast.success(
        `${role} ${isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      toast.error("Status toggle failed");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/admin/delete-user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff((prev) => prev.filter((u) => u._id !== id));
      toast.success(`${activeRole} deleted successfully`);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="sm:px-4 md:px-6 py-6">
      <TableComponent
        title="User"
        addPath="/admin/add-user"
        columns={["Id", "Name", "Email"]}
        data={filteredUsers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleToggleActive={handleToggleActive}
        handleDelete={handleDelete}
        showAddButton={true}
      />
    </div>
  );
};

export default ViewUser;
