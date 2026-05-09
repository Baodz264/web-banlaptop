import AiSession from "../../database/mongo/chat/aiSession.schema.js";

// ================= GET MEMORY =================
export const getAdminMemory = async (userId) => {
  try {
    return await AiSession.findOne({ userId });
  } catch (err) {
    console.error("[Memory Get Error]", err.message);
    return null;
  }
};

// ================= SAVE MEMORY (LEVEL 3) =================
export const saveAdminMemory = async (userId, message, meta = {}) => {
  try {
    await AiSession.updateOne(
      { userId },
      {
        $setOnInsert: { userId },
        $push: {
          messages: {
            role: "admin",
            text: message,
            meta, // 👈 thêm context (intent, data snapshot)
            createdAt: new Date(),
          },
        },
      },
      { upsert: true }
    );
  } catch (err) {
    console.error("[Memory Save Error]", err.message);
  }
};