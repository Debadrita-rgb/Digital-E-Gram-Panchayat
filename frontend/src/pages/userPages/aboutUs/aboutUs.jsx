import React from "react";
import LogoCarousel from "../../../components/userComponents/Index/logoCarousel/logoCarousel";

const aboutUs = () => {
  return (
    <div className="mx-auto px-4 py-5 lg:mt-20 text-gray-800 dark:text-gray-200 ">
      {/* Banner */}
      <div
        className="relative w-full h-56 rounded-lg overflow-hidden mb-12"
        style={{
          backgroundImage: `url("https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2025/02/202502061433080426.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-opacity-60 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">About Us</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        {/* About Us Content */}
        <div className="max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-16 ">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
            <p className="mb-4">
              Digital E-Gram Panchayat is an innovative platform designed to
              bring governance and citizen services directly to the community’s
              doorstep. Our aim is to enable smooth, transparent, and
              citizen-centric delivery of services through digital
              transformation. The platform allows individuals to apply for
              various services, track their application status, and access
              important information, all from the comfort of their homes.
              Digital E-Gram Panchayat strives to empower the panchayat, its
              officials, and its community by fostering greater participation,
              collaboration, and fairness in decision-making.
            </p>
          </div>
          <div>
            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20230222104738/file.png"
              alt="About us"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* What's New Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <img
              src="https://images.bhaskarassets.com/web2images/521/2022/05/21/ca35506c-0f2a-4d02-a104-87036b1100a4_1653125884.jpg"
              alt="What's New"
              className="rounded-lg shadow-md"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">What's New</h2>
            <p>
              We are constantly improving Digital E-Gram Panchayat to bring you
              a more convenient and citizen-centric platform. Here’s a look at
              what’s new and updated in our community services:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>
                <strong>Online Application Tracking — </strong>Now you can track
                your application’s progress in real-time.{" "}
                <a
                  href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  View Application Status.
                </a>
              </li>
              <li>
                <strong>Enhanced Citizen Dashboard — </strong>Our revamped
                dashboard lets you see all your requests, certificates,
                payments, and messages in a single place.{" "}
                <a
                  href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Access Dashboard.
                </a>
              </li>
              <li>
                <strong>Digital Certificates and Approvals — </strong>Get your
                documents, certificates, and approval letters directly in PDF
                format.{" "}
                <a
                  href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Download Your Certificate (PDF).
                </a>
              </li>
              <li>
                <strong>SMS and Email Notifications — </strong>Stay updated with
                automated alerts when your application moves forward in the
                process.{" "}
                <a
                  href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Subscribe to notifications.
                </a>
              </li>
              <li>
                <strong></strong>Scheme Information Hub — Find exhaustive
                details about ongoing schemes, subsidies, financial aid, health
                programs, education initiatives, and much more.{" "}
                <a
                  href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  View All Schemes.
                </a>
              </li>
              <li>
                <strong>Public Grievance Redressal — </strong>Raise complaints
                or share your suggestions directly with panchayat officials and
                track their resolution.{" "}
                <a
                  href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  File Grievance.
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our Mission & Vision</h2>
          <p className="mb-3">
            <strong>Mission:</strong> To make panchayat services more
            accessible, efficient, and trustworthy for all community members. We
            aim to reduce bottlenecks, eliminate redundancy, and enable a
            paperless process that saves time and resources. Our platform is
            designed to promote civic engagement, foster greater understanding
            of government programs, and enable citizen empowerment through
            technology.
          </p>
          <p>
            <strong>Vision:</strong> We see Digital E-Gram Panchayat as a key
            tool in strengthening grassroots democracy. Our ultimate objective
            is to create a community where every citizen feels valued, heard,
            and supported by their local administration — a community that
            collectively drives its own progress toward a sustainable and
            equitable future.
          </p>
        </div>

        {/* Pratners Section */}
        <LogoCarousel />
      </div>
      {/* Contact / Join Us */}
      <div className="bg-blue-50 dark:bg-blue-900 p-8 rounded-lg text-center mt-4">
        <h2 className="text-2xl font-semibold mb-3">Want to work with us?</h2>
        <p className="mb-4">
          We are always looking for passionate and skilled people to join our
          mission.
        </p>
        <a
          href="/contact-us"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default aboutUs;
