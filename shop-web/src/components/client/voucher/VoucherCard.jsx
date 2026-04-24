import React from "react";
import { Typography, Tag, Button, Space } from "antd";
import dayjs from "dayjs";

const { Text, Title } = Typography;

function VoucherCard({ voucher, onDetail, onReceive }) {
  const isShipping = voucher.type === "shipping";

  const renderDiscount = () => {
    if (voucher.discount_type === "percent") return `${voucher.discount_value}%`;
    return `${(voucher.discount_value / 1000).toLocaleString()}k`;
  };

  const renderStatus = () => {
    // Sửa: Dùng variant="filled" thay cho bordered={false}
    if (voucher.status === "used") 
      return <Tag variant="filled" color="default">Đã dùng</Tag>;
    if (voucher.status === "expired") 
      return <Tag variant="filled">Hết hạn</Tag>;
    if (voucher.user_id) 
      return <Tag variant="filled" color="processing">Đã nhận</Tag>;
    
    return <Tag variant="filled" color="success">Có thể nhận</Tag>;
  };

  // Styles cấu hình sẵn
  const styles = {
    card: {
      display: "flex",
      borderRadius: 12,
      overflow: "visible", 
      background: "#fff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      marginBottom: 16,
      position: "relative",
      border: "1px solid #f0f0f0"
    },
    leftSide: {
      width: 110,
      background: isShipping
        ? "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)"
        : "linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: 10,
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
      position: "relative"
    },
    rightSide: {
      flex: 1,
      padding: "12px 16px",
      position: "relative",
      borderLeft: "2px dashed #f0f0f0",
      backgroundColor: "#fff",
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    },
    notch: {
      position: "absolute",
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: "#f5f5f5", 
      left: -9,
      border: "1px solid #f0f0f0",
      zIndex: 2
    }
  };

  return (
    <div 
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
      }}
    >
      {/* PHẦN TRÁI */}
      <div style={styles.leftSide}>
        <Title level={2} style={{ color: "#fff", margin: 0, fontSize: 24 }}>
          {renderDiscount()}
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
          {isShipping ? "VẬN CHUYỂN" : "GIẢM GIÁ"}
        </Text>
      </div>

      {/* PHẦN PHẢI */}
      <div style={styles.rightSide}>
        <div style={{ ...styles.notch, top: -9 }} />
        <div style={{ ...styles.notch, bottom: -9 }} />

        <div style={{ marginBottom: 4 }}>
          {renderStatus()}
          <Text strong style={{ fontSize: 15, marginLeft: 4 }}>{voucher.name}</Text>
        </div>

        {/* SỬA TẠI ĐÂY: 
          Thay direction="vertical" bằng orientation="vertical" 
          để khớp với yêu cầu của phiên bản antd bạn đang dùng.
        */}
        <Space orientation="vertical" size={0} style={{ display: 'flex' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Đơn tối thiểu: <b>{Number(voucher.min_order_value).toLocaleString()}đ</b>
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            HSD: {dayjs(voucher.end_date).format("DD.MM.YYYY")}
          </Text>
        </Space>

        <div style={{ 
          marginTop: 12, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <Text code style={{ fontSize: 11 }}>{voucher.code}</Text>
          
          {/* Với Space ngang (mặc định), chúng ta để nguyên 
             hoặc thêm orientation="horizontal" nếu cần.
          */}
          <Space>
            <Button size="small" type="text" onClick={onDetail} style={{ fontSize: 12 }}>
              Chi tiết
            </Button>
            
            {!voucher.user_id && voucher.status !== "expired" ? (
              <Button
                type="primary"
                size="small"
                shape="round"
                style={{
                    background: !isShipping ? "#ff4d4f" : "#1890ff",
                    border: "none"
                }}
                onClick={() => onReceive(voucher)}
              >
                Lưu mã
              </Button>
            ) : (
              <Button size="small" shape="round" disabled={voucher.status === "used"}>
                {voucher.status === "used" ? "Đã dùng" : "Dùng ngay"}
              </Button>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
}

export default VoucherCard;