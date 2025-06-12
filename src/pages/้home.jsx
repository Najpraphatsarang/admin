import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeSwitch from "../components/themeToggle.jsx";
import SnakeFormModal from "../components/SnakeFormModal.jsx";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [snakes, setSnakes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSnake, setSelectedSnake] = useState(null);
  const [scrollDirection, setScrollDirection] = useState("down");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [snakeToDelete, setSnakeToDelete] = useState(null);

  const token = localStorage.getItem("token");

  // Redirect to login if no token
  useEffect(() => {
    if (!token) navigate("/login");
  }, [navigate, token]);

  // Fetch snake data
  useEffect(() => {
    if (token) fetchSnakes();
  }, [token]);

  // Detect scroll direction
  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      setScrollDirection(window.scrollY > lastY ? "down" : "up");
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchSnakes = async () => {
    try {
      const res = await axios.get("https://backendsnake.onrender.com/snakes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnakes(res.data.snakes || []);
    } catch (error) {
      console.error("🔥 Error fetching snakes:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleEdit = (snake) => {
    setSelectedSnake(snake);
    setShowPopup(true);
  };

  const confirmDelete = (snake) => {
    setSnakeToDelete(snake);
    setShowConfirmPopup(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!snakeToDelete) return;
    try {
      await axios.delete(
        `https://backendsnake.onrender.com/snakes/binomial/${encodeURIComponent(snakeToDelete.binomial)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("ลบข้อมูลงูสำเร็จ!");
      fetchSnakes();
    } catch (error) {
      console.error("❌ Error deleting snake:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setShowConfirmPopup(false);
      setSnakeToDelete(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4 py-8">
      <ThemeSwitch />

      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
        🎉 ยินดีต้อนรับเข้าสู่หน้า Home
      </h1>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        คุณเข้าสู่ระบบเรียบร้อยแล้ว ✅
      </p>

      <div className="flex gap-4 mb-10 flex-wrap justify-center">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          ออกจากระบบ
        </button>
        <button
          onClick={() => {
            setSelectedSnake(null);
            setShowPopup(true);
          }}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          ➕ เพิ่มข้อมูลงู
        </button>
      </div>

      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar />

      {/* Modal for create/edit */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <SnakeFormModal
              initialValues={selectedSnake}
              onClose={() => {
                setShowPopup(false);
                setSelectedSnake(null);
              }}
              onSuccess={() => {
                fetchSnakes();
                setShowPopup(false);
                setSelectedSnake(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        🐍 ข้อมูลงูทั้งหมด
      </h2>

      {snakes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          ไม่พบข้อมูลงูในระบบ
        </p>
      ) : (
        <ul className="space-y-6 max-w-3xl w-full">
          {snakes.map((snake, index) => (
            <motion.li
              key={snake._id}
              initial={{ opacity: 0, y: scrollDirection === "down" ? -50 : 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
              className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow flex flex-col md:flex-row items-center gap-4"
            >
              <img
                src={snake.imageUrl || "/images/placeholder.jpg"}
                alt={snake.thai_name}
                className="w-full md:w-48 h-48 object-cover rounded-lg"
              />
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {snake.thai_name || "ไม่มีชื่อ"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">🧬 ชื่อสายพันธุ์: {snake.binomial || "-"}</p>
                <p className="text-gray-600 dark:text-gray-300">🌍 ถิ่นที่อยู่: {snake.habitat || "-"}</p>
                <p className="text-gray-600 dark:text-gray-300">☠️ อันตราย: {snake.is_venomous ? "✅ ใช่" : "❌ ไม่ใช่"}</p>
                <div className="flex mt-4 gap-2">
                  <button
                    onClick={() => handleEdit(snake)}
                    className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => confirmDelete(snake)}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showConfirmPopup && (
          <motion.div
            key="confirm-delete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลงูนี้?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {snakeToDelete?.thai_name} ({snakeToDelete?.binomial})
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  ลบ
                </button>
                <button
                  onClick={() => setShowConfirmPopup(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
