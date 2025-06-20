import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";

const logoCarousel = () => {
  const { t, i18n } = useTranslation();
  const [partner, setPartner] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/user/get-all-partner", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPartner(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-5 px-4 text-center">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8 relative inline-block mx-auto">
        <span className="relative z-10">{t("OurPartners")}</span>
      </h2>

      {/* Swiper container */}
      <div className="rounded-xl shadow-xl bg-gradient-to-r from-white via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={4}
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {partner.map((logo, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition duration-300 transform hover:scale-105">
                <img
                  src={logo.image}
                  alt={`Logo ${idx + 1}`}
                  className="mx-auto h-20 object-contain transition duration-300" // ✅ removed grayscale
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default logoCarousel;
