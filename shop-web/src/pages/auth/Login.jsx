import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Divider } from "antd";
import {
  GoogleOutlined,
  FacebookFilled,
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastProvider";

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

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
      const res = await login({
        ...values,
        captchaToken,
      });

      toast.success(res.message || "Chào mừng bạn quay trở lại!");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Email hoặc mật khẩu không đúng"
      );

      // 🔥 reset captcha khi fail
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  const API_URL =
    process.env.REACT_APP_API_URL || "http://tbtshoplt.xyz/api";

  const loginGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const loginFacebook = () => {
    window.location.href = `${API_URL}/auth/facebook`;
  };

  return (
    <div style={containerStyle}>
      <div style={circleStyle1}></div>
      <div style={circleStyle2}></div>

      <Card style={cardStyle} styles={{ body: { padding: "40px 30px" } }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={logoPlaceholder}>
            <LockOutlined style={{ fontSize: 28, color: "#fff" }} />
          </div>

          <Title level={2} style={{ margin: "12px 0 4px 0" }}>
            Chào mừng trở lại!
          </Title>

          <Text type="secondary">Vui lòng đăng nhập để tiếp tục</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit} size="large">
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
              placeholder="Email của bạn"
              style={inputStyle}
            />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              style={inputStyle}
            />
          </Form.Item>

          {/* 🔥 RECAPTCHA */}
          <div style={{ marginBottom: 10 }}>
            <ReCAPTCHA
              sitekey="6Lfz5LEsAAAAAB-OVrXJHWXp-INX9-WdCSv1HQC_"
              onChange={(value) => {
                setCaptchaToken(value);
                setCaptchaError(false);
              }}
              onExpired={() => setCaptchaToken("")}
            />
          </div>

          {/* lỗi captcha */}
          {captchaError && (
            <div style={{ color: "red", fontSize: 12, marginBottom: 10 }}>
              Vui lòng xác nhận reCAPTCHA
            </div>
          )}

          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              block
              style={loginBtnStyle}
              icon={<ArrowRightOutlined />}
            >
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>

        <Divider>HOẶC</Divider>

        {/* SOCIAL LOGIN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Button
            icon={<GoogleOutlined />}
            onClick={loginGoogle}
            block
            style={socialBtnStyle}
          >
            Tiếp tục với Google
          </Button>

          <Button
            icon={<FacebookFilled />}
            onClick={loginFacebook}
            block
            style={socialBtnStyle}
          >
            Tiếp tục với Facebook
          </Button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Text>Chưa có tài khoản? </Text>
          <Link to="/register" style={{ fontWeight: 600 }}>
            Đăng ký
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
  background: "linear-gradient(135deg,#667eea,#764ba2)",
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
  background: "rgba(255,255,255,0.95)",
};

const logoPlaceholder = {
  width: 60,
  height: 60,
  background: "linear-gradient(135deg,#1890ff,#003a8c)",
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

const loginBtnStyle = {
  height: 48,
  borderRadius: 12,
  fontWeight: 600,
};

const socialBtnStyle = {
  height: 46,
  borderRadius: 12,
};

export default Login;
