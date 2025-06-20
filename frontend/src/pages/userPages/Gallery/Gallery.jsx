import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Gallery.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [galleryName, setGalleryName] = useState("");

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/index-gallery");
        setGalleries(res.data || []);
      } catch (err) {
        console.error("Failed to fetch index gallery", err);
      }
    };

    fetchGalleries();
  }, []);

  const handleOpenModal = async (id, name) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/user/one-gallery/${id}`
      );
      setCurrentImages(res.data.galleryItems || []);
      setGalleryName(name);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching gallery items", err);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="mx-auto px-4 py-5 lg:mt-20">
      {/* Banner */}
      <div
        className="relative w-full h-64 rounded-xl overflow-hidden mb-10 shadow-md"
        style={{
          backgroundImage: `url("https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2025/02/20250206984405454.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-transparent bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold text-center">
            Photo Gallery
          </h1>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 py-12 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        {galleries.map((item, index) => (
          <div
            key={index}
            onClick={() => handleOpenModal(item._id, item.name)}
            className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={item.image || "https://via.placeholder.com/400x300"}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center">
                {item.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 z-50 flex justify-center items-center px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-6xl w-full p-6 relative shadow-lg">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-3 text-2xl text-black dark:text-gray-100"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center text-black dark:text-gray-100">
              {galleryName}
            </h2>
            <Slider {...settings}>
              {currentImages.map((img, idx) => (
                <div key={idx}>
                  <img
                    src={img.imageUrl}
                    alt={`Gallery item ${idx + 1}`}
                    className="w-full max-h-[600px] object-contain rounded-xl"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
