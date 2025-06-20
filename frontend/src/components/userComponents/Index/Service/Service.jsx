import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Service = () => {
  const [services, setServices] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch("http://localhost:5000/user/get-limited-service")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
      })
      .catch((err) => {
        console.error("Failed to fetch categories", err);
      });
  }, []);
  return (
    <div>
      <section className="bg-white dark:bg-gray-800 py-12 px-1">
        <h2 className="text-3xl font-bold text-center mb-10">
          {t("AvailableServices")}
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div
            key={index}
            className="bg-blue-100 dark:bg-gray-700 p-6 rounded-xl shadow-md text-center hover:scale-105 transition"
          >
            <Link to={`/view-service/${service._id}`}>
              
              <h5 className="text-xl font-medium">
                {service.name}
              </h5></Link>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-6 px-4 flex justify-end">
          <Link
            to="/all-services"
            className="text-blue-600 hover:none font-semibold"
          >
            {t("ViewAll")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Service;
