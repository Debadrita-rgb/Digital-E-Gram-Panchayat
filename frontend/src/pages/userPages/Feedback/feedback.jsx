import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feedback = () => {
  const [captchaText, setCaptchaText] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let newCaptcha = "";
    for (let i = 0; i < 6; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(newCaptcha);
    drawCaptcha(newCaptcha);
  };

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#f3f3f3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add distortion and noise
    for (let i = 0; i < text.length; i++) {
      const fontSize = 28 + Math.floor(Math.random() * 4);
      const x = 10 + i * 20;
      const y = 30 + Math.random() * 8;
      const angle = (Math.random() - 0.5) * 0.5;

      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "#000";
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    // Add lines for extra distortion
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userCaptchaInput.trim().toLowerCase() !== captchaText.toLowerCase()) {
      toast.error("Invalid CAPTCHA. Please try again.");
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/user/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setUserCaptchaInput("");
        generateCaptcha();    
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="mx-auto px-4 py-5 lg:mt-20 text-gray-800 dark:text-gray-200">
      <div
        className="relative w-full h-56 rounded-lg overflow-hidden mb-8"
        style={{
          backgroundImage: `url("https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2025/02/202502061433080426.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-opacity-60 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">Feedback</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 backdrop-blur-md bg-white/80 dark:bg-white/10 border border-white/30 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-transparent bg-clip-text">
          Feedback
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          {["name", "email", "subject", "message"].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {field}
              </label>
              {field !== "message" ? (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  placeholder={`Your ${field}`}
                  className="w-full p-2 rounded-lg bg-gray-100 dark:bg-white/20"
                />
              ) : (
                <textarea
                  name={field}
                  rows={4}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  placeholder="Type your message..."
                  className="w-full p-2 rounded-lg bg-gray-100 dark:bg-white/20"
                />
              )}
            </div>
          ))}

          {/* CAPTCHA */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Enter CAPTCHA
            </label>
            <canvas
              ref={canvasRef}
              width="150"
              height="50"
              className="border rounded bg-gray-100 dark:bg-white/10 mb-2"
            />
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-sm text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>
            <input
              type="text"
              value={userCaptchaInput}
              onChange={(e) => setUserCaptchaInput(e.target.value)}
              required
              placeholder="Type CAPTCHA here"
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-white/20"
            />
          </div>

          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-xl"
          >
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Feedback;
