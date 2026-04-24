import { verifyAccessToken } from "../config/jwt.config.js";
import User from "../database/mysql/user/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    if (req.originalUrl.includes("/vnpay-return")) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Thiếu access token",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    const user = await User.findOne({
      where: {
        id: decoded.id,
        status: 1,
        deleted_at: null,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Không tìm thấy user hoặc user bị khóa",
      });
    }

    req.user = {
      id: user.id,
      role: (user.role || "").toLowerCase(),
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

export default authMiddleware;
