import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Banner = () => {
    const [slides, setSliderItems] = useState([]);
  
  useEffect(() => {  
      fetch("http://localhost:5000/user/get-slider", {
      })
        .then((res) => res.json())
        .then((data) => {
          setSliderItems(data);
        })
        .catch((err) => console.error("Fetch error:", err));
    }, []);
    
  return (
    <div className="h-[50vh] w-full mt-5">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000 }}
        loop={slides.length > 1}
        pagination={{ clickable: true }}
        navigation={true}
        className="h-96"
      >
        {slides.length === 0 ? (
          <div className="text-center py-10">No slides available</div>
        ) : (
          slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className="h-full w-full bg-cover bg-center flex items-center justify-center text-center mt-18"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              ></div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );
}

export default Banner

      