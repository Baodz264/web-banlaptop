import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  Space,
} from "antd";
import {
  GoogleOutlined,
  FacebookFilled,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate, Link } from "react-router-dom";

import axiosClient from "../../services/axios.config";
import { useToast } from "../../context/ToastProvider";

const { Title, Text } = Typography;

function Register() {
  const navigate = useNavigate();
  const toast = useToast();

  const recaptchaRef = useRef();

  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const handleSubmit = async (values) => {
    if (!captchaToken) {
      setCaptchaError(true);
      toast.error("Vui lòng xác nhận reCAPTCHA");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/register", {
        ...values,
        captchaToken,
      });

      toast.success(
        res?.data?.message || "Đăng ký thành công!"
      );

      navigate("/login", { replace: true });

    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Đăng ký thất bại"
      );

      // 🔥 reset captcha khi lỗi
      setCaptchaToken("");
      recaptchaRef.current?.reset();

    } finally {
      setLoading(false);
    }
  };

  const API_URL =
    process.env.REACT_APP_API_URL || "http://tbtshoplt.xyz/api";

  return (
    <div style={containerStyle}>
      <div style={circleStyle1}></div>
      <div style={circleStyle2}></div>

      <Card
        style={cardStyle}
        styles={{ body: { padding: "40px 30px" } }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={logoPlaceholder}>
            <UserAddOutlined style={{ fontSize: 28, color: "#fff" }} />
          </div>

          <Title level={2} style={{ margin: "12px 0 4px 0" }}>
            Tạo tài khoản
          </Title>

          <Text type="secondary">
            Tham gia cùng chúng tôi ngay hôm nay!
          </Text>
        </div>

        {/* FORM */}
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          requiredMark={false}
        >
          {/* NAME */}
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập họ tên" },
              { min: 2, message: "Tên quá ngắn" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
              style={inputStyle}
            />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              style={inputStyle}
            />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải từ 6 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              style={inputStyle}
            />
          </Form.Item>

          {/* CAPTCHA */}
          <div style={{ marginBottom: 10 }}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6Lfz5LEsAAAAAB-OVrXJHWXp-INX9-WdCSv1HQC_"
              onChange={(value) => {
                setCaptchaToken(value);
                setCaptchaError(false);
              }}
              onExpired={() => {
                setCaptchaToken("");
                setCaptchaError(true);
              }}
            />
          </div>

          {captchaError && (
            <div style={{ color: "red", fontSize: 12, marginBottom: 10 }}>
              Vui lòng xác nhận reCAPTCHA
            </div>
          )}

          {/* BUTTON */}
          <Form.Item style={{ marginTop: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading || !captchaToken}
              block
              style={registerBtnStyle}
            >
              ĐĂNG KÝ
            </Button>
          </Form.Item>
        </Form>

        {/* DIVIDER */}
        <Divider plain>
          <Text type="secondary" style={{ fontSize: 12 }}>
            HOẶC ĐĂNG KÝ VỚI
          </Text>
        </Divider>

        {/* SOCIAL */}
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Button
            icon={<GoogleOutlined style={{ color: "#EA4335" }} />}
            block
            style={socialBtnStyle}
            onClick={() =>
              (window.location.href = `${API_URL}/auth/google`)
            }
          >
            Tiếp tục với Google
          </Button>

          <Button
            icon={<FacebookFilled style={{ color: "#1877F2" }} />}
            block
            style={socialBtnStyle}
            onClick={() =>
              (window.location.href = `${API_URL}/auth/facebook`)
            }
          >
            Tiếp tục với Facebook
          </Button>
        </Space>

        {/* LOGIN LINK */}
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Text type="secondary">Đã có tài khoản? </Text>
          <Link to="/login" style={{ fontWeight: 600 }}>
            Đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  );
}

/* ===== STYLE ===== */

const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  position: "relative",
  overflow: "hidden",
};

const circleStyle1 = {
  position: "absolute",
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  top: "-100px",
  right: "-100px",
  opacity: 0.1,
};

const circleStyle2 = {
  position: "absolute",
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  background: "#1890ff",
  bottom: "-50px",
  left: "-50px",
  opacity: 0.1,
};

const cardStyle = {
  width: 420,
  borderRadius: 24,
  border: "none",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  background: "rgba(255, 255, 255, 0.95)",
};

const logoPlaceholder = {
  width: 60,
  height: 60,
  background: "linear-gradient(135deg, #52c41a 0%, #237804 100%)",
  borderRadius: 16,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto",
};

const inputStyle = {
  borderRadius: 10,
  padding: "10px 12px",
};

const registerBtnStyle = {
  height: 50,
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  background: "linear-gradient(90deg, #1890ff, #40a9ff)",
  border: "none",
};

const socialBtnStyle = {
  height: 48,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 500,
  borderColor: "#f0f0f0",
};

export default Register;
