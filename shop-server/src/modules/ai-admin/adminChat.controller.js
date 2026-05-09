// adminChat.controller.js
import { askAdminAI } from "./adminChat.service.js";

export const adminChatController = async (req, res) => {
  try {
    const { message } = req.body;

    // 🔥 fix: lấy userId từ token hoặc fallback
    const userId = req.user?.id || "admin_test";

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Thiếu message",
      });
    }

    const result = await askAdminAI(userId, message);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[Controller Error]", err);

    res.status(500).json({
      success: false,
      message: "Admin AI error",
    });
  }
};
