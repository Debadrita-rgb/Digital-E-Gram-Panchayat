import React,{ useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AllServices = () => {
    const [services, setServices] = useState([]);
    
      useEffect(() => {
        fetch("http://localhost:5000/user/get-total-service")
          .then((res) => res.json())
          .then((data) => {
            setServices(data);
          })
          .catch((err) => {
            console.error("Failed to fetch categories", err);
          });
      }, []);
  return (
    <div className="mx-auto px-4 py-5 lg:mt-20 text-gray-800 dark:text-gray-200">
      {/* Banner */}
      <div
        className="relative w-full h-56 rounded-lg overflow-hidden mb-8"
        style={{
          backgroundImage: `url("https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2025/02/202502061433080426.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-opacity-60 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">All Services</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 md:p-10 space-y-8 text-justify px-4 py-12 grid md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-7xl mx-auto shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-blue-100 dark:bg-gray-700 p-6 rounded-xl shadow-md text-center hover:scale-105 transition"
          >
            <Link to={`/view-service/${service._id}`}>
              <h5 className="text-xl font-medium">{service.name}</h5>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllServices;
