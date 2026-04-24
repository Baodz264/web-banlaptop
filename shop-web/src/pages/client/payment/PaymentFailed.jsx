import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="error"
      title="Thanh toán thất bại ❌"
      subTitle="Có lỗi xảy ra hoặc bạn đã hủy thanh toán"
      extra={[
        <Button 
          key="retry-btn" 
          type="primary" 
          onClick={() => navigate("/checkout")}
        >
          Thử lại
        </Button>,
        <Button 
          key="home-btn" 
          onClick={() => navigate("/")}
        >
          Trang chủ
        </Button>,
      ]}
    />
  );
};

export default PaymentFailed;