import { extractIntent } from "./ai.intent.service.js";
import { getCache, setCache } from "../../cache/redis.cache.js";
import { CacheKeys } from "../../cache/redis.keys.js";
import { getMemory, saveMemory } from "./ai.memory.service.js";
import { getRecommendations } from "./ai.recommend.service.js";
import { generateAIResponse } from "./ai.response.service.js";

const BOT_NAME = "Shop LAPTOP VIP PRO";

const handleGreeting = () => {
  return {
    intent: { intent: "greeting" },
    products: [],
    message: `Chào bạn 👋 Mình là ${BOT_NAME}. Mình có thể giúp bạn tìm sản phẩm, xem giá hoặc gợi ý phù hợp. Bạn đang cần gì hôm nay?`,
  };
};

export const askAI = async (userId, message) => {
  try {

    const cacheKey = CacheKeys.AI_CHAT(userId, message);
    const cached = await getCache(cacheKey);

    if (cached) return cached;


    const memoryDoc = await getMemory(userId);
    const memory = memoryDoc?.memory || {};

    const intent = await extractIntent(message);


    if (intent.intent === "greeting") {
      const response = handleGreeting();

      await saveMemory(userId, message);

      await setCache(cacheKey, response, 300);

      return response;
    }

    const products = await getRecommendations(intent, memoryDoc);


    const aiMessage = await generateAIResponse(
      message,
      products,
      intent
    );

    const response = {
      intent,
      products,
      message: aiMessage,
    };


    await saveMemory(userId, message);


    await setCache(cacheKey, response, 300);

    return response;
  } catch (err) {
    console.error("[askAI Error]", err.message);

    return {
      intent: null,
      products: [],
      message: "Xin lỗi, hệ thống AI đang gặp lỗi. Vui lòng thử lại sau.",
    };
  }
};
