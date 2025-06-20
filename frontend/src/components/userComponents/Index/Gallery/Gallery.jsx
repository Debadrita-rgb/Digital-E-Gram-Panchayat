import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Gallery = () => {
  const { t, i18n } = useTranslation();
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            {t("PhotoGallery")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleries.map((item, index) => (
              <div
                key={index}
                onClick={() => handleOpenModal(item._id, item.name)}
                className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <img
                  key={index}
                  src={item.image || "https://via.placeholder.com/400x300"}
                  alt={item.name}
                  className="rounded-xl shadow-md hover:scale-105 transition duration-300 w-full h-30 object-cover"
                />
              </div>
            ))}
          </div>
          <div className="max-w-7xl mx-auto mt-6 px-4 flex justify-end ">
            <Link
              to="/all-gallery"
              className="text-blue-600 hover:none font-semibold"
            >
              {t("ViewAll")}
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            {t("VideoGallery")}
          </h2>
          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/Hl5cO19bjvM?si=biZ_skuKc3CU8ko5"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-96"
            ></iframe>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 z-50 flex justify-center items-center px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-6xl w-full p-6 relative shadow-lg">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-3 text-black text-2xl dark:text-gray-100"
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
