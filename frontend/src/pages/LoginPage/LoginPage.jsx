import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import logo from "../../assets/logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    console.log(password);
    try {
      const response = await fetch("http://localhost:5000/common/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      toast.success("🎉 Login successful!", {
        autoClose: 3000,
        pauseOnFocusLoss: false,
      });

      const userRole = data.role?.toLowerCase();
      login(data.token, userRole);

      setTimeout(() => {
        if (userRole === "admin") navigate("/admin/dashboard");
        else if (userRole === "staff") navigate("/staff/dashboard");
        else if (userRole === "officer") navigate("/officer/dashboard");
        else if (userRole === "supervisor") navigate("/supervisor/dashboard");
        // else navigate("/");
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      setErrors({ server: errorMessage });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div class="bg-sky-100 flex justify-center items-center h-screen">
      {/* <!-- Left: Image --> */}
      <div class="w-1/2 h-screen hidden lg:block">
        <img
          src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826"
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>
      {/* <!-- Right: Login Form --> */}
      <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Company Logo" className="w-40 rounded-full" />
        </div>

        <h1 class="text-2xl font-semibold mb-4 text-black text-center">
          {" "}
          Login{" "}
        </h1>

        <form onSubmit={handleSubmit} method="POST">
          {/* <!-- Username Input --> */}
          <div class="mb-4 bg-sky-100">
            <label for="username" class="block text-gray-600">
              Username
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              required
            />
          </div>
          {/* <!-- Password Input --> */}
          <div class="mb-4">
            <label for="password" class="block text-gray-800">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 text-black"
                autoComplete="off"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          {/* <!-- Forgot Password Link --> */}
          <div class="mb-6 text-blue-500">
            {/* <a href="#" class="hover:underline">
              Forgot Password?
            </a> */}
          </div>
          {/* <!-- Login Button --> */}
          <button
            type="submit"
            class="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full cursor-pointer"
          >
            Login
          </button>
        </form>
        {/* <!-- Sign up  Link --> */}
        <div class="mt-6 text-green-500 text-center">
          {/* <a href="#" class="hover:underline">
            Sign up Here
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
