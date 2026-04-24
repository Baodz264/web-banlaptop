import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ chưa login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ cho phép admin + staff
  const allowedRoles = ["admin", "staff"];

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />; 
  }

  return children;
};

export default AdminRoute;
