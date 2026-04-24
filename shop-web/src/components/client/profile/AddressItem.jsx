import { Card, Button, Tag, Space, Modal, Form, Input, Checkbox, App } from "antd";
import { DeleteOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import AddressService from "../../../services/address.service";
import { useToast } from "../../../context/ToastProvider";

export default function AddressItem({ data, onReload }) {
  // Sử dụng hook của Ant Design để gọi Modal/Message/Notification mà không bị lỗi Context
  const { modal } = App.useApp(); 
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Đồng bộ dữ liệu vào form khi mở Modal sửa
  useEffect(() => {
    if (editing && data) {
      form.setFieldsValue({
        full_name: data.full_name,
        phone: data.phone,
        province: data.province,
        district: data.district,
        ward: data.ward,
        address_detail: data.address_detail,
        is_default: data.is_default === 1,
      });
    }
  }, [editing, data, form]);

  // 🔥 Hàm lấy tọa độ từ Goong Maps API
  const getCoordinates = async (fullAddress) => {
    try {
      const key = process.env.REACT_APP_GOONG_MAPS_API_KEY;
      const url = `https://rsapi.goong.io/geocode?api_key=${key}&address=${encodeURIComponent(fullAddress)}`;
      const res = await axios.get(url);
      const location = res.data?.results?.[0]?.geometry?.location;
      if (location) return { lat: location.lat, lng: location.lng };
      return { lat: 0, lng: 0 };
    } catch (error) {
      console.error("Lỗi lấy tọa độ:", error);
      return { lat: 0, lng: 0 };
    }
  };

  // 🔥 Xoá địa chỉ (Đã sửa từ Modal.confirm sang modal.confirm)
  const handleDelete = () => {
    modal.confirm({
      title: "Xoá địa chỉ?",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc muốn xoá địa chỉ này không?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await AddressService.deleteAddress(data.id);
          toast.success("Đã xoá địa chỉ");
          onReload();
        } catch (error) {
          console.error(error);
          toast.error("Xoá thất bại");
        }
      },
    });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

  // 🔥 Submit form cập nhật
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const fullAddress = `${values.address_detail}, ${values.ward}, ${values.district}, ${values.province}`;
      const coords = await getCoordinates(fullAddress);

      const payload = {
        full_name: values.full_name?.trim(),
        phone: values.phone?.trim(),
        province: values.province?.trim(),
        district: values.district?.trim(),
        ward: values.ward?.trim(),
        address_detail: values.address_detail?.trim(),
        lat: coords.lat,
        lng: coords.lng,
        is_default: values.is_default ? 1 : 0,
      };

      await AddressService.updateAddress(data.id, payload);
      
      toast.success("Cập nhật địa chỉ thành công");
      setEditing(false);
      onReload(); 
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        hoverable
        style={{
          marginTop: 12,
          borderRadius: 16,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
        styles={{ body: { padding: 16 } }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: 16 }}>{data?.full_name}</span>
            <span style={{ marginLeft: 10, color: "#888" }}>{data?.phone}</span>
          </div>
          {data?.is_default === 1 && (
            <Tag icon={<CheckCircleOutlined />} color="green">Mặc định</Tag>
          )}
        </div>

        <div style={{ color: "#555", marginBottom: 14 }}>
          {[data?.address_detail, data?.ward, data?.district, data?.province].filter(Boolean).join(", ")}
        </div>

        <Space>
          <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>Xoá</Button>
          <Button type="primary" onClick={handleEdit}>Sửa</Button>
        </Space>
      </Card>

      <Modal
        title="Sửa địa chỉ"
        open={editing}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="full_name"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập SĐT" },
              {
                pattern: /^(0|84)(3|5|7|8|9)([0-9]{8})$/,
                message: "Số điện thoại không đúng định dạng",
              },
            ]}
          >
            <Input placeholder="098xxxxxxx" />
          </Form.Item>

          <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true, message: "Không được để trống" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true, message: "Không được để trống" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="ward" label="Phường/Xã" rules={[{ required: true, message: "Không được để trống" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="address_detail" label="Địa chỉ chi tiết" rules={[{ required: true, message: "Không được để trống" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="is_default" valuePropName="checked">
            <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button style={{ marginRight: 8 }} onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}