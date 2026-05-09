import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Button,
  Spin,
  Space,
  Tag,
  Card,
  Typography,
  Divider,
  Avatar,
  Badge,
} from "antd";
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ThunderboltOutlined,
  ExportOutlined,
  AreaChartOutlined,
  LineChartOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

import {
  adminChat,
  exportOrdersExcel,
  exportTopSellingExcel,
} from "../../../services/adminService";

const { Text, Title } = Typography;

const ChatAdminModal = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Xin chào! Tôi là **Trợ lý Quản trị AI**. Tôi có thể giúp bạn phân tích doanh thu, kiểm tra đơn hàng hoặc đưa ra các chiến lược kinh doanh ngay lập tức.",
      suggestions: ["Tổng quan doanh thu tuần này", "Thống kê đơn hàng mới", "Top sản phẩm bán chạy"]
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Gợi ý mặc định ở thanh Header/Footer
  const suggestionsHeader = [
    { label: "📊 Tổng quan", text: "tổng quan dashboard tuần này", color: "blue" },
    { label: "💰 Doanh thu", text: "doanh thu tuần này", color: "gold" },
    { label: "📦 Đơn hàng", text: "thống kê đơn hàng", color: "green" },
    { label: "👤 Người dùng", text: "lượng user mới", color: "purple" },
    { label: "🔥 Phân tích", text: "phân tích kinh doanh và insight", color: "volcano" },
  ];

  // Hàm tự động sinh câu hỏi gợi ý nếu Backend không trả về
  const generateFollowUp = (intent) => {
    const maps = {
      revenue: ["Chi tiết theo từng sản phẩm?", "So sánh với tuần trước?", "Dự báo doanh thu tháng tới?"],
      orders: ["Đơn hàng nào đang chờ xác nhận?", "Tỷ lệ hủy đơn là bao nhiêu?", "Giờ cao điểm đặt hàng?"],
      users: ["Lượng khách hàng quay lại?", "Top khách hàng chi tiêu nhiều nhất?", "User mới đến từ đâu?"],
      unknown: ["Phân tích sâu hơn?", "Xu hướng thị trường hiện tại?", "Xem dashboard tổng quát"]
    };
    return maps[intent] || maps.unknown;
  };

  const handleExport = async (type) => {
    try {
      if (type === "orders") await exportOrdersExcel();
      if (type === "top") await exportTopSellingExcel();
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const sendMessage = async (textOverride) => {
    const text = textOverride || input;
    if (!text.trim() || loading) return;

    // Thêm tin nhắn user vào UI
    setMessages((p) => [...p, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await adminChat(text);
      const payload = res?.data?.data || null;
      const intent = res?.data?.intent || "unknown";
      
      // Lấy suggestions từ server hoặc tự sinh
      const followUps = res?.data?.suggestions || generateFollowUp(intent);

      setMessages((p) => [
        ...p,
        {
          role: "bot",
          text: res?.data?.message || "Dưới đây là kết quả phân tích dành cho bạn:",
          intent: intent,
          data: payload,
          suggestions: followUps, // Lưu vào tin nhắn để hiển thị
        },
      ]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        { role: "bot", text: "❌ **Lỗi kết nối server.** Vui lòng kiểm tra lại đường truyền." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const money = (v) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);
  
  const percent = (v) => {
    const isUp = v >= 0;
    return (
      <Tag color={isUp ? "success" : "error"} bordered={false} style={{ fontSize: '10px', borderRadius: '4px', margin: 0 }}>
        {isUp ? "↑" : "↓"} {Math.abs(v || 0)}%
      </Tag>
    );
  };

  // ================= RENDER CHART COMPONENT =================
  const renderChart = (chartData, type) => {
    if (!chartData || chartData.length === 0) return null;

    const config = {
      revenue: { color: "#1677ff", key: "revenue", label: "Doanh thu" },
      orders: { color: "#52c41a", key: "orders", label: "Đơn hàng" },
      users: { color: "#722ed1", key: "users", label: "Người dùng" },
    };

    const activeConfig = config[type] || config.revenue;

    return (
      <div style={{ height: 180, width: "100%", marginTop: 15, marginBottom: 10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`color-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              fontSize={10} 
              axisLine={false}
              tickLine={false}
              tickFormatter={(str) => str.split("-").slice(2).join("/")} 
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area
              type="monotone"
              dataKey={activeConfig.key}
              stroke={activeConfig.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#color-${type})`}
              name={activeConfig.label}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // ================= RENDER ANALYTICS CARD =================
  const renderAnalytics = (analytics, intent) => {
    if (!analytics || (!analytics.summary && !analytics.chart)) return null;

    const { summary = {}, trend = {}, problem = [], strategy = [], chart = {} } = analytics;

    let chartType = "revenue";
    if (intent === "orders") chartType = "orders";
    if (intent === "users") chartType = "users";

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card size="small" bordered={false} style={analyticsCardStyle}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            
            {chart[chartType] && (
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: 12, color: '#64748b' }}>
                    <AreaChartOutlined /> BIỂU ĐỒ {chartType.toUpperCase()}
                  </Text>
                  <Badge status="processing" color={chartType === 'revenue' ? '#1677ff' : '#52c41a'} />
                </div>
                {renderChart(chart[chartType], chartType)}
              </div>
            )}
            
            {Object.keys(summary).length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={statBoxStyle}>
                  <Text size="small" type="secondary" style={{ fontSize: 11 }}>Doanh thu</Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <Text strong style={{ fontSize: 15 }}>{money(summary.revenue)}</Text>
                    {percent(trend.revenueChange)}
                  </div>
                </div>
                <div style={statBoxStyle}>
                  <Text size="small" type="secondary" style={{ fontSize: 11 }}>Đơn hàng</Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <Text strong style={{ fontSize: 15 }}>{summary.total_orders || 0} đơn</Text>
                    {percent(trend.orderChange)}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {problem && problem.length > 0 && (
                <div style={{ padding: '12px', background: '#fff1f0', borderRadius: '12px', border: '1px solid #ffa39e' }}>
                  <Text type="danger" strong><ThunderboltOutlined /> Cảnh báo:</Text>
                  {problem.map((p, i) => <div key={i} style={{ fontSize: 12, color: '#cf1322', marginTop: 2 }}>• {p}</div>)}
                </div>
              )}

              {strategy && strategy.length > 0 && (
                <div style={{ padding: '12px', background: '#f6ffed', borderRadius: '12px', border: '1px solid #b7eb8f' }}>
                  <Text type="success" strong>💡 Giải pháp đề xuất:</Text>
                  {strategy.map((s, i) => <div key={i} style={{ fontSize: 12, color: '#389e0d', marginTop: 2 }}>• {s}</div>)}
                </div>
              )}
            </div>

            <Divider style={{ margin: '4px 0' }} />
            
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button size="small" type="text" icon={<ExportOutlined />} onClick={() => handleExport("orders")} style={{ fontSize: 12 }}>
                Xuất Excel
              </Button>
              <Button size="small" type="primary" ghost icon={<LineChartOutlined />} onClick={() => handleExport("top")} style={{ fontSize: 12, borderRadius: 8 }}>
                Top sản phẩm
              </Button>
            </div>
          </Space>
        </Card>
      </motion.div>
    );
  };

  return (
    <div style={mainContainerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <Space size={12}>
          <div style={avatarCircle}>
            <RobotOutlined style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <div>
            <Title level={5} style={{ margin: 0, letterSpacing: -0.5 }}>AI Admin Analytics</Title>
            <Space size={4}>
              <div style={statusDot} />
              <Text type="secondary" style={{ fontSize: 11 }}>Trợ lý thông minh đang trực tuyến</Text>
            </Space>
          </div>
        </Space>
        <Button type="text" icon={<DashboardOutlined />} />
      </div>

      {/* Chat Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", scrollBehavior: 'smooth' }}>
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 24 }}
            >
              <div style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", maxWidth: "85%", alignItems: "flex-start" }}>
                <Avatar 
                  size={32} 
                  icon={m.role === "user" ? <UserOutlined /> : <RobotOutlined />} 
                  style={{ 
                    backgroundColor: m.role === "user" ? "#1677ff" : "#001529", 
                    flexShrink: 0, 
                    margin: m.role === "user" ? "0 0 0 12px" : "0 12px 0 0",
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }} 
                />
                <div style={{ width: '100%' }}>
                  <div style={{
                      padding: "12px 16px",
                      borderRadius: m.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      background: m.role === "user" ? "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)" : "#fff",
                      color: m.role === "user" ? "#fff" : "#1f1f1f",
                      boxShadow: m.role === "user" ? "0 4px 15px rgba(22, 119, 255, 0.2)" : "0 2px 10px rgba(0,0,0,0.05)",
                      lineHeight: '1.6',
                      fontSize: '14px'
                  }}>
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p style={{ margin: 0 }} {...props} />,
                        strong: ({ node, ...props }) => (
                          <strong style={{ fontWeight: 700, color: m.role === 'user' ? '#fff' : '#1677ff' }} {...props} />
                        ),
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>

                  {/* 1. RENDER ANALYTICS CARD */}
                  {m.role === "bot" && m.data && Object.keys(m.data).length > 0 && (
                     renderAnalytics(m.data, m.intent)
                  )}

                  {/* 2. RENDER FOLLOW-UP SUGGESTIONS (NEW) */}
                  {m.role === "bot" && m.suggestions && m.suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}
                    >
                      {m.suggestions.map((sug, idx) => (
                        <Tag 
                          key={idx}
                          icon={<ThunderboltOutlined style={{ fontSize: 10 }} />}
                          style={{ 
                            cursor: "pointer", 
                            borderRadius: 12, 
                            padding: '4px 12px',
                            background: '#fff',
                            border: '1px solid #d9e8ff',
                            color: '#1677ff',
                            fontSize: '12px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => sendMessage(sug)}
                        >
                          {sug}
                        </Tag>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div style={{ marginLeft: 44, marginBottom: 20 }}>
            <Space>
              <Spin size="small" />
              <Text type="secondary" italic style={{ fontSize: 13 }}>Đang phân tích dữ liệu...</Text>
            </Space>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer Input */}
      <div style={footerStyle}>
        <div style={{ marginBottom: 12, overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 4 }}>
          <Space size={8}>
            {suggestionsHeader.map((s, i) => (
              <Tag 
                key={i} 
                color={s.color} 
                style={suggestionTagStyle}
                onClick={() => sendMessage(s.text)}
              >
                {s.label}
              </Tag>
            ))}
          </Space>
        </div>
        <div style={inputContainerStyle}>
          <Input
            value={input}
            variant="borderless"
            placeholder="Hỏi AI về doanh thu tuần này..."
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={() => sendMessage()}
            style={{ padding: '8px 16px' }}
          />
          <Button 
            type="primary" 
            shape="circle"
            icon={<SendOutlined />} 
            onClick={() => sendMessage()} 
            style={{ minWidth: 40, height: 40, marginRight: 4 }}
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Text style={{ fontSize: 10, color: '#bfbfbf' }}>
            <InfoCircleOutlined /> Dữ liệu được trích xuất trực tiếp từ hệ thống **SHOPVOT**
          </Text>
        </div>
      </div>
    </div>
  );
};

// ================= STYLES (Giữ nguyên phong cách của bạn) =================

const mainContainerStyle = { 
  height: "85vh", 
  display: "flex", 
  flexDirection: "column", 
  background: "#f4f7fa", 
  borderRadius: 24, 
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
};

const headerStyle = { 
  padding: "16px 24px", 
  background: "#fff", 
  borderBottom: "1px solid #f0f0f0", 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  zIndex: 10
};

const avatarCircle = {
  width: 38,
  height: 38,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1677ff 0%, #001529 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)'
};

const statusDot = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#52c41a',
  boxShadow: '0 0 0 2px #f6ffed'
};

const footerStyle = { 
  background: "#fff", 
  padding: "20px 24px",
  borderTop: "1px solid #f0f0f0"
};

const inputContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  background: '#f1f5f9',
  borderRadius: '24px',
  padding: '4px',
  border: '1px solid #e2e8f0'
};

const suggestionTagStyle = { 
  cursor: "pointer", 
  borderRadius: 16, 
  padding: '4px 12px',
  border: 'none',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  transition: 'all 0.3s'
};

const analyticsCardStyle = { 
  marginTop: 12, 
  borderRadius: 20, 
  background: "#fff",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  border: "1px solid #f0f0f0",
  width: "100%",
  padding: '4px'
};

const statBoxStyle = {
  padding: '12px',
  background: '#fff',
  borderRadius: '16px',
  border: '1px solid #f1f5f9',
  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
};

export default ChatAdminModal;