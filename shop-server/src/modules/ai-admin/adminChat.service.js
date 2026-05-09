import { extractAdminIntent } from "./admin.intent.service.js";
import {
  saveAdminMemory,
  getAdminMemory,
} from "./admin.memory.service.js";
import { buildAnalytics } from "./admin.analytics.service.js";
import { generateAdminResponse } from "./admin.response.service.js";

export const askAdminAI = async (userId, message) => {
  try {
    const { intent, time } = await extractAdminIntent(message);

    const analytics = await buildAnalytics();

    // ================= LOAD MEMORY =================
    const memory = await getAdminMemory(userId);

    const history =
      memory?.messages?.slice(-5).map((m) => ({
        role: m.meta?.type === "ai" ? "assistant" : "user",
        content: m.text,
      })) || [];

    // ================= DATA =================
    let data = analytics;

    if (intent === "revenue") {
      data = {
        metric: analytics.summary.revenue,
        trend: analytics.trend,
        problem: analytics.problem,
        strategy: analytics.strategy,
      };
    }

    if (intent === "orders") {
      data = {
        metric: analytics.summary.orders,
        trend: analytics.trend,
        problem: analytics.problem,
        strategy: analytics.strategy,
      };
    }

    if (intent === "users") {
      data = {
        metric: analytics.summary.users,
        trend: analytics.trend,
        problem: analytics.problem,
        strategy: analytics.strategy,
      };
    }

    // ================= AI =================
    const reply = await generateAdminResponse(
      message,
      data,
      intent,
      history
    );

    // ================= SAVE MEMORY =================
    await saveAdminMemory(userId, message, { intent, time });
    await saveAdminMemory(userId, reply, { type: "ai" });

    return {
      success: true,
      intent,
      data: analytics,
      message: reply,
    };
  } catch (err) {
    console.error("[Admin AI Error]", err);

    return {
      success: false,
      message: "Lỗi AI admin",
    };
  }
};