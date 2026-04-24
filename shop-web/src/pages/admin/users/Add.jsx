import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Typography,
  Select
} from "antd";

import {
  UploadOutlined,
  UserAddOutlined
} from "@ant-design/icons";

import userService from "../../../services/user.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;
const { Option } = Select;

const Add = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // ✅ Map role để tránh backend mismatch
  const mapRole = (role) => {
    if (role === "user") return "customer"; // backend cũ
    return role;
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", values.name);
      data.append("email", values.email);
      data.append("password", values.password);
      data.append("phone", values.phone || "");

      // ✅ fix role
      data.append("role", mapRole(values.role));

      if (fileList.length > 0) {
        data.append("avatar", fileList[0].originFileObj);
      }

      // ✅ debug request
      console.log("FORM DATA:");
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }

      await userService.createUser(data);

      toast.success("Tạo người dùng thành công");
      navigate("/admin/users");

    } catch (error) {
      console.error("FULL ERROR:", error);
      console.error("RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.message || "Tạo người dùng thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-md">
      <Title level={3}>
        <UserAddOutlined /> Thêm Người Dùng
      </Title>

      <Form layout="vertical" onFinish={onFinish} autoComplete="off">

        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: "Nhập tên người dùng" }]}
        >
          <Input placeholder="Nhập họ tên..." />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Nhập email" },
            { type: "email", message: "Email không hợp lệ" }
          ]}
        >
          <Input placeholder="example@gmail.com" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Nhập mật khẩu" },
            { min: 6, message: "Mật khẩu ít nhất 6 ký tự" }
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu..." />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone">
          <Input placeholder="Nhập số điện thoại..." />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          initialValue="user"
          rules={[{ required: true, message: "Chọn vai trò" }]}
        >
          <Select>
            <Option value="user">Khách hàng</Option>
            <Option value="staff">Nhân viên</Option>
            <Option value="shipper">Shipper</Option>
            <Option value="admin">Quản trị</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Ảnh đại diện">
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            listType="picture"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>
              Chọn ảnh
            </Button>
          </Upload>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
        >
          Tạo người dùng
        </Button>

      </Form>
    </Card>
  );
};

export default Add;
