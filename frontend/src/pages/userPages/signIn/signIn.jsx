import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const SignIn = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/user/login", {
        phone,
        password,
      });
      if (response.data.success) {
        const role = "User";
        const userRole = role.toLowerCase();
        const userId = response.data.userId;
        try {
          login(response.data.token, userRole, userId);

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userName", response.data.name);
          localStorage.setItem("role", userRole);
          localStorage.setItem("userId", userId);
          localStorage.setItem("profilePhoto", response.data.profilePhoto || "");
          // console.log("localStorage", localStorage);
        } catch (loginError) {
          console.error("Login function error:", loginError);
        }

        
        setTimeout(() => {toast.success("Login Successful!");
          navigate("/view-profile");
        }, 2000);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      console.error("Error during login:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mx-auto px-4 py-5 lg:mt-20">
       {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold">
            Sign In to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                if (onlyDigits.length <= 10) setPhone(onlyDigits);
              }}
              placeholder="Phone Number"
              required
              className="w-full px-4 py-2 border rounded"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded pr-10"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmError(
                    e.target.value !== password ? "Passwords do not match" : ""
                  );
                }}
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-2 border rounded pr-10"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
              {confirmError && (
                <p className="text-red-600 text-sm mt-1">{confirmError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer"
            >
              Submit
            </button>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
