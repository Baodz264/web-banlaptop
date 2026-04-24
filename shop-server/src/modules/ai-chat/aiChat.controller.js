import { askAI } from "./aiChat.service.js";

export const chatAIController = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id || "guest";

    const result = await askAI(userId, message);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "AI error",
    });
  }
};
