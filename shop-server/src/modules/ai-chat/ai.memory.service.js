import AiSession from "../../database/mongo/chat/aiSession.schema.js";

export const getMemory = async (userId) => {
  try {
    return await AiSession.findOne({ userId });
  } catch (err) {
    console.error("[AI Memory Get Error]", err.message);
    return null;
  }
};

export const saveMemory = async (userId, message) => {
  try {
    await AiSession.updateOne(
      { userId },
      {
        $setOnInsert: { userId },

        $push: {
          messages: {
            role: "user",
            text: message,
            createdAt: new Date(),
          },
        },
      },
      { upsert: true }
    );
  } catch (err) {
    console.error("[AI Memory Save Error]", err.message);
  }
};
