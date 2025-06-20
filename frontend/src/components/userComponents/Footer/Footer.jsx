import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-center pt-6">
      <div className=" py-3 border-t border-gray-700 text-sm">
        <ul className="flex flex-wrap justify-center gap-4">
          <li>
            <Link to="/feedback" className="">
              Feedback
            </Link>
          </li>
          <li>
            <Link to="/website-policies" className="">
              Website Policies
            </Link>
          </li>
          <li>
            <Link to="/contact-us" className="">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/help" className="">
              Help
            </Link>
          </li>
          
        </ul>
      </div>

      <div className="px-4 py-6 text-sm">
        <p className="mb-1">
          <Link
            to="/"
            className="text-blue-400 "
            target="_blank"
            rel="noreferrer"
          >
            Digital E-Gram Panchayat
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
