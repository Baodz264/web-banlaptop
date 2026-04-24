import React, { useState, useEffect } from "react";
import { Card, Button, Tag, Typography, Space, Row, Col } from "antd";
import { 
  ShoppingOutlined, RightOutlined, BoxPlotOutlined, WalletOutlined, 
  CheckCircleOutlined, CarOutlined, HomeOutlined, 
  CloseCircleOutlined, HourglassOutlined, CreditCardOutlined, SyncOutlined,
  RollbackOutlined
} from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext"; 

const { Text, Title } = Typography;
const API_URL = "http://tbtshoplt.xyz"; 

export default function OrderItem({ data, onView }) {
  const { user } = useAuth(); 
  const [countdown, setCountdown] = useState({ time: "", isExpired: false });

  // SỬA LỖI: Sử dụng === thay vì ==
  const isOwner = user && (data.user_id === user.id);

  useEffect(() => {
    if (data.status !== "awaiting_payment") return;
    
    const calculateTime = () => {
      const createdTime = new Date(data.created_at).getTime();
      const expireTime = createdTime + 15 * 60 * 1000; 
      const now = new Date().getTime();
      const diff = expireTime - now;

      if (diff <= 0) {
        setCountdown({ time: "00:00", isExpired: true });
        return true; 
      }

      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setCountdown({ 
        time: `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`, 
        isExpired: false 
      });
      return false;
    };

    const isDone = calculateTime();
    if (isDone) return;

    const timer = setInterval(() => {
      if (calculateTime()) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [data.status, data.created_at]);

  const formatPrice = (v) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(v || 0));

  const formatDate = (d) =>
    new Date(d).toLocaleString("vi-VN", {
      year: "numeric", month: "numeric", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const statusMap = {
    awaiting_payment: { color: "warning", text: "Chờ thanh toán", icon: <WalletOutlined />, themeColor: "#faad14" },
    pending: { color: "orange", text: "Chờ xác nhận", icon: <SyncOutlined spin />, themeColor: "#fa8c16" },
    confirmed: { color: "blue", text: "Đã xác nhận", icon: <CheckCircleOutlined />, themeColor: "#1890ff" },
    shipping: { color: "purple", text: "Đang giao hàng", icon: <CarOutlined />, themeColor: "#722ed1" },
    delivered: { color: "green", text: "Hoàn tất", icon: <HomeOutlined />, themeColor: "#52c41a" },
    cancelled: { color: "red", text: "Đã hủy", icon: <CloseCircleOutlined />, themeColor: "#ff4d4f" },
    returned: { color: "magenta", text: "Trả hàng", icon: <RollbackOutlined />, themeColor: "#eb2f96" },
  };

  const isActuallyExpired = data.status === "awaiting_payment" && countdown.isExpired;
  
  const currentStatus = isActuallyExpired 
    ? { color: "red", text: "THANH TOÁN HẾT HẠN", icon: <CloseCircleOutlined />, themeColor: "#ff4d4f" }
    : (statusMap[data.status] || { color: "default", text: data.status, icon: <ShoppingOutlined />, themeColor: "#999" });

  const renderProducts = () => {
    const items = data.OrderItems || data.order_items || [];
    
    return items.map((item, index) => {
      const variant = item.Variant || item.variant;
      const product = variant?.Product || item.Product || item.product;
      const hasBundles = item.bundles && item.bundles.length > 0;
      
      const getRawImagePath = () => {
        if (item.image) return item.image;
        if (hasBundles && item.bundles[0]?.thumbnail) return item.bundles[0].thumbnail;
        if (variant?.image) return variant.image;
        const gallery = product?.ProductImages || product?.product_images || [];
        if (gallery.length > 0) return gallery[0].image || gallery[0].url;
        return product?.thumbnail || product?.image || null;
      };

      const rawImg = getRawImagePath();
      let imgUrl = "https://placehold.co/100x100?text=No+Image";

      if (rawImg) {
        if (rawImg.startsWith('http')) {
          imgUrl = rawImg;
        } else {
          const cleanPath = rawImg.startsWith('/') ? rawImg.substring(1) : rawImg;
          imgUrl = `${API_URL}/${cleanPath}`;
        }
      }

      return (
        <Row key={item.id || `item-${index}`} gutter={12} align="middle" style={{ marginBottom: 12 }}>
          <Col>
            <div style={{ position: 'relative', display: 'flex' }}>
              <img 
                src={imgUrl} 
                alt="product" 
                style={{ 
                  width: 56, height: 56, objectFit: 'cover', borderRadius: 8, 
                  border: hasBundles ? "2px solid #722ed1" : "1px solid #f0f0f0" 
                }} 
                onError={(e) => { 
                  if(e.target.src !== "https://placehold.co/100x100?text=404") {
                    e.target.src = "https://placehold.co/100x100?text=404";
                  }
                }}
              />
              {hasBundles && (
                <div style={{ 
                  position: 'absolute', bottom: -2, right: -2, background: '#722ed1', 
                  borderRadius: '50%', width: 16, height: 16, display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' 
                }}>
                  <BoxPlotOutlined style={{ fontSize: 10, color: '#fff' }} />
                </div>
              )}
            </div>
          </Col>
          <Col flex="auto">
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {hasBundles && <span style={{ color: "#722ed1" }}>[Combo] </span>}
              {item.product_name || product?.name || "Sản phẩm"}
            </div>
            <div style={{ margin: '4px 0' }}>
              {variant?.AttributeValues?.map((av, idx) => (
                <Tag key={av.id || idx} color="blue" style={{ fontSize: '10px', margin: '2px' }}>
                  {av.Attribute?.name || av.attribute_name}: {av.value}
                </Tag>
              ))}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>Số lượng: {item.quantity}</Text>
          </Col>
          <Col style={{ textAlign: "right" }}>
            <Text strong>{formatPrice(item.price)}</Text>
          </Col>
        </Row>
      );
    });
  };

  return (
    <Card hoverable style={{ marginBottom: 16, borderRadius: 12 }} onClick={onView}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
        <Space size={12}>
          <div style={{ background: `${currentStatus.themeColor}15`, padding: 8, borderRadius: 8 }}>
            {React.cloneElement(currentStatus.icon, { style: { color: currentStatus.themeColor, fontSize: 18 } })}
          </div>
          <div>
            <Title level={5} style={{ margin: 0, fontSize: 15 }}>
                Mã đơn: <span style={{ color: '#1890ff' }}>#{data.id}</span>
            </Title>
            <Text type="secondary" style={{ fontSize: 11 }}>{formatDate(data.created_at)}</Text>
          </div>
        </Space>
        <Tag color={currentStatus.color} style={{ fontWeight: 600 }}>{currentStatus.text.toUpperCase()}</Tag>
      </Row>

      {data.status === "awaiting_payment" && (
        <div style={{ 
          margin: '8px 0', padding: '8px 12px', 
          background: countdown.isExpired ? '#fff1f0' : '#fff7e6', 
          color: countdown.isExpired ? '#cf1322' : '#d46b08', 
          borderRadius: 6, fontSize: 12 
        }}>
          <Space>
            <HourglassOutlined spin={!countdown.isExpired} />
            <span>{countdown.isExpired ? "Hết hạn thanh toán" : `Thanh toán trong: ${countdown.time}`}</span>
          </Space>
        </div>
      )}

      <div style={{ padding: '12px 0', borderTop: '1px dashed #f0f0f0', borderBottom: '1px dashed #f0f0f0', margin: '12px 0' }}>
        {renderProducts()}
      </div>

      <Row justify="space-between" align="middle">
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>Tổng cộng:</Text><br />
          <Text strong style={{ fontSize: 18, color: '#f5222d' }}>{formatPrice(data.grand_total || data.total)}</Text>
        </div>
        <Space>
          {isOwner && data.status === "awaiting_payment" && !countdown.isExpired && (
            <Button 
                type="primary" 
                danger 
                icon={<CreditCardOutlined />} 
                onClick={(e) => { e.stopPropagation(); }}
            >
                Thanh toán
            </Button>
          )}
          <Button icon={<RightOutlined />} onClick={(e) => { e.stopPropagation(); onView(); }}>Chi tiết</Button>
        </Space>
      </Row>
    </Card>
  );
}