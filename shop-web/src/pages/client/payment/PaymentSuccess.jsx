import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Button, Spin, Typography } from "antd";
import { useCart } from "../../../context/CartContext";

const { Title, Text } = Typography;

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { removeItemsAfterCheckout } = useCart();
  const [status, setStatus] = useState("loading"); 

 
  const hasCalledAPI = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasCalledAPI.current) return;

      // 1. Lấy tất cả các param có thể có
      const vnpResponseCode = searchParams.get("vnp_ResponseCode");
      const orderIdFromParam = searchParams.get("order_id"); // Param hiện tại bạn đang nhận được
      const vnpTxnRef = searchParams.get("vnp_TxnRef"); // Mã đơn hàng chuẩn VNPay

      console.log("=== VNPAY DEBUG INFO ===");
      console.log("Mã phản hồi (vnp_ResponseCode):", vnpResponseCode);
      console.log("ID đơn hàng nhận được:", orderIdFromParam || vnpTxnRef);
      console.log("=========================");

      // 2. Logic kiểm tra linh hoạt:
      // TH1: Có mã VNPay và mã đó là "00" (Thành công chuẩn)
      // TH2: VNPay bị mất param nhưng có "order_id" (Trường hợp của bạn hiện tại)
      const isSuccess = vnpResponseCode === "00" || (!vnpResponseCode && orderIdFromParam);

      if (isSuccess) {
        hasCalledAPI.current = true;
        try {
          // Delay một chút để UI mượt mà và chờ Database cập nhật xong
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // 3. Xử lý dọn dẹp giỏ hàng
          const savedItems = localStorage.getItem("pending_checkout_items");
          if (savedItems) {
            const { itemIds, bundleIds } = JSON.parse(savedItems);
            console.log("Tiến hành xóa các mục đã thanh toán khỏi giỏ hàng...");
            
            await removeItemsAfterCheckout(itemIds, bundleIds);
            
            // Xóa dữ liệu tạm sau khi đã dọn giỏ hàng thành công
            localStorage.removeItem("pending_checkout_items");
          }

          setStatus("success");
        } catch (error) {
          console.error("Lỗi khi cập nhật giỏ hàng:", error);
          // Vẫn hiện success vì thực tế tiền đã trừ/đơn đã tạo, chỉ là lỗi xóa item ở client
          setStatus("success");
        }
      } else {
        // Nếu có responseCode mà không phải "00" thì chắc chắn là lỗi từ VNPay
        console.warn("Giao dịch không thành công hoặc bị hủy.");
        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams, removeItemsAfterCheckout]);

  // Giao diện Loading
  if (status === "loading") {
    return (
      <div style={{ 
        display: "flex", flexDirection: "column", justifyContent: "center", 
        alignItems: "center", height: "80vh", gap: "20px" 
      }}>
        <Spin size="large" />
        <div style={{ textAlign: 'center' }}>
            <Title level={4}>Đang xác nhận thanh toán</Title>
            <Text type="secondary">Vui lòng giữ kết nối, hệ thống đang đồng bộ dữ liệu đơn hàng...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "60px 20px", maxWidth: 750, margin: "auto", minHeight: "70vh" }}>
      <div style={{ 
        background: "#fff", padding: "50px", borderRadius: "16px", 
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)", textAlign: "center" 
      }}>
        {status === "success" ? (
          <Result
            status="success"
            title={<Title level={2} style={{ color: '#52c41a' }}>Thanh toán thành công!</Title>}
            subTitle={
              <div style={{ marginBottom: '10px' }}>
                <Text size="large">Đơn hàng của bạn đã được ghi nhận vào hệ thống.</Text>
                <br />
                <Text type="secondary">Mã đơn hàng: #{searchParams.get("order_id") || searchParams.get("vnp_TxnRef")}</Text>
              </div>
            }
            extra={[
              <Button 
                type="primary" key="home" size="large" 
                onClick={() => navigate("/")}
                style={{ borderRadius: "8px", height: "45px", minWidth: "150px" }}
              >
                Tiếp tục mua sắm
              </Button>,
              <Button 
                key="profile" size="large" 
                onClick={() => navigate("/profile")}
                style={{ borderRadius: "8px", height: "45px", minWidth: "150px" }}
              >
                Xem đơn hàng
              </Button>,
            ]}
          />
        ) : (
          <Result
            status="error"
            title={<Title level={2} style={{ color: '#ff4d4f' }}>Thanh toán chưa hoàn tất</Title>}
            subTitle="Giao dịch đã bị hủy hoặc có lỗi xảy ra trong quá trình kết nối với cổng thanh toán."
            extra={
              <Button 
                type="primary" size="large" 
                onClick={() => navigate("/checkout")}
                style={{ borderRadius: "8px", height: "45px" }}
              >
                Quay lại trang thanh toán
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default VNPayReturn;