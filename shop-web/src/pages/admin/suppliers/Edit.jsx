import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  Skeleton,
  Typography,
} from "antd";

import supplierService from "../../../services/supplier.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;
const { Option } = Select;

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoading(true);
        const res = await supplierService.getSupplierById(id);
        // Kiểm tra dữ liệu và đổ vào form
        if (res.data && res.data.data) {
          form.setFieldsValue(res.data.data);
        }
      } catch (error) {
        toast.error("Không tìm thấy nhà cung cấp hoặc lỗi kết nối");
        navigate("/admin/suppliers");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id, form, navigate, toast]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await supplierService.updateSupplier(id, values);
      toast.success("Cập nhật nhà cung cấp thành công");
      navigate("/admin/suppliers");
    } catch (error) {
      toast.error("Cập nhật nhà cung cấp thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <Title level={3}>Chỉnh sửa nhà cung cấp</Title>

      {/* Luôn render Form để tránh lỗi "Instance not connected" */}
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        disabled={loading} // Disable form khi đang load dữ liệu
      >
        <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
          <Form.Item
            name="name"
            label="Tên nhà cung cấp"
            rules={[
              { required: true, message: "Vui lòng nhập tên nhà cung cấp" },
            ]}
          >
            <Input placeholder="Nhập tên nhà cung cấp" />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              <Option value={1}>Hoạt động</Option>
              <Option value={0}>Ngưng hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              block
              size="large"
            >
              Lưu thay đổi
            </Button>
            <Button 
              type="link" 
              block 
              onClick={() => navigate("/admin/suppliers")}
              className="mt-2"
            >
              Hủy bỏ
            </Button>
          </Form.Item>
        </Skeleton>
      </Form>
    </Card>
  );
};

export default Edit;