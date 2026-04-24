import axiosClient from "./axios.config";

/* ================= REGISTER ================= */
const register = async (data) => {
  try {
    const res = await axiosClient.post("/auth/register", data);
    return res.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw error;
  }
};

/* ================= LOGIN ================= */
const login = async (data) => {
  try {
    const res = await axiosClient.post("/auth/login", data);
    const { accessToken, refreshToken } = res.data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return res.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw error;
  }
};

/* ================= REFRESH TOKEN ================= */
const refreshToken = async () => {
  try {
    const token = localStorage.getItem("refreshToken");
    if (!token) throw new Error("Refresh token not found");

    const res = await axiosClient.post("/auth/refresh", {
      refreshToken: token,
    });

    const { accessToken, refreshToken: newRefreshToken } = res.data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    logout();
    throw error;
  }
};

/* ================= LOGOUT ================= */
const logout = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (token) {
      await axiosClient.post(
        "/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

/* ================= FORGOT PASSWORD ================= */
const forgotPassword = async (email) => {
  try {
    const res = await axiosClient.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw error;
  }
};

/* ================= ✅ VERIFY OTP (FIX CHÍNH) ================= */
const verifyOtp = async ({ email, otp }) => {
  try {
    const res = await axiosClient.post("/auth/verify-otp", {
      email,
      otp,
    });
    return res.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw error;
  }
};

/* ================= RESET PASSWORD ================= */
const resetPassword = async (data) => {
  try {
    const res = await axiosClient.post("/auth/reset-password", data);
    return res.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw error;
  }
};

/* ================= CHANGE PASSWORD ================= */
const changePassword = async (data) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await axiosClient.post("/auth/change-password", data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw error;
  }
};

/* ================= EXPORT ================= */
const authService = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  verifyOtp,      // ✅ dùng API thật
  resetPassword,
  changePassword,
};

export default authService;
