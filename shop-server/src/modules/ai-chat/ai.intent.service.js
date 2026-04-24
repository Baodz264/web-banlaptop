import Groq from "groq-sdk";
import { buildPrompt } from "./ai.prompt.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const extractIntent = async (message) => {
  const normalize = message.toLowerCase().trim();

  try {
    // ================= RULE CỨNG (ưu tiên trước AI) =================

    // 👉 GENERAL (rất quan trọng)
    if (
      normalize.includes("bán gì") ||
      normalize.includes("có gì") ||
      normalize.includes("shop") ||
      normalize.includes("sản phẩm gì")
    ) {
      return {
        intent: "general",
        keyword: "",
        needsSpecs: false,
      };
    }

    // 👉 GREETING
    const words = normalize.split(/\s+/);

    if (
      normalize.match(/\b(hi|hello)\b/) ||
      normalize.includes("xin chào") ||
      normalize.includes("chào") ||
      normalize.includes("bạn là ai")
    ) {
      return {
        intent: "greeting",
        keyword: "",
        needsSpecs: false,
      };
    }

    // ================= CALL AI =================
    const res = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON. No markdown. No explanation.",
        },
        { role: "user", content: buildPrompt(message) },
      ],
      temperature: 0,
    });

    let content = res.choices?.[0]?.message?.content || "";
    content = content.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(content);

      if (parsed.intent) {
        return {
          intent: parsed.intent,
          keyword: parsed.keyword || "",
          needsSpecs: parsed.needsSpecs || false,
        };
      }
    } catch (e) {
      console.error("JSON parse failed:", content);
    }

    // ================= FALLBACK =================
    return {
      intent: "search",
      keyword: message,
      needsSpecs: false,
    };

  } catch (err) {
    console.error("[AI Intent Error]", err.message);

    return {
      intent: "support",
      keyword: "",
      needsSpecs: false,
    };
  }
};
