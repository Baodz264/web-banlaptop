import React from "react";
import { Card, Tag, Descriptions } from "antd";
import {
  CreditCardOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

const PaymentInfo = ({ payment }) => {
  if (!payment) return null;

  const statusColor = {
    pending: "orange",
    paid: "green",
    failed: "red",
    refunded: "purple"
  };

  const statusText = {
    pending: "Chờ thanh toán",
    paid: "Đã thanh toán",
    failed: "Thanh toán thất bại",
    refunded: "Đã hoàn tiền"
  };

  const methodText = {
    cod: "Thanh toán khi nhận hàng (COD)",
    vnpay: "VNPay",
    momo: "MoMo",
    paypal: "Paypal",
    stripe: "Stripe"
  };

  return (
    <Card
      title="Thông tin thanh toán"
      style={{ marginTop: 20 }}
      /* Thay thế bordered={false} bằng variant="none" để sửa lỗi warning */
      variant="none"
    >
      <Descriptions
        column={1}
        bordered
        size="middle"
      >
        <Descriptions.Item
          label={
            <>
              <CreditCardOutlined style={{ marginRight: 8 }} /> Phương thức thanh toán
            </>
          }
        >
          {methodText[payment.method] || payment.method || "Không xác định"}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <CheckCircleOutlined style={{ marginRight: 8 }} /> Trạng thái thanh toán
            </>
          }
        >
          <Tag color={statusColor[payment.status] || "default"}>
            {statusText[payment.status] || payment.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default PaymentInfo;