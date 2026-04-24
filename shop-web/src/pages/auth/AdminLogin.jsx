import React, { useState, useRef } from "react";
import { Card, Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";

import { useToast } from "../../context/ToastProvider";
import { useAuth } from "../../context/AuthContext";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  const recaptchaRef = useRef();

  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const onFinish = async (values) => {
    if (!captchaToken) {
      setCaptchaError(true);
      toast.error("Vui lòng xác nhận reCAPTCHA");
      return;
    }

    setLoading(true);

    try {
      await login({
        ...values,
        captchaToken,
      });

      const currentUser =
        JSON.parse(localStorage.getItem("user"));

      if (!currentUser) {
        toast.error("Không lấy được thông tin người dùng!");
        return;
      }

      // ✅ CHO PHÉP ADMIN + STAFF
      const allowedRoles = ["admin", "staff"];

      if (!allowedRoles.includes(currentUser.role)) {
        toast.error("Bạn không có quyền truy cập hệ thống!");
        return;
      }

      toast.success("Đăng nhập thành công!");

      // 👉 cả admin + staff đều vào /admin
      navigate("/admin", { replace: true });

    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập thất bại"
      );

      setCaptchaToken("");
      recaptchaRef.current?.reset();

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <Card style={card}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Admin Login
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              disabled={loading || !captchaToken}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
};

const card = {
  width: 380,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

export default Login;
