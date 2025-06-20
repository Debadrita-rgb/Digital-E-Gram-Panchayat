import React, {useState} from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/user/submit-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    }
  };

  return (
    <div className="mx-auto px-4 py-5 lg:mt-20 text-gray-800 dark:text-gray-200">
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
          <h1 className="text-3xl font-bold text-white dark:text-white">
            Contact Us
          </h1>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 backdrop-blur-md bg-white/80 dark:bg-white/10 border border-white/30 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        {/* Contact Info */}
        <div className="space-y-4 text-gray-900 dark:text-white">
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-transparent bg-clip-text mb-4">
            Let's Get In Touch
          </h3>
          <p className="text-lg text-gray-700 dark:text-white/90">
            Whether you're ready to book or just have a question, our crew is
            always here for you.
          </p>
          <div>
            <h3 className="font-semibold text-cyan-600 dark:text-cyan-400">
              Headquarters
            </h3>
            <p>123, New York City</p>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-600 dark:text-cyan-400 mt-4">
              Phone
            </h3>
            <p>Support: +91 (800) 555-CELE</p>
            <p>Office: +91 (800) 555-1234</p>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-600 dark:text-cyan-400 mt-4">
              Email
            </h3>
            <p>support@grampanchayat.com</p>
            <p>info@grampanchayat.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-600 dark:text-cyan-400 mt-4">
              Socials
            </h3>
            <p>Instagram: @grampanchayat</p>
            <p>Twitter: @grampanchayat</p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-teal-500 to-cyan-400 text-transparent bg-clip-text dark:from-teal-300 dark:to-cyan-200">
            Send a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                required
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-white/20 placeholder-gray-500 dark:placeholder-white/70 text-black dark:text-white focus:outline-none"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-white/20 placeholder-gray-500 dark:placeholder-white/70 text-black dark:text-white focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-white/20 placeholder-gray-500 dark:placeholder-white/70 text-black dark:text-white focus:outline-none"
                placeholder="Type your message..."
              />
            </div>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default contactUs
