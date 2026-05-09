import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
Bạn là hệ thống AI phân loại intent cho admin ecommerce.

NHIỆM VỤ:
Phân tích câu người dùng và trả về JSON DUY NHẤT, không giải thích.

FORMAT BẮT BUỘC:
{
  "intent": "revenue | users | orders | dashboard | compare | unknown",
  "time": "today | week | month | unknown"
}

QUY TẮC:
- Chỉ trả JSON hợp lệ
- Không markdown
- Không giải thích
- Không thêm text ngoài JSON
- Nếu không chắc → unknown
`;

const normalizeJson = (text) => {
  try {
    if (!text) return null;

    // remove markdown if exists
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    return null;
  }
};

export const extractAdminIntent = async (message) => {
  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0,
    });

    const content = res?.choices?.[0]?.message?.content;

    const parsed = normalizeJson(content);

    if (parsed?.intent && parsed?.time) {
      return parsed;
    }

    return fallback(message);
  } catch (err) {
    console.error("[Intent Error]", err.message);
    return fallback(message);
  }
};

const fallback = (message = "") => {
  const text = message.toLowerCase();

  let intent = "unknown";
  let time = "unknown";

  // ===== INTENT RULES (backup nhẹ thôi) =====
  if (
    text.includes("so với") ||
    text.includes("tăng") ||
    text.includes("giảm")
  ) {
    intent = "compare";
  } else if (text.includes("doanh thu")) {
    intent = "revenue";
  } else if (text.includes("user") || text.includes("người dùng")) {
    intent = "users";
  } else if (text.includes("đơn") || text.includes("order")) {
    intent = "orders";
  } else if (text.includes("dashboard")) {
    intent = "dashboard";
  }

  // ===== TIME =====
  if (text.includes("hôm nay")) time = "today";
  else if (text.includes("tuần")) time = "week";
  else if (text.includes("tháng")) time = "month";

  return { intent, time };
};