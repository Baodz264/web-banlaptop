import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const CartEmpty = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="info"
      title="Giỏ hàng của bạn đang trống"
      extra={<Button type="primary" onClick={() => navigate("/product")}>Tiếp tục mua sắm</Button>}
    />
  );
};

export default CartEmpty;
