import React from "react";
import { Typography, Tag } from "antd";
import dayjs from "dayjs";

const { Text, Title } = Typography;

function VoucherCard({ voucher }) {
  const isShipping = voucher.type === "shipping";

  const renderDiscount = () => {
    if (voucher.discount_type === "percent") return `${voucher.discount_value || 0}%`;
    return `${((voucher.discount_value || 0) / 1000).toLocaleString()}k`;
  };

  const renderStatus = () => {
    // Thay đổi bordered={false} thành variant="filled" hoặc variant="borderless"
    return voucher.is_used ? (
      <Tag variant="filled" color="default">
        Đã dùng
      </Tag>
    ) : (
      <Tag variant="filled" color="processing">
        Đang có
      </Tag>
    );
  };

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
      border: "1px solid #f0f0f0",
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
      position: "relative",
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
      zIndex: 2,
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.leftSide}>
        <Title level={2} style={{ color: "#fff", margin: 0, fontSize: 24 }}>
          {renderDiscount()}
        </Title>
        <Text
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          {isShipping ? "VẬN CHUYỂN" : "GIẢM GIÁ"}
        </Text>
      </div>

      <div style={styles.rightSide}>
        <div style={{ ...styles.notch, top: -9 }} />
        <div style={{ ...styles.notch, bottom: -9 }} />

        <div style={{ marginBottom: 4 }}>
          {renderStatus()}
          <Text strong style={{ fontSize: 15, marginLeft: 4 }}>
            {voucher.name}
          </Text>
        </div>

        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Đơn tối thiểu:{" "}
            <b>{Number(voucher.min_order_value || 0).toLocaleString()}đ</b>
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            HSD:{" "}
            {voucher.end_date
              ? dayjs(voucher.end_date).format("DD.MM.YYYY")
              : "-"}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default VoucherCard;