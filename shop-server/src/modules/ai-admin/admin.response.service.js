import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateAdminResponse = async (
  message,
  data,
  intent,
  history = []
) => {
  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
Bạn là một AI phân tích dữ liệu cấp cao cho hệ thống admin (ecommerce / business dashboard).

Vai trò:
- Bạn là business analyst + consultant cho CEO
- Phân tích dữ liệu như người thật, không viết kiểu máy móc

Cách trả lời:
- Tiếng Việt tự nhiên, dễ đọc
- Có nhận định + đánh giá + cảnh báo + gợi ý
- Không bắt buộc format cố định
- Có thể dùng tiêu đề hoặc bullet nếu cần, nhưng không lạm dụng
- Ưu tiên giải thích ý nghĩa dữ liệu thay vì chỉ liệt kê

Phong cách:
- giống senior analyst trong công ty thật
- có chiều sâu, có logic kinh doanh
- tránh kiểu robot: "OVERVIEW / PROBLEM / STRATEGY" cứng nhắc
          `,
        },
        ...history,
        {
          role: "user",
          content: `
Câu hỏi của admin:
${message}

Mục đích (intent):
${intent}

Dữ liệu hệ thống:
${JSON.stringify(data, null, 2)}

Yêu cầu:
Hãy phân tích như đang báo cáo cho CEO, tập trung vào insight quan trọng nhất.
          `,
        },
      ],
      temperature: 0.5,
      top_p: 0.9,
    });

    return res?.choices?.[0]?.message?.content || fallback(data);
  } catch (err) {
    console.error("[AI ERROR]", err.message);
    return fallback(data);
  }
};

const fallback = (data) => {
  const s = data?.summary || {};

  return `
📊 Tổng quan tình hình kinh doanh:
Doanh thu hiện tại đạt ${s.revenue || 0}, với tổng ${s.total_orders || 0} đơn hàng và ${s.new_users || 0} người dùng mới.

📉 Đánh giá:
Hiệu suất hệ thống đang ở mức ổn định nhưng chưa có dấu hiệu tăng trưởng rõ rệt. Một số chỉ số cho thấy cần cải thiện khả năng chuyển đổi khách hàng.

⚠️ Vấn đề tiềm ẩn:
Traffic hoặc chất lượng khách hàng chưa thực sự tốt, dẫn đến tỷ lệ chuyển đổi chưa cao.

🚀 Gợi ý hành động:
Tập trung tối ưu marketing, cải thiện trải nghiệm mua hàng và thử các chiến dịch tăng chuyển đổi (conversion optimization).

📈 Nhận định:
Nếu tối ưu đúng các điểm trên, doanh thu có thể tăng trưởng rõ rệt trong các chu kỳ tiếp theo.
`;
};