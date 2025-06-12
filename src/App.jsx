import { Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import ProtectedRoute from "./components/ProtectedRoute"; // ปรับ path ตามที่คุณเก็บ
import ForgotPassword from "./pages/forgotPasswordForm.jsx";
import ResetPassword from "./pages/resetPassword.jsx"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />}/>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
