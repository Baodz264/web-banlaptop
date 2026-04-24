import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Row,
  Col,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  MailOutlined,
  LockOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useToast } from "../../context/ToastProvider";
import authService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function ForgotPassword() {
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  /* ================= STEP 1: GỬI EMAIL ================= */
  const handleEmailSubmit = async (values) => {
    setLoading(true);
    try {
      const targetEmail = values.email || email;
      await authService.forgotPassword(targetEmail);

      setEmail(targetEmail);
      setStep(2);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);

      // Focus vào ô đầu tiên sau khi chuyển step
      setTimeout(() => inputRefs.current[0]?.focus(), 100);

      toast.success("Mã OTP đã được gửi!");
    } catch (error) {
      toast.error(error.message || "Không thể gửi OTP!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= XỬ LÝ OTP ================= */
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(data)) {
      const newOtp = data.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  /* ================= STEP 2: XÁC NHẬN OTP ================= */
  const handleOtpSubmit = async () => {
    const fullOtp = otp.join("");

    if (fullOtp.length < 6) {
      toast.error("Nhập đủ 6 số OTP!");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp({
        email,
        otp: fullOtp,
      });

      toast.success("OTP chính xác!");
      setStep(3);
    } catch (error) {
      toast.error(error.message || "OTP sai hoặc hết hạn!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 3: ĐỔI MẬT KHẨU ================= */
  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      await authService.resetPassword({
        email: email,
        otp: otp.join(""),
        newPassword: values.newPassword,
      });

      toast.success("Đổi mật khẩu thành công!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Lỗi khi đổi mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <Spin spinning={loading} indicator={antIcon}>
          {step > 1 && (
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => setStep(step - 1)}
              disabled={loading}
              style={{ padding: 0, marginBottom: 16 }}
            >
              Quay lại
            </Button>
          )}

          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Title level={3} style={{ color: "#1890ff" }}>
              Quên mật khẩu
            </Title>
            <Text type="secondary">
              {step === 1 && "Nhập email để nhận OTP"}
              {step === 2 && `Nhập OTP gửi đến ${email}`}
              {step === 3 && "Nhập mật khẩu mới"}
            </Text>
          </div>

          {/* STEP 1: NHẬP EMAIL */}
          {step === 1 && (
            <Form layout="vertical" onFinish={handleEmailSubmit}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input prefix={<MailOutlined />} size="large" placeholder="Email của bạn" />
              </Form.Item>

              <Button type="primary" htmlType="submit" block size="large">
                Gửi OTP
              </Button>
            </Form>
          )}

          {/* STEP 2: NHẬP OTP */}
          {step === 2 && (
            <div style={{ textAlign: "center" }}>
              <Row gutter={8} justify="center" style={{ marginBottom: 24 }}>
                {otp.map((val, idx) => (
                  <Col key={idx}>
                    <Input
                      ref={(el) => (inputRefs.current[idx] = el)}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      maxLength={1}
                      style={otpInputStyle}
                    />
                  </Col>
                ))}
              </Row>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={handleOtpSubmit}
                  loading={loading}
                >
                  Xác nhận OTP
                </Button>

                <Button
                  type="link"
                  disabled={countdown > 0}
                  onClick={() => handleEmailSubmit({ email })}
                >
                  {countdown > 0
                    ? `Gửi lại sau ${countdown}s`
                    : "Gửi lại OTP"}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: MẬT KHẨU MỚI */}
          {step === 3 && (
            <Form layout="vertical" onFinish={handleResetPassword}>
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: "Nhập mật khẩu!" },
                  { min: 6, message: "Tối thiểu 6 ký tự" },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} size="large" />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Xác nhận mật khẩu"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} size="large" />
              </Form.Item>

              <Button type="primary" htmlType="submit" block size="large">
                Đổi mật khẩu
              </Button>
            </Form>
          )}
        </Spin>
      </Card>
    </div>
  );
}

/* STYLE */
const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f0f2f5",
};

const cardStyle = {
  width: 420,
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

const otpInputStyle = {
  width: 45,
  height: 50,
  textAlign: "center",
  fontSize: 22,
  fontWeight: "bold",
  borderRadius: 8,
};

export default ForgotPassword;