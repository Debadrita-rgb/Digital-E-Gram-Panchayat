import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowService = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/user/one-service/${serviceId}`
        );
        setService(res.data.service);
        setCategoryName(res.data.categoryName);
      } catch (error) {
        console.error("Error loading service", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleBooking = async (serviceId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    try {
      const user = jwtDecode(token);
      const res = await axios.get(
        `http://localhost:5000/user/checking-login/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { name, email, address, document } = res.data;

      if (!email || !address || !document) {
        toast.info("Please complete your profile first.");
        navigate("/view-profile");
        return;
      }
      navigate(`/apply-service/${serviceId}`, {
        state: {
          userId: user.id,
          name,
          email,
        },
      });
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!service)
    return <div className="text-center py-10">Service not found.</div>;

  return (
    <div className="mx-auto px-4 py-5 lg:mt-20">
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      {/* Banner */}
      <div
        className="relative w-full h-72 rounded-xl overflow-hidden shadow-md mb-10"
        style={{
          backgroundImage: `url(${service.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-7xl mx-auto px-4 py-12 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {service.name}
          </h2>
          <p className="text-blue-600 mt-2 font-medium">{categoryName}</p>
        </div>
        <div
          className="text-gray-700 dark:text-gray-300 text-base"
          dangerouslySetInnerHTML={{ __html: service.description }}
        ></div>

        <div className="mx-auto mt-6 px-4 flex justify-start">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBooking(service._id);
            }}
            className="text-blue-600 hover:none font-semibold cursor-pointer"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowService;
