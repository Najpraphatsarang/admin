import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const res = await axios.post("https://backendsnake.onrender.com/reset-password", {
        token,
         new_password: newPassword
      });

      setMessage("รีเซ็ตรหัสผ่านสำเร็จ! กำลังกลับไปหน้า Login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("ลิงก์ไม่ถูกต้องหรือหมดอายุ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">รีเซ็ตรหัสผ่าน</h2>

        <input
          type="password"
          placeholder="รหัสผ่านใหม่"
          className="mb-3 w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="ยืนยันรหัสผ่านใหม่"
          className="mb-3 w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          รีเซ็ตรหัสผ่าน
        </button>

        {message && (
          <p className="text-sm mt-3 text-center text-red-500 dark:text-red-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
