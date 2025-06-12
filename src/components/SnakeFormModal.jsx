import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ----------------- DynamicArrayInput ------------------
function DynamicArrayInput({ label, items, setItems }) {
  const handleChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleAdd = () => setItems([...items, ""]);

  const handleRemove = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-200 mb-1">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex mb-2 gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            className="flex-1 p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="px-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        ➕ เพิ่ม
      </button>
    </div>
  );
}

// ------------------ Main Modal ------------------
export default function SnakeFormModal({ onClose, onSuccess, initialValues }) {
  const modalRef = useRef(null);
  const safeArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return val ? val.split(",").map((s) => s.trim()) : [""];
  return [""];
};

  const [thaiName, setThaiName] = useState("");
  const [binomial, setBinomial] = useState("");
  const [habitat, setHabitat] = useState([""]);
  const [color, setColor] = useState([""]);
  const [diet, setDiet] = useState([""]);
  const [isVenomous, setIsVenomous] = useState(0);
  const [dangerLevel, setDangerLevel] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [size, setSize] = useState("");
  const [status, setstatus] = useState("");
  const [pattern, setPattern] = useState("");
  const [first_aid, setFirst_aid] = useState([""]);
  const [venomEffects, setVenomEffects] = useState("");
  const [isFetching, setIsFetching] = useState(!!initialValues?.binomial);

  useEffect(() => {
    if (!initialValues) {
      setIsFetching(false);
      return;
    }

    setThaiName(initialValues.thai_name || "");
    setBinomial(initialValues.binomial || "");
    setHabitat(safeArray(initialValues.habitat));
    setColor(safeArray(initialValues.color));
    setDiet(safeArray(initialValues.diet));
    setIsVenomous(initialValues.is_venomous ? 1 : 0);
    setDangerLevel(initialValues.danger_level || "");
    setDescription(initialValues.description || "");
    setImageUrl(initialValues.imageUrl || "");
    setSize(initialValues.size || "");
    setstatus(initialValues.status || "");
    setPattern(initialValues.pattern || "");
    setVenomEffects(initialValues.venom_effects || "");
setFirst_aid(safeArray(initialValues.first_aid));
    setIsFetching(false);
  }, [initialValues]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = initialValues
        ? `https://backendsnake.onrender.com/snakes/binomial/${initialValues.binomial}`
        : "https://backendsnake.onrender.com/addsnake";
      const method = initialValues ? "put" : "post";

      await axios[method](endpoint, {
        thai_name: thaiName,
        binomial,
        habitat,
        color,
        diet,
        is_venomous: isVenomous,
        danger_level: dangerLevel,
        description,
        imageUrl,
        size,
        pattern,
        venom_effects: venomEffects,
        status,
        first_aid,
      });

      onSuccess();
      toast.success("บันทึกข้อมูลสำเร็จ!");
      onClose();
    } catch (err) {
      console.error("Error submitting snake data:", err);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 py-8">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg p-6 w-full max-w-4xl max-h-full overflow-auto shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {initialValues ? "✏️ แก้ไขข้อมูลงู" : "🐍 เพิ่มข้อมูลงูใหม่"}
        </h2>

        {isFetching ? (
          <div className="text-center py-10">⏳ กำลังโหลดข้อมูล...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                ชื่อภาษาไทย:
                <input
                  type="text"
                  value={thaiName}
                  onChange={(e) => setThaiName(e.target.value)}
                  className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  required
                />
              </label>

              <label className="block">
                ชื่อสายพันธุ์ (binomial):
                <input
                  type="text"
                  value={binomial}
                  onChange={(e) => setBinomial(e.target.value)}
                  className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  required
                />
              </label>

              <label className="block">
                ระดับความอันตราย:
                <select
                  value={dangerLevel}
                  onChange={(e) => setDangerLevel(e.target.value)}
                  className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="">-- เลือกระดับความอันตราย --</option>
                  <option value="มาก">มาก</option>
                  <option value="ปานกลาง">ปานกลาง</option>
                  <option value="น้อย">น้อย</option>
                </select>
              </label>

              <label className="block">
                ลิงก์รูปภาพ:
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </label>

              <label className="block">
                ขนาด:
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </label>

              <label className="block">
                ลวดลาย:
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </label>

              <label className="block col-span-2">
                คำอธิบาย:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  rows={3}
                />
              </label>

              <label className="block col-span-2">
                ผลของพิษ:
                <input
                  type="text"
                  value={venomEffects}
                  onChange={(e) => setVenomEffects(e.target.value)}
                  className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </label>

              <label className="flex items-center gap-3 col-span-2">
                <input
                  type="checkbox"
                  checked={isVenomous === 1}
                  onChange={(e) => setIsVenomous(e.target.checked ? 1 : 0)}
                  className="h-4 w-4"
                />
                <span>{isVenomous ? "✅ มีพิษ" : "❌ ไม่มีพิษ"}</span>
              </label>
            </div>

            <DynamicArrayInput label="ถิ่นที่อยู่ (habitat):" items={habitat} setItems={setHabitat} />
            <DynamicArrayInput label="สี (color):" items={color} setItems={setColor} />
            <DynamicArrayInput label="อาหาร (diet):" items={diet} setItems={setDiet} />
            <DynamicArrayInput label="การปฐมพยาบาลเบื้องต้น (first_aid):" items={first_aid} setItems={setFirst_aid} />
            <label className="block">
                พร้อมจำแนก :
                <select
                  value={status}
                  onChange={(e) => setstatus(e.target.value)}
                  className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="">-- เลือกสถานะ --</option>
                  <option value="identified">พร้อมจำแนก</option>
                  <option value="unidentified">ไม่พร้อมจำแนก</option>
                </select>
              </label>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                บันทึก
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
