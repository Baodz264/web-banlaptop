import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Tag,
  Divider,
  Steps,
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Button,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  HomeOutlined,
  UserOutlined,
  GiftOutlined,
  WalletOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const API_URL = "http://tbtshoplt.xyz";

export default function OrderDetailModal({ order, onClose }) {
  const navigate = useNavigate();

  if (!order) return null;

  const shipmentId = order.shipment_id || order.Shipment?.id || order.tracking_number;
  const addr = order.shipping_address || order.UserAddress || order.user_address;

  const formatPrice = (v) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(v || 0));

  const statusConfig = {
    awaiting_payment: { label: "CHỜ THANH TOÁN", color: "warning", icon: <WalletOutlined />, step: 0 },
    pending: { label: "CHỜ XÁC NHẬN", color: "orange", icon: <SyncOutlined spin />, step: 1 },
    confirmed: { label: "ĐÃ XÁC NHẬN", color: "blue", icon: <CheckCircleOutlined />, step: 2 },
    shipping: { label: "ĐANG GIAO", color: "purple", icon: <CarOutlined />, step: 3 },
    delivered: { label: "HOÀN TẤT", color: "green", icon: <HomeOutlined />, step: 4 },
    cancelled: { label: "ĐÃ HỦY", color: "red", icon: <CloseCircleOutlined />, step: -1 },
    returned: { label: "TRẢ HÀNG", color: "magenta", icon: <RollbackOutlined />, step: -1 },
  };

  const currentStatus = order.status?.toLowerCase();
  const displayInfo = statusConfig[currentStatus] || {
    label: order.status?.toUpperCase(),
    color: "default",
    icon: <ClockCircleOutlined />,
    step: 0,
  };

  const paymentMethod = order?.Payment?.method?.toUpperCase() || order?.payment_method?.toUpperCase() || "COD";
  const paymentStatus = order?.Payment?.status || "pending";
  const paymentColor = paymentStatus === "paid" ? "green" : paymentStatus === "failed" ? "red" : "orange";
  const paymentStatusText = paymentStatus === "paid" ? "ĐÃ THANH TOÁN" : paymentStatus === "failed" ? "THẤT BẠI" : "CHỜ THANH TOÁN";

  const getImage = (item) => {
    const rawImg = 
      item.product_thumbnail || 
      item.image || 
      item.thumbnail || 
      item.Variant?.image || 
      item.Variant?.Product?.thumbnail ||
      item.Product?.thumbnail ||
      item.product?.image;

    if (!rawImg) return "https://placehold.co/100x100?text=No+Image";
    if (rawImg.startsWith("http")) return rawImg;
    const cleanPath = rawImg.startsWith("/") ? rawImg.substring(1) : rawImg;
    return `${API_URL}/${cleanPath}`;
  };

  const renderAttributes = (item) => {
    const variant = item?.Variant || item?.variant || item;
    const attrs = variant?.AttributeValues || variant?.attribute_values || item?.AttributeValues || [];

    if (Array.isArray(attrs) && attrs.length > 0) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: 4 }}>
          {attrs.map((a, index) => {
            const label = a?.Attribute?.name || a?.attribute?.name || "Thuộc tính";
            const value = a?.value || "N/A";
            // Sử dụng ID thuộc tính làm key, nếu không có mới dùng index
            const attrKey = a.id || `attr-${index}`; 
            return (
              <Tag key={attrKey} color="blue" style={{ fontSize: 10, margin: 0, borderRadius: 4 }}>
                {label}: {value}
              </Tag>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const handleTrackShipment = () => {
    if (shipmentId) {
      navigate(`/shipment/${shipmentId}`);
      if (onClose) onClose();
    }
  };

  return (
    <Modal
      open={!!order}
      onCancel={onClose}
      footer={[
        <Button key="close-btn" onClick={onClose} style={{ borderRadius: 6 }}>
          Đóng
        </Button>,
        <Tooltip key="track-tip" title={!shipmentId ? "Đơn hàng chưa được tạo vận đơn" : "Theo dõi lộ trình giao hàng"}>
          <Button 
            type="primary" 
            icon={<CarOutlined />} 
            onClick={handleTrackShipment}
            style={{ 
              borderRadius: 6, 
              background: shipmentId ? '#722ed1' : '#bfbfbf', 
              borderColor: shipmentId ? '#722ed1' : '#bfbfbf' 
            }}
            disabled={!shipmentId || currentStatus === 'cancelled'}
          >
            Theo dõi vận chuyển
          </Button>
        </Tooltip>
      ]}
      width={1000}
      centered
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Text strong style={{ fontSize: 18 }}>Chi tiết đơn hàng #{order.id}</Text>
          <Tag color={displayInfo.color} icon={displayInfo.icon} style={{ borderRadius: 4, padding: "2px 10px", fontWeight: 600 }}>
            {displayInfo.label}
          </Tag>
        </div>
      }
    >
      {!["cancelled", "returned"].includes(currentStatus) && (
        <Steps
          size="small"
          current={displayInfo.step}
          style={{ marginBottom: 32, marginTop: 16, padding: "0 20px" }}
          items={[
            { title: "Thanh toán", icon: <WalletOutlined /> },
            { title: "Chờ xác nhận", icon: <SyncOutlined /> },
            { title: "Xác nhận", icon: <CheckCircleOutlined /> },
            { title: "Đang giao", icon: <CarOutlined /> },
            { title: "Hoàn tất", icon: <HomeOutlined /> },
          ]}
        />
      )}

      <Row gutter={24}>
        <Col span={15}>
          <Card
            title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><GiftOutlined /> <span>Sản phẩm đã đặt</span></div>}
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
            styles={{ body: { maxHeight: 550, overflowY: "auto", padding: "0 24px" } }}
          >
            {order.OrderItems?.map((item, index) => {
              const isCombo = !!item.bundle_id || (item.bundles && item.bundles.length > 0);
              // Đảm bảo key duy nhất bằng cách kết hợp ID và index
              const itemKey = item.id ? `item-${item.id}` : `idx-${index}`;

              return (
                <div key={itemKey}>
                  <Row gutter={16} align="top" style={{ padding: "20px 0" }}>
                    {!isCombo && (
                      <Col>
                        <img
                          src={getImage(item)}
                          alt="product"
                          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: '1px solid #eee' }}
                        />
                      </Col>
                    )}

                    <Col flex="auto">
                      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                        {isCombo && <Tag color="cyan" style={{ marginBottom: 4 }}>Combo</Tag>}
                        {item.product_name || "Sản phẩm không tên"}
                      </div>
                      
                      {isCombo ? (
                        <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: 8, marginTop: 8, border: '1px solid #f0f0f0' }}>
                          <Text type="secondary" strong style={{ fontSize: 11, display: 'block', marginBottom: 10, color: '#8c8c8c' }}>
                            CHI TIẾT COMBO:
                          </Text>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {item.bundles?.map((subItem, bIdx) => (
                              <div key={subItem.id || `sub-${index}-${bIdx}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                <Avatar 
                                  shape="square" 
                                  size={45} 
                                  src={getImage(subItem)} 
                                  style={{ borderRadius: 6, border: '1px solid #e8e8e8', backgroundColor: '#fff', flexShrink: 0 }}
                                />
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 13, fontWeight: 500, color: '#262626' }}>
                                    {subItem.name || subItem.product_name}
                                  </div>
                                  {renderAttributes(subItem)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        renderAttributes(item)
                      )}
                    </Col>
                    
                    <Col style={{ textAlign: "right" }}>
                      <Text type="secondary">x{item.quantity}</Text><br />
                      <Text strong style={{ fontSize: 15 }}>{formatPrice(item.price)}</Text>
                    </Col>
                  </Row>
                  {index < order.OrderItems.length - 1 && <Divider style={{ margin: 0 }} />}
                </div>
              );
            })}
          </Card>
        </Col>

        <Col span={9}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card size="small" title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><UserOutlined /> Thông tin nhận hàng</div>} style={{ borderRadius: 12 }}>
              {addr || order.full_name ? (
                <div style={{ padding: "8px 4px" }}>
                  <Text strong style={{ fontSize: 15 }}>{addr?.full_name || order.full_name || "N/A"}</Text>
                  <br />
                  <Text type="secondary">{addr?.phone || order.phone || "N/A"}</Text>
                  <Divider style={{ margin: "12px 0" }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <HomeOutlined style={{ marginRight: 8, marginTop: 4, color: '#8c8c8c' }} />
                    <Text>
                      {addr ? (
                        <>
                          {addr.address_detail || addr.address}
                          <br />
                          <span style={{ color: '#595959', fontSize: 13 }}>
                            {[addr.ward, addr.district, addr.province].filter(Boolean).join(", ")}
                          </span>
                        </>
                      ) : (
                        <>{order.address_detail || order.address}</>
                      )}
                    </Text>
                  </div>
                </div>
              ) : (
                <Text type="secondary">Không tìm thấy địa chỉ</Text>
              )}
            </Card>

            <Card size="small" style={{ borderRadius: 12, background: "#fafafa", border: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Tag color="volcano" style={{ fontWeight: 500 }}>PTTT: {paymentMethod}</Tag>
                <Tag color={paymentColor} style={{ fontWeight: 500 }}>{paymentStatusText}</Tag>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text type="secondary">Tạm tính:</Text>
                <Text>{formatPrice(order.total || order.total_price)}</Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text type="secondary">Phí vận chuyển:</Text>
                <Text>{formatPrice(order.shipping_fee || 0)}</Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text type="secondary">Khuyến mãi:</Text>
                <Text style={{ color: "#52c41a" }}>-{formatPrice(order.discount_total || 0)}</Text>
              </Row>
              <Divider style={{ margin: "16px 0" }} />
              <Row justify="space-between" align="middle">
                <Text strong style={{ fontSize: 16 }}>Thành tiền:</Text>
                <Title level={3} style={{ margin: 0, color: "#ff4d4f" }}>{formatPrice(order.grand_total)}</Title>
              </Row>
              
              {shipmentId && (
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>MÃ VẬN ĐƠN: </Text>
                  <Text code>{shipmentId}</Text>
                </div>
              )}
            </Card>
          </div>
        </Col>
      </Row>
    </Modal>
  );
}