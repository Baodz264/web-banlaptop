import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Divider, Typography, ConfigProvider, Flex } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
  ClockCircleOutlined,
  RocketOutlined
} from "@ant-design/icons";
import settingService from "../../services/setting.service";

const { Footer } = Layout;
const { Title, Text } = Typography;

function AppFooter() {
  const [settings, setSettings] = useState({});

  const fetchSettings = async () => {
    try {
      const res = await settingService.getSettings({ limit: 100 });
      const items = res?.data?.data?.items || [];
      const map = {};
      items.forEach((item) => {
        map[item.key] = item.value;
      });
      setSettings(map);
    } catch (error) {
      console.log("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextBase: "#d1d1d1",
        },
      }}
    >
      <Footer
        style={{
          background: "linear-gradient(180deg, #141414 0%, #000000 100%)",
          color: "#fff",
          padding: "60px 80px 30px",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <Row gutter={[48, 32]} justify="center">
          
          {/* CỘT 1: GIỚI THIỆU SHOP */}
          <Col xs={24} sm={12} md={8}>
            <Title level={3} style={{ color: "#fff", marginBottom: 20, letterSpacing: '1px' }}>
              {settings.seo_title || "BaoShop"}
            </Title>
            <Text style={{ color: "#aaa", fontSize: "15px", lineHeight: "1.8" }}>
              {settings.seo_description || "Chuyên cung cấp các sản phẩm chất lượng cao với mức giá cạnh tranh nhất thị trường."}
            </Text>
            <div style={{ marginTop: 25 }}>
              <Flex gap="middle">
                {/* Sửa lỗi anchor-is-valid bằng cách dùng href="javascript:void(0)" hoặc link thật */}
                <a href={settings.facebook_url || "https://facebook.com"} target="_blank" rel="noreferrer" style={socialIconStyle}><FacebookFilled /></a>
                <a href={settings.instagram_url || "https://instagram.com"} target="_blank" rel="noreferrer" style={socialIconStyle}><InstagramFilled /></a>
                <a href={settings.youtube_url || "https://youtube.com"} target="_blank" rel="noreferrer" style={socialIconStyle}><YoutubeFilled /></a>
              </Flex>
            </div>
          </Col>

          {/* CỘT 2: THÔNG TIN LIÊN HỆ */}
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: "#fff", marginBottom: 20 }}>Thông tin liên hệ</Title>
            
            {/* Dùng Flex thay cho Space để tránh cảnh báo direction/orientation */}
            <Flex vertical gap={20}>
              <div style={contactItemStyle}>
                <div style={iconBoxStyle}><PhoneOutlined /></div>
                <Text style={{ color: "#fff" }}>{settings.contact_phone || "0123.456.789"}</Text>
              </div>
              <div style={contactItemStyle}>
                <div style={iconBoxStyle}><MailOutlined /></div>
                <Text style={{ color: "#fff" }}>{settings.contact_email || "contact@baoshop.vn"}</Text>
              </div>
              <div style={contactItemStyle}>
                <div style={iconBoxStyle}><ClockCircleOutlined /></div>
                <Text style={{ color: "#fff" }}>Múi giờ: {settings.timezone || "Hanoi (GMT+7)"}</Text>
              </div>
              <div style={contactItemStyle}>
                <div style={iconBoxStyle}><EnvironmentOutlined /></div>
                <Text style={{ color: "#fff" }}>Toà nhà BaoShop, Cầu Giấy, Hà Nội</Text>
              </div>
            </Flex>
          </Col>

          {/* CỘT 3: VẬN CHUYỂN & DỊCH VỤ */}
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: "#fff", marginBottom: 20 }}>Chính sách ưu đãi</Title>
            <div style={shippingCardStyle}>
              <Flex align="center" style={{ marginBottom: 15 }}>
                <RocketOutlined style={{ fontSize: 28, color: "#52c41a", marginRight: 12 }} />
                <Title level={5} style={{ color: "#fff", margin: 0 }}>Giao hàng nhanh</Title>
              </Flex>
              <p style={{ margin: "8px 0", fontSize: '14px', color: "#d1d1d1" }}>
                Phí vận chuyển toàn quốc: <br/>
                <span style={{ color: "#ff4d4f", fontWeight: "600", fontSize: '18px' }}>
                  {settings.shipping_fee ? `${Number(settings.shipping_fee).toLocaleString()} ${settings.currency || "VNĐ"}` : "30,000 VNĐ"}
                </span>
              </p>
              <Divider style={{ borderColor: "rgba(255,255,255,0.1)", margin: '12px 0' }} />
              <p style={{ margin: 0, fontSize: '14px', color: "#d1d1d1" }}>
                Miễn phí vận chuyển cho đơn hàng từ: <br/>
                <span style={{ color: "#52c41a", fontWeight: "600", fontSize: '18px' }}>
                  {settings.free_shipping_limit ? `${Number(settings.free_shipping_limit).toLocaleString()} ${settings.currency || "VNĐ"}` : "500,000 VNĐ"}
                </span>
              </p>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: "rgba(255,255,255,0.1)", marginTop: 50 }} />

        <div style={{ textAlign: "center", color: "#666", fontSize: "13px", letterSpacing: '0.5px' }}>
          © {new Date().getFullYear()} <span style={{ color: "#1890ff", fontWeight: 700 }}>BAOSHOP</span>. All Rights Reserved. 
          <br/>
          <Text style={{ fontSize: '11px', color: '#444' }}>Hệ thống quản lý cửa hàng chuyên nghiệp</Text>
        </div>
      </Footer>
    </ConfigProvider>
  );
}

// --- Styles giữ nguyên tính thẩm mỹ của bạn ---
const socialIconStyle = {
  fontSize: "20px",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "42px",
  height: "42px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.08)",
  transition: "all 0.3s ease",
};

const contactItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const iconBoxStyle = {
  width: '32px',
  height: '32px',
  background: 'rgba(24, 144, 255, 0.15)',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#1890ff',
  fontSize: '16px'
};

const shippingCardStyle = {
  background: "rgba(255,255,255,0.03)",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
};

export default AppFooter;