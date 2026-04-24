import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Form,
  Input,
  Select,
  Button
} from "antd";

import NotificationService from "../../../services/notification.service";
import userService from "../../../services/user.service";
import socket from "../../../socket/socket";

import { useToast } from "../../../context/ToastProvider";

const { Option } = Select;

const Add = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getUsers();
        setUsers(res?.data?.data?.items || []);
      } catch (error) {
        // Thêm toast vào dependency để hết lỗi ESLint
        toast.error("Không tải được danh sách user");
      }
    };

    fetchUsers();
  }, [toast]); // <--- Đã thêm 'toast' vào đây

  const onFinish = async (values) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await NotificationService.createNotification(values);
      const newNotification = res?.data?.data;

      if (newNotification) {
        socket.emit("send_notification", newNotification);
      }

      toast.success("Tạo thông báo thành công");
      form.resetFields();

      setTimeout(() => {
        navigate("/admin/notifications");
      }, 500);
    } catch (error) {
      toast.error("Tạo thông báo thất bại");
    }

    setLoading(false);
  };

  return (
    <Card title="Thêm thông báo">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Người dùng"
          name="user_id"
          rules={[
            { required: true, message: "Vui lòng chọn người dùng" }
          ]}
        >
          <Select
            placeholder="Chọn người dùng"
            showSearch
            optionFilterProp="children"
          >
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.name} - {user.email}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề thông báo" }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Loại thông báo"
          name="type"
          initialValue="system"
        >
          <Select>
            <Option value="system">Hệ thống</Option>
            <Option value="order">Đơn hàng</Option>
            <Option value="promotion">Khuyến mãi</Option>
            <Option value="chat">Tin nhắn</Option>
            <Option value="wishlist">Yêu thích</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="ID tham chiếu"
          name="ref_id"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Thêm thông báo
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Add;