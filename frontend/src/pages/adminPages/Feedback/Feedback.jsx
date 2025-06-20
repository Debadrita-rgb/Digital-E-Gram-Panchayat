import React, { useState, useEffect } from "react";
import TableComponent from "../../../components/commonComponent/CrudComponent/TableComponent";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const feedback = () => {
  const [feedbackItems, setFeedbackItems] = useState([]);

  //show all data
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/admin/get-feedback", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFeedbackItems(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filteredItems = (feedbackItems || []).map((item, index) => ({
    Id: index + 1,
    Name: item.name,
    Email: item.email,
    Message: item.message,
    Subject: item.subject,
    id: item._id,
    isActive: item.isActive,
    editPath: false,
  }));

  return (
    <div className="sm:px-4 md:px-6 py-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <TableComponent
        title="Feedback"
        columns={["Id", "Name", "Email", "Subject", "Message"]}
        data={filteredItems}
        showAddButton={false}
        showActionColumn={false}
        showActiveColumn={false}
      />
    </div>
  );
};

export default feedback;
