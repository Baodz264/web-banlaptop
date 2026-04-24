import { lazy } from "react";

// Auth pages (lazy load để giảm bundle initial)
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const AdminLogin = lazy(() => import("../pages/auth/AdminLogin"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));

const AuthRoutes = [
  // CLIENT LOGIN
  {
    path: "/login",
    element: <Login />,
  },

  // CLIENT REGISTER
  {
    path: "/register",
    element: <Register />,
  },

  // FORGOT PASSWORD
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  // ADMIN LOGIN
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
];

export default AuthRoutes;
