import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSwitch from "../components/themeToggle.jsx"; // <-- เพิ่มตรงนี้

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({show: false, message: "", isError: false});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://backendsnake.onrender.com/login",
        { email: username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      localStorage.setItem("token", res.data.access_token);
  
      // ✅ แสดง popup ก่อน แล้วค่อย navigate
      setPopup({ show: true, message: "เข้าสู่ระบบสำเร็จ", isError: false });
  
      setTimeout(() => {
        setPopup({ show: false, message: "", isError: false });
        navigate("/"); // <-- ไปหน้า home หลัง popup
      }, 1500); // แสดง popup 1.5 วินาที
    } catch (err) {
      console.error("Login error:", err);
      setPopup({ show: true, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", isError: true });
  
      setTimeout(() => {
        setPopup({ show: false, message: "", isError: false });
      }, 3000); // แสดง popup error นานกว่าเล็กน้อย
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 relative">
      <ThemeSwitch /> {/* ✅ ใช้ component ที่แยกออกมา */}

      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700 dark:text-gray-100">Login</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              onClick={handleLogin}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>

          <div className="text-right mt-1">
            <a href="/forgot-password" className="text-sm text-blue-500 dark:text-blue-400 hover:underline">
              ลืมรหัสผ่าน?
            </a>
          </div>
        </div>
      </div>
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
