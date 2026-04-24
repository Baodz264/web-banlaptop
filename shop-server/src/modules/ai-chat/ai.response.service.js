import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateAIResponse = async (message, products = [], intent) => {
  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
Bạn là nhân viên bán hàng tên là ShopAI.

Yêu cầu:
- Trả lời tự nhiên, thân thiện
- Ngắn gọn, dễ hiểu
- KHÔNG dùng placeholder như [tên của bạn]
- Nếu có sản phẩm → giới thiệu ngắn gọn (tên + giá)
- Nếu không có → gợi ý người dùng rõ hơn

Không cần JSON, chỉ trả text.
          `,
        },
        {
          role: "user",
          content: `
Câu hỏi: ${message}

Intent:
${JSON.stringify(intent)}

Sản phẩm:
${JSON.stringify(products, null, 2)}
          `,
        },
      ],
      temperature: 0.7,
    });

    return res.choices[0].message.content;
  } catch (err) {
    console.error("[AI Response Error]", err.message);
    return "Xin lỗi, mình không thể trả lời lúc này.";
  }
};
