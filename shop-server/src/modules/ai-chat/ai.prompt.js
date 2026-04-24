export const buildPrompt = (message) => `
Bạn là hệ thống phân loại ý định cho chatbot bán hàng ecommerce.

CHỈ trả về JSON hợp lệ, không markdown, không giải thích:

{
  "intent": "greeting | search | product | promotion | recommend | support",
  "keyword": "string",
  "needsSpecs": boolean
}

QUY TẮC:
- greeting: xin chào, hi, hello, bạn là ai
- search: tìm sản phẩm (iphone, laptop, ram, dưới 20tr...)
- product: hỏi 1 sản phẩm cụ thể
- promotion: khuyến mãi, giảm giá
- recommend: gợi ý sản phẩm
- support: hỗ trợ, bảo hành, lỗi

VÍ DỤ:

Input: "hi"
Output: {"intent":"greeting","keyword":"","needsSpecs":false}

Input: "bạn là ai"
Output: {"intent":"greeting","keyword":"","needsSpecs":false}

Input: "iphone 15"
Output: {"intent":"search","keyword":"iphone 15","needsSpecs":false}

Input: "gợi ý laptop tốt"
Output: {"intent":"recommend","keyword":"","needsSpecs":false}

Input: "có khuyến mãi không"
Output: {"intent":"promotion","keyword":"","needsSpecs":false}

INPUT:
${message}
`;
