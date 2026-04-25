import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, HomeOutlined } from "@ant-design/icons";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1f1c2c, #928dab)",
        padding: 20,
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "#fff",
          padding: "40px 30px",
          borderRadius: 16,
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* ICON */}
        <div style={{ fontSize: 70, color: "#ff4d4f", marginBottom: 10 }}>
          <LockOutlined />
        </div>

        {/* TITLE */}
        <h1 style={{ fontSize: 42, margin: 0, color: "#ff4d4f" }}>403</h1>

        {/* SUBTITLE */}
        <h3 style={{ marginTop: 10, color: "#333" }}>
          Không có quyền truy cập
        </h3>

        <p style={{ color: "#777", marginBottom: 30 }}>
          Bạn không có quyền vào trang này. Vui lòng liên hệ quản trị viên nếu
          cần quyền truy cập.
        </p>

        {/* BUTTON */}
        <Button
          type="primary"
          size="large"
          icon={<HomeOutlined />}
          onClick={() => navigate("/admin")}
          style={{
            borderRadius: 8,
            height: 42,
            width: "100%",
            fontWeight: 500,
          }}
        >
          Về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default Forbidden;
