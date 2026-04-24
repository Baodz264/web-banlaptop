import React, { useState, useEffect, useRef } from "react";
import { 
  Input, 
  Button, 
  Avatar, 
  Card, 
  Typography, 
  Space, 
  ConfigProvider,
  Tag,
  Tooltip,
  Spin,
  Badge,
  Flex 
} from "antd";
import { 
  SendOutlined, 
  RobotOutlined, 
  CloseOutlined,
  MessageFilled,
  EyeOutlined,
  DeleteOutlined,
  ThunderboltFilled
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import aiChatService from "../../services/chatbot.service";

const { Text, Title } = Typography;

const API_URL = "http://tbtshoplt.xyz"; 

const SUGGESTIONS = [
  { text: "Gaming 🎮", value: "Tìm laptop gaming cấu hình mạnh" },
  { text: "Văn phòng 💼", value: "Laptop văn phòng mỏng nhẹ" },
  { text: "Sinh viên 🎓", value: "Laptop cho sinh viên giá rẻ" },
  { text: "Đồ họa 🎨", value: "Laptop chuyên làm đồ họa" },
];

const ChatbotComponent = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { 
        role: "ai", 
        text: "Xin chào! 👋 Mình là chuyên gia tư vấn Laptop. Bạn đang tìm kiếm máy cho công việc hay chơi game nhỉ?" 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [chat, loading, isOpen]);

  const formatPrice = (p) =>
    p ? Math.round(p).toLocaleString("vi-VN") + "₫" : "Liên hệ";

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150?text=Laptop";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const normalizeProduct = (item) => item?.Product || item || {};

  const goToDetail = (item) => {
    const product = normalizeProduct(item);
    const slug = product.slug;
    if (slug) {
      navigate(`/product/${slug}`);
      setIsOpen(false);
    }
  };

  const handleSend = async (textToSend = message) => {
    const finalMsg = typeof textToSend === "string" ? textToSend : message;
    if (!finalMsg.trim()) return;

    setChat((prev) => [...prev, { role: "user", text: finalMsg }]);
    setLoading(true);
    setMessage("");

    try {
      const res = await aiChatService.sendMessage(finalMsg);
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: res.data.message,
          products: res.data.products || [],
        },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Hệ thống đang bảo trì, mình sẽ quay lại sớm! 🛠️" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#3b82f6", borderRadius: 12 } }}>
      <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000, fontFamily: "'Inter', sans-serif" }}>
        
        {/* NÚT MỞ CHAT */}
        {!isOpen && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Badge dot color="#10b981" offset={[-5, 5]}>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<MessageFilled style={{ fontSize: "28px" }} />}
                  onClick={() => setIsOpen(true)}
                  style={{ width: "65px", height: "65px", boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                />
            </Badge>
          </motion.div>
        )}

        {/* CỬA SỔ CHAT */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <Card
                variant="borderless" // Đã sửa lỗi: bordered={false} -> variant="borderless"
                style={{ 
                    width: "420px", 
                    height: "700px", 
                    borderRadius: "28px", 
                    overflow: "hidden",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)"
                }}
                styles={{ body: { display: "flex", flexDirection: "column", height: "100%", padding: 0 } }}
              >
                {/* HEADER */}
                <div style={{ 
                    padding: "24px 20px", 
                    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)", 
                    color: "#fff", 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                  <Space size="middle">
                    <Avatar 
                        size={40} 
                        icon={<RobotOutlined />} 
                        style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)" }} 
                    />
                    <div>
                        <Title level={5} style={{ margin: 0, color: "#fff", fontSize: "16px" }}>Trợ lý AI</Title>
                        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
                            <span style={{ display: "inline-block", width: "8px", height: "8px", background: "#10b981", borderRadius: "50%", marginRight: "5px" }}></span>
                            Đang trực tuyến
                        </Text>
                    </div>
                  </Space>
                  <Space>
                    <Tooltip title="Xóa lịch sử">
                        <Button type="text" icon={<DeleteOutlined style={{ color: "#fff" }} />} onClick={() => setChat([chat[0]])} />
                    </Tooltip>
                    <Button type="text" icon={<CloseOutlined style={{ color: "#fff" }} />} onClick={() => setIsOpen(false)} />
                  </Space>
                </div>

                {/* NỘI DUNG CHAT */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#f8fafc" }}>
                  <Flex vertical gap="large"> {/* Thay thế List bằng Flex để tối ưu và tránh warning */}
                    {chat.map((item, index) => (
                      <div key={index} style={{ textAlign: item.role === "user" ? "right" : "left" }}>
                        <motion.div 
                            initial={{ opacity: 0, x: item.role === "user" ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                display: "inline-block",
                                padding: "12px 16px",
                                borderRadius: item.role === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                                background: item.role === "user" ? "#2563eb" : "#fff",
                                color: item.role === "user" ? "#fff" : "#1e293b",
                                boxShadow: item.role === "user" ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "0 4px 12px rgba(0,0,0,0.03)",
                                maxWidth: "85%",
                                textAlign: "left",
                                fontSize: "14px",
                                lineHeight: "1.5"
                            }}
                        >
                          {item.text}

                          {/* HIỂN THỊ SẢN PHẨM */}
                          {item.products?.length > 0 && (
                            <div style={{ 
                                display: "grid", 
                                gridTemplateColumns: "1fr 1fr", 
                                gap: "10px", 
                                marginTop: "15px" 
                            }}>
                              {item.products.map((p, idx) => {
                                const product = normalizeProduct(p);
                                const price = p.promotion_price || product.price || product.final_price;

                                return (
                                  <motion.div key={idx} whileHover={{ y: -5 }}>
                                    <Card
                                        hoverable
                                        onClick={() => goToDetail(p)}
                                        cover={
                                            <div style={{ padding: "10px", background: "#fff", textAlign: "center" }}>
                                                <img
                                                    src={getImageUrl(product.thumbnail)}
                                                    alt={product.name}
                                                    style={{ height: "80px", objectFit: "contain", maxWidth: "100%" }}
                                                />
                                            </div>
                                        }
                                        styles={{ body: { padding: "10px" } }}
                                        variant="borderless" // Đã sửa lỗi: bordered={false}
                                        style={{ borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                                    >
                                        <Text strong ellipsis={{ tooltip: product.name }} style={{ fontSize: "12px", display: "block" }}>
                                          {product.name}
                                        </Text>
                                        <Text type="danger" style={{ fontSize: "13px", fontWeight: "bold" }}>
                                          {formatPrice(price)}
                                        </Text>
                                        <Button 
                                            size="small" 
                                            type="primary" 
                                            ghost 
                                            block 
                                            icon={<EyeOutlined />} 
                                            style={{ marginTop: "8px", fontSize: "11px", borderRadius: "8px" }}
                                        >
                                            Chi tiết
                                        </Button>
                                    </Card>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        </motion.div>
                      </div>
                    ))}
                  </Flex>

                  {loading && (
                    <div style={{ marginTop: 20 }}>
                        <Space style={{ background: "#fff", padding: "10px 15px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                            <Spin size="small" />
                            <Text type="secondary">Đang suy nghĩ...</Text>
                        </Space>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* FOOTER */}
                <div style={{ padding: "20px", background: "#fff", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ marginBottom: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {SUGGESTIONS.map((s, i) => (
                      <Tag 
                        key={i} 
                        icon={<ThunderboltFilled />}
                        onClick={() => handleSend(s.value)} 
                        style={{ 
                            cursor: "pointer", 
                            padding: "4px 10px", 
                            borderRadius: "20px",
                            border: "1px solid #e2e8f0",
                            background: "#fff",
                            transition: "all 0.3s"
                        }}
                        className="hover-tag"
                      >
                        {s.text}
                      </Tag>
                    ))}
                  </div>

                  <div style={{ 
                      display: "flex", 
                      gap: "10px", 
                      background: "#f1f5f9", 
                      padding: "8px", 
                      borderRadius: "16px" 
                  }}>
                    <Input
                      placeholder="Hỏi tôi về laptop..."
                      variant="borderless"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onPressEnter={() => handleSend()}
                      style={{ flex: 1 }}
                    />
                    <Button 
                        type="primary" 
                        shape="circle" 
                        icon={<SendOutlined />} 
                        onClick={() => handleSend()} 
                        disabled={!message.trim()}
                    />
                  </div>
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <Text style={{ fontSize: "10px", color: "#94a3b8" }}>Powered by Gemini AI - Đồ án tốt nghiệp 2026</Text>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .hover-tag:hover {
            color: #2563eb !important;
            border-color: #2563eb !important;
            background: #eff6ff !important;
        }
        ::-webkit-scrollbar {
            width: 4px;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default ChatbotComponent;