import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403"
      subTitle="Bạn không có quyền truy cập trang này."
      extra={
        <Button type="primary" onClick={() => navigate("/admin")}>
          Về trang chủ
        </Button>
      }
    />
  );
};

export default Forbidden;
