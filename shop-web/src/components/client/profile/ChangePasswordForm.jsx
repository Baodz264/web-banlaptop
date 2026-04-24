import { Form, Input, Button } from "antd";
import { useState } from "react";
import authService from "../../../services/auth.service"; 
import { useToast } from "../../../context/ToastProvider";

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // 🔹 SỬA CHO KHỚP POSTMAN
      const payload = {
        oldPassword: values.current_password,
        newPassword: values.new_password,
      };

      const res = await authService.changePassword(payload);

      toast.success(res?.message || "Đổi mật khẩu thành công");
      form.resetFields();
    } catch (err) {
      console.error("Change password error:", err);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đổi mật khẩu thất bại";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Mật khẩu hiện tại"
        name="current_password"
        rules={[{ required: true, message: "Nhập mật khẩu hiện tại" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Mật khẩu mới"
        name="new_password"
        rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Xác nhận mật khẩu mới"
        name="confirm_password"
        dependencies={["new_password"]}
        rules={[
          { required: true, message: "Xác nhận mật khẩu mới" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("new_password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Mật khẩu xác nhận không khớp")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Đổi mật khẩu
        </Button>
      </Form.Item>
    </Form>
  );
}
