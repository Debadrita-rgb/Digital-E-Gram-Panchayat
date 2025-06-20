import React from 'react'
import Banner  from "../../../components/userComponents/Index/Banner/Banner";
import About from "../../../components/userComponents/Index/About/About";
import Service from "../../../components/userComponents/Index/Service/Service";
import Gallery from "../../../components/userComponents/Index/Gallery/Gallery";
import LogoCarousel from "../../../components/userComponents/Index/logoCarousel/logoCarousel";

const Index = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white mt-3">
      <Banner />
      <About />
      <Service />
      <Gallery />
      <LogoCarousel />
    </div>
  );
}

export default Index
