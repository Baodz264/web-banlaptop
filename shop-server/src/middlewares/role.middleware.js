import response from "../utils/response.js";

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return response.error(res, "Chưa xác thực", 401);
      }

      // 🔥 normalize role user
      const userRole = String(req.user.role || "").toLowerCase();

      // 🔥 normalize allowed roles
      const allowedRoles = roles
        .filter(Boolean)
        .map((r) => String(r).toLowerCase());

      console.log("ROLE DEBUG:", {
        userRole,
        allowedRoles,
      });

      if (!allowedRoles.includes(userRole)) {
        return response.error(res, "Bạn không có quyền truy cập", 403);
      }

      next();
    } catch (err) {
      console.error("ROLE MIDDLEWARE ERROR:", err);

      return response.error(
        res,
        "Lỗi phân quyền",
        500
      );
    }
  };
};

export default roleMiddleware;
