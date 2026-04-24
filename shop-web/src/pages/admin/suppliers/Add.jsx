import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Select
} from "antd";

import { PlusOutlined } from "@ant-design/icons";

import supplierService from "../../../services/supplier.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;
const { Option } = Select;

const Add = () => {

  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {

    setLoading(true);

    try {

      await supplierService.createSupplier(values);

      toast.success("Thêm nhà cung cấp thành công");

      navigate("/admin/suppliers");

    } catch {

      toast.error("Thêm nhà cung cấp thất bại");

    } finally {

      setLoading(false);

    }

  };

  return (

    <Card className="max-w-xl mx-auto mt-10">

      <Title level={3}>
        <PlusOutlined /> Thêm nhà cung cấp
      </Title>

      <Form layout="vertical" onFinish={onFinish}>

        <Form.Item
          label="Tên nhà cung cấp"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên nhà cung cấp" }
          ]}
        >
          <Input placeholder="Nhập tên nhà cung cấp" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: "email", message: "Email không hợp lệ" }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          initialValue={1}
        >
          <Select>
            <Option value={1}>Hoạt động</Option>
            <Option value={0}>Ngưng hoạt động</Option>
          </Select>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
        >
          Thêm nhà cung cấp
        </Button>

      </Form>

    </Card>

  );

};

export default Add;
