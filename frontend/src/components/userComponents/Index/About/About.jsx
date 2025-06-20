import React from 'react'
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const About = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* About Us Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            {t("AboutUs")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t("AboutText")}
          </p>
          <Link
            to="/about-us"
            className="inline-block mt-2 text-blue-600 hover:none font-semibold"
          >
            {t("ViewAll")}
          </Link>
        </div>

        {/* What's New Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            {t("WhatsNew")}
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>{t("Update1")}</li>
            <li>{t("Update2")}</li>
            <li>{t("Update3")}</li>
            <li>{t("Update4")} </li>
          </ul>
          <Link
            to="/about-us"
            className="inline-block mt-4 text-blue-600 hover:none font-semibold"
          >
            {t("ViewAll")}
          </Link>
        </div>

        {/* Image Section */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src="https://wd-image.webdunia.com/image-conversion/process-aws.php?url=https://nonprod-media.webdunia.com/public_html/_media/mr/img/article/2023-04/24/full/1682331186-1654.jpg&w=&h=&outtype=webp"
            alt="Gram Panchayat"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default About
