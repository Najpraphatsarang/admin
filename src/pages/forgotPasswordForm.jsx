import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "", isError: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://backendsnake.onrender.com/forgot-password", { email });
      setPopup({ show: true, message: "ส่งอีเมลรีเซ็ตรหัสผ่านเรียบร้อยแล้ว", isError: false });
    } catch (err) {
      setPopup({ show: true, message: "ไม่พบอีเมลนี้ในระบบ", isError: true });
    }

    // ซ่อน popup หลัง 3 วินาที
    setTimeout(() => {
      setPopup({ show: false, message: "", isError: false });
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 relative px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          ลืมรหัสผ่าน
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="กรอกอีเมลของคุณ"
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          ส่งลิงก์รีเซ็ตรหัสผ่าน
        </button>
      </form>

      {/* ✅ Popup Notification */}
      <AnimatePresence>
        {popup.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`absolute top-5 px-6 py-3 rounded shadow-md text-white text-sm ${
              popup.isError ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
