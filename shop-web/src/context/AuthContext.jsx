import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "../services/auth.service";
import userService from "../services/user.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * ================= REFRESH USER (REALTIME FIX) =================
   * Hàm này cực kỳ quan trọng. Nó lấy dữ liệu mới nhất từ Server 
   * và cập nhật vào State của Context + LocalStorage.
   */
  const refreshUser = useCallback(async () => {
    try {
      const res = await userService.getProfile();
      
      // Xử lý bóc tách data tùy theo cấu trúc Backend của bạn
      const currentUser =
        res.data?.data?.user ||
        res.data?.data ||
        res.data;

      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      }
      return currentUser;
    } catch (error) {
      console.error("REFRESH USER ERROR:", error);
      // Nếu lỗi 401 (hết hạn) thì Interceptor sẽ xử lý, ở đây ta không logout ép buộc
      return null;
    }
  }, []);

  /* ================= INIT APP ================= */
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        // ❌ Không có token → Dừng loading
        if (!token) {
          setLoading(false);
          return;
        }

        // ✅ Load user từ cache trước để UI hiển thị ngay lập tức (Optimistic UI)
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // ✅ Gọi API để đồng bộ dữ liệu mới nhất từ Server
        await refreshUser();

      } catch (error) {
        console.log("INIT AUTH ERROR:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshUser]);

  /* ================= LOGIN ================= */
  const login = async (data) => {
    try {
      const res = await authService.login(data);

      const accessToken = res.data?.accessToken || res.data?.data?.accessToken;
      const refreshToken = res.data?.refreshToken || res.data?.data?.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error("Token không hợp lệ");
      }

      // ✅ Lưu token vào localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // ⚠️ Delay cực ngắn để đảm bảo axios kịp nhận header mới cho call tiếp theo
      await new Promise((resolve) => setTimeout(resolve, 50));

      // ✅ Sử dụng hàm refreshUser để lấy thông tin user sau login
      const currentUser = await refreshUser();
      return currentUser;

    } catch (error) {
      console.log("LOGIN ERROR:", error);
      throw error;
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout API error:", e);
    } finally {
      // Luôn xóa sạch local kể cả khi gọi API logout lỗi
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  /* ================= HELPER ================= */
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshUser, // 👈 Export hàm này để ProfilePage có thể gọi
        login,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};