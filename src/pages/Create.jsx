// src/pages/Create.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Create() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    thai_name: "",
    binomial: "",
    pattern: "",
    color: "",
    danger_level: "",
    description: "",
    diet: "",
    habitat: "",
    imageUrl: "",
    is_venomous: false,
    poisonous: "",
    size: "",
    venom_effects: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      color: formData.color.split(",").map((s) => s.trim()),
      diet: formData.diet.split(",").map((s) => s.trim()),
      habitat: formData.habitat.split(",").map((s) => s.trim()),
    };

    try {
      await axios.post("https://backendsnake.onrender.com/snakes", payload);
      alert("✅ เพิ่มข้อมูลงูเรียบร้อยแล้ว!");
      navigate("/");
    } catch (err) {
      console.error("❌ Error creating snake:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow mt-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        ➕ เพิ่มข้อมูลงู
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "ชื่อภาษาไทย", name: "thai_name" },
          { label: "ชื่อวิทยาศาสตร์", name: "binomial" },
          { label: "ลวดลาย", name: "pattern" },
          { label: "สี (คั่นด้วย ,)", name: "color" },
          { label: "ระดับอันตราย", name: "danger_level" },
          { label: "คำอธิบาย", name: "description", textarea: true },
          { label: "อาหาร (คั่นด้วย ,)", name: "diet" },
          { label: "ถิ่นที่อยู่ (คั่นด้วย ,)", name: "habitat" },
          { label: "URL รูปภาพ", name: "imageUrl" },
          { label: "ความยาวลำตัว", name: "size" },
          { label: "ผลของพิษ", name: "venom_effects", textarea: true },
        ].map(({ label, name, textarea }) => (
          <div key={name}>
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
              {label}
            </label>
            {textarea ? (
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            งูมีพิษหรือไม่
          </label>
          <input
            type="checkbox"
            name="is_venomous"
            checked={formData.is_venomous}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-700 dark:text-gray-200">มีพิษ</span>
        </div>

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            ค่าพิษ (ตัวเลข)
          </label>
          <input
            type="text"
            name="poisonous"
            value={formData.poisonous}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          ✅ บันทึกข้อมูลงู
        </button>
      </form>
    </div>
  );
}
