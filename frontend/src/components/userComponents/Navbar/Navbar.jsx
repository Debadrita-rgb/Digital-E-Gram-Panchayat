import React, { useRef ,useState, useEffect } from "react";
import { FaBell, FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import logo  from "../../../assets/logo.png";

const languages = [
  // { value: "", text: "Options" },0f5757
  { value: "en", text: "English" },
  { value: "hi", text: "हिन्दी" },
  // { value: "bn", text: "Bengali" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userName, setUserName] = useState("Guest");
  const { token, isAuthenticated, role, logout, userId } = useAuth();
  const userName = localStorage.getItem("userName") || "Guest";
  const profilePhoto = localStorage.getItem("profilePhoto") || "";
  const navigate = useNavigate();
  // const [profilePhoto, setprofilePhoto] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
    // localStorage.theme = "light";
    // localStorage.theme = "dark";
    // localStorage.removeItem("theme");
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    fetch("http://localhost:5000/user/get-maincategory")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error("Failed to fetch categories", err);
      });
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const storedName = localStorage.getItem("userName");

    if (token && storedName) {
      setIsLoggedIn(true);
      // setUserName(storedName);
    } else {
      setIsLoggedIn(false);
      // setUserName("Guest");
    }
    if (localStorage.getItem("loginSuccess") === "true") {
      localStorage.removeItem("loginSuccess");
    }
  }, []);

  const handleLogout = () => {
    logout();
    // setprofilePhoto(null);
    setIsLoggedIn(false);
    localStorage.removeItem("profilePhoto");
    toast.success("🎉 Logged out successfully!", {
      autoClose: 3000,
      pauseOnFocusLoss: false,
    });
    setTimeout(() => {
      navigate("/signin");
    }, 2000);
  };

  // const handleLinkClick = () => {
  //   if (window.innerWidth < 640 && disclosureButtonRef.current) {
  //     disclosureButtonRef.current.click();
  //   }
  // };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const userId = localStorage.getItem("userId");

  //   const localPhoto = localStorage.getItem("profilePhoto");
  //   if (localPhoto) {
  //     setprofilePhoto(localPhoto);
  //   }

  //   if (userId && token && !localPhoto) {
  //     const fetchUserProfile = async () => {
  //       try {
  //         const res = await axios.get(
  //           `http://localhost:5000/user/get-navbar-profileimage/${userId}`,
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );
  //         const fetchedPhoto = res.data.profilePhoto || "";
  //         setprofilePhoto(fetchedPhoto);
  //         localStorage.setItem("profilePhoto", fetchedPhoto);
  //       } catch (err) {
  //         console.error("Error fetching user profile:", err);
  //       }
  //     };

  //     fetchUserProfile();
  //   }
  // }, []);
  

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const res = await axios.get(`http://localhost:5000/user/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.data;
      setNotifications(data);

      const hasUnread = data.some((n) => !n.isRead);
      setHasNewNotification(hasUnread);
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = async () => {
    setIsNotificationOpen(!isNotificationOpen);

    if (hasNewNotification) {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.post(
        `http://localhost:5000/user/notifications/mark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHasNewNotification(false);
    }
  };
  const dropdownRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("#notification-bell")
      ) {
        setIsNotificationOpen(false);
      }
    }
    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  function formatNotificationDate(dateString) {
    const noteDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const noteDay = new Date(
      noteDate.getFullYear(),
      noteDate.getMonth(),
      noteDate.getDate()
    );
    const todayDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayDay = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (noteDay.getTime() === todayDay.getTime()) {
      return "Today";
    } else if (noteDay.getTime() === yesterdayDay.getTime()) {
      return "Yesterday";
    } else {
      return noteDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return (
    <nav className={`w-full bg-white dark:bg-gray-900 shadow-md lg:fixed z-50`}>
      <div className="max-w-7xl mx-auto px-4 py-7 flex items-center justify-between">
        {/* Left - Logo & Links */}
        <div className="flex items-center gap-6 ">
          <h1 className="font-bold text-xl text-blue-600">
            <Link to="/">
              <img
                src={logo}
                className="h-10 w-auto rounded-4xl"
                alt="Digital E-Gram Panchayat"
              />
            </Link>
          </h1>
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="hover:text-blue-600">
              {t("Home")}
            </Link>
            <Link to="/about-us" className="hover:text-blue-600">
              {t("AboutUs")}
            </Link>
            <Link to="/all-gallery" className=" hover:text-blue-600">
              {t("PhotoGallery")}
            </Link>

            {/* Dropdown for Service Category */}
            <div className="relative group">
              <button className="flex items-center hover:text-blue-600">
                {t("Service Category")} <MdArrowDropDown size={20} />
              </button>
              <div className="absolute left-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/categorized-services/${cat._id}`}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t(cat.name)}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/contact-us" className="hover:text-blue-600">
              {t("Contact Us")}
            </Link>
          </div>
        </div>

        {/* Right - Icons & User */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="relative">
            <button
              type="button"
              id="notification-bell"
              className={`relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none ${
                hasNewNotification ? "ring-horizontal" : ""
              }`}
              onClick={handleBellClick}
            >
              <span className="sr-only">View notifications</span>
              <span
                className={`absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                  unreadCount > 0
                    ? "bg-red-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {unreadCount}
              </span>
              <FaBell className="text-xl cursor-pointer hover:text-blue-600" />
            </button>

            {/* Dropdown */}
            {isNotificationOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 rounded-md shadow-xl border dark:border-gray-700 z-50"
              >
                <div className="p-4 border-b dark:border-gray-600 font-semibold text-gray-800 dark:text-white">
                  Notifications
                </div>
                <ul>
                  {notifications.length === 0 ? (
                    <li className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      No notifications (0)
                    </li>
                  ) : (
                    notifications.map((note, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          if (
                            note.status === "Accepted" ||
                            note.status === "Rejected"
                          ) {
                            navigate(
                              `/application-status?status=${note.status}`
                            );
                            setIsNotificationOpen(false);
                          }
                        }}
                        className="px-4 py-3 border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <p className="text-sm text-gray-800 dark:text-white">
                          {note.message}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatNotificationDate(note.createdAt)}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Language Selector */}
          {/* <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="bg-transparent text-sm border-none outline-none dark:text-white"
          >
            {languages.map((lan) => (
              <option key={lan.value} value={lan.value}>
                {lan.text}
              </option>
            ))}
          </select> */}

          {/* Theme Toggle */}
          <button onClick={() => setIsDark(!isDark)}>
            {isDark ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-gray-600" />
            )}
          </button>

          {/* User Dropdown  */}
          <div className="relative group">
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src={
                  profilePhoto
                    ? profilePhoto.startsWith("http")
                      ? profilePhoto
                      : `http://localhost:5000/uploads/profile/${profilePhoto}`
                    : "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/9187/9187604.png";
                }}
                alt="User"
                className="rounded-full w-8 h-8"
              />

              {isAuthenticated && (
                <span className="text-sm text-gray-700 dark:text-white">
                  {userName}
                </span>
              )}
            </div>

            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/view-profile"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/application-status"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Application Status
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hamburger for Mobile */}
        <div className="lg:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mx-2 mt-2 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-2xl animate-slide-down px-4 py-6 space-y-4 transition-all duration-300 ease-in-out">
          <Link
            to="/"
            className="block font-medium text-gray-700 dark:text-white hover:text-blue-600"
          >
            {t("Home")}
          </Link>
          <Link
            to="/about-us"
            className="block font-medium text-gray-700 dark:text-white hover:text-blue-600"
          >
            {t("AboutUs")}
          </Link>
          <Link
            to="/all-gallery"
            className="block font-medium text-gray-700 dark:text-white hover:text-blue-600"
          >
            {t("PhotoGallery")}
          </Link>
          <div>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center justify-between w-full font-medium text-gray-800 dark:text-white mb-2"
            >
              {t("Service Category")}
              <MdArrowDropDown
                size={20}
                className={`transition-transform ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Submenu for categories */}
            {isCategoryOpen && (
              <div className="ml-4 space-y-1 transition-all duration-300">
                {categories.map((cat) => (
                  <Link
                    to={`/categorized-services/${cat._id}`}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t(cat.name)}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/contact"
            className="block font-medium text-gray-700 dark:text-white hover:text-blue-600"
          >
            {t("Contact Us")}
          </Link>

          <div className="flex items-center gap-4">
            <FaBell className="text-gray-700 dark:text-white" />
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-transparent text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 px-2 py-1 rounded"
            >
              <option value="en">{t("English")}</option>
              <option value="hi">{t("Hindi")}</option>
            </select>
            <button onClick={() => setIsDark(!isDark)}>
              {isDark ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-gray-600 dark:text-white" />
              )}
            </button>
          </div>

          <div>
            <Link
              to="/signin"
              className="block text-gray-700 dark:text-white hover:text-blue-600"
            >
              {t("Sign In")}
            </Link>
            <Link
              to="/signup"
              className="block text-gray-700 dark:text-white hover:text-blue-600"
            >
              {t("Sign Up")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar
