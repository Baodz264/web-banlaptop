// components/client/checkout/CheckoutPayment.jsx
import React, { useEffect } from "react";
import { Card, Radio, Typography, Row, Col } from "antd";
import { CreditCardOutlined, WalletOutlined, MoneyCollectOutlined, PayCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

// map icon cho phương thức
const paymentIcons = {
  COD: <MoneyCollectOutlined style={{ fontSize: 24 }} />,
  VNPay: <CreditCardOutlined style={{ fontSize: 24 }} />,
  MoMo: <WalletOutlined style={{ fontSize: 24 }} />,
  Paypal: <PayCircleOutlined style={{ fontSize: 24 }} />,
};

const CheckoutPayment = ({
  payments = [],
  selectedPayment,
  setSelectedPayment,
}) => {
  // Chọn mặc định payment đầu tiên nếu chưa có
  useEffect(() => {
    if (!selectedPayment && payments.length > 0) {
      setSelectedPayment(payments[0]);
    }
  }, [payments, selectedPayment, setSelectedPayment]);

  return (
    <Card
      title={`Phương thức thanh toán (${payments.length})`}
      style={{ marginTop: 24, borderRadius: 8 }}
      size="small"
    >
      <Radio.Group
        style={{ width: "100%" }}
        onChange={(e) => {
          const selected = payments.find(p => String(p.method) === String(e.target.value));
          setSelectedPayment(selected || null);
        }}
        value={selectedPayment?.method || undefined}
      >
        <Row gutter={[12, 12]}>
          {payments.map((p) => {
            const isSelected = selectedPayment?.method === p.method;
            return (
              <Col xs={24} sm={12} key={p.id}>
                <div
                  style={{
                    border: isSelected ? "2px solid #1890ff" : "1px solid #d9d9d9",
                    borderRadius: 8,
                    padding: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s",
                    background: isSelected ? "#e6f7ff" : "#fff",
                  }}
                  onClick={() => setSelectedPayment(p)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {paymentIcons[p.method] || null}
                    <Text strong>{p.method}</Text>
                  </div>
                  <Text type={
                    p.status === "paid" ? "success" :
                    p.status === "pending" ? "warning" :
                    "danger"
                  } style={{ fontSize: 12 }}>
                    {p.status === "paid" ? "Đã thanh toán" :
                     p.status === "pending" ? "Chưa thanh toán" :
                     p.status === "failed" ? "Thất bại" : "Hoàn tiền"}
                  </Text>
                </div>
              </Col>
            );
          })}
        </Row>
      </Radio.Group>
    </Card>
  );
};

export default CheckoutPayment;
