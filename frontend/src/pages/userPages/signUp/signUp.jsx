import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [step, setStep] = useState("form");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer] = useState(59);
  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // Validate password strength
  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!regex.test(pwd)) {
      return "Password must be 8+ chars with upper, lower, number & symbol";
    }
    return "";
  };

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setStep("form");
      setTimer(59);
      toast.error("OTP expired! Please try again.");
    }
  }, [step, timer]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const pwdError = validatePassword(password);
    const confirmPwdError =
      password !== confirmPassword ? "Passwords do not match" : "";

    setPasswordError(pwdError);
    setConfirmError(confirmPwdError);

    if (phone.length !== 10) return toast.error("Phone must be 10 digits");
    if (pwdError || confirmPwdError) return;

    try {
      const res = await axios.post("http://localhost:5000/user/send-otp", {
        phone,
        password,
        name,
        
      });
      setGeneratedOtp(res.data.otp);
      setStep("otp");
      setTimer(59);
      toast.info("OTP sent to your number.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/user/verify-otp", {
        phone,
        otp,
        name,
        
      });
      toast.success("Registration successful!");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      setOtp("");
      setStep("form");

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      toast.error("Invalid OTP or registration failed");
    }
  };

  return (
    <div className="mx-auto px-4 py-5 lg:mt-20">
       <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold">
            {step === "form" ? "Sign Up to your account" : "Verify OTP"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {step === "form" ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, ""); // remove non-digits
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(validatePassword(e.target.value));
                  }}
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
                {passwordError && (
                  <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmError(
                      e.target.value !== password
                        ? "Passwords do not match"
                        : ""
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
                Generate OTP
              </button>
              <p className="mt-10 text-center text-sm/6 text-gray-500">
                If you are a member?{" "}
                <Link
                  to="/signin"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtpVerify} className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-gray-700">
                  Your OTP: <strong>{generatedOtp}</strong>
                </p>
                <p className="text-sm text-red-600">Expires in: {timer}s</p>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
                required
                className="w-full px-4 py-2 border rounded"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded cursor-pointer"
              >
                Verify OTP & Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
