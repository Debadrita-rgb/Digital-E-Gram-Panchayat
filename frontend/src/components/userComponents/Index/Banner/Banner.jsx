import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Banner = () => {
    const slides = [
      {
        title: "Empowering Villages Digitally",
        subtitle: "Digital E-Gram Panchayat Platform",
        image:
          "https://lsgkerala.gov.in/system/files/inline-images/global-expo-conclave-2023.png",
      },
      {
        title: "Apply for Services Online",
        subtitle: "Easy access to government schemes",
        image:
          "https://secure.mygov.in/sites/all/themes/mygov/images/panchayatiraj2022/panchayati-raj-banner.jpg",
      },
      {
        title: "Track Your Applications",
        subtitle: "Transparent status updates",
        image:
          "https://www.studyiq.com/articles/wp-content/uploads/2025/04/23184249/1200-x-628-70.jpg",
      },
      {
        title: "Track Your Applications",
        subtitle: "Transparent status updates",
        image:
          "https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2023/07/2023072143.jpg",
      },
      {
        title: "Track Your Applications",
        subtitle: "Transparent status updates",
        image:
          "https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/12/2024123094124572.jpeg",
      },
    ];
    
  return (
    <div className="h-[50vh] w-full mt-5">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000 }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        className="h-96"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="h-full w-full bg-cover bg-center flex items-center justify-center text-center mt-18"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Banner

      