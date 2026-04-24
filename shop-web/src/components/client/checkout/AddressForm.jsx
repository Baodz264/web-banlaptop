import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Space, message } from "antd";
import axios from "axios";

const AddressForm = ({ address = {}, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      full_name: address.full_name || "",
      phone: address.phone || "",
      province: address.province || "",
      district: address.district || "",
      ward: address.ward || "",
      address_detail: address.address_detail || "",
      is_default: !!address.is_default,
    });
  }, [address, form]);

  // ================= LOGIC LẤY TỌA ĐỘ TỪ GOONG MAPS =================
  const getCoordinates = async (fullAddress) => {
    try {
      // Đảm bảo bạn đã định nghĩa biến này trong file .env
      const key = process.env.REACT_APP_GOONG_MAPS_API_KEY;
      const url = `https://rsapi.goong.io/geocode?api_key=${key}&address=${encodeURIComponent(fullAddress)}`;
      
      const res = await axios.get(url);
      const location = res.data?.results?.[0]?.geometry?.location;
      
      if (location) {
        return { lat: location.lat, lng: location.lng };
      }
      return { lat: 0, lng: 0 };
    } catch (error) {
      console.error("Lỗi lấy tọa độ:", error);
      return { lat: 0, lng: 0 };
    }
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      // 1. Ghép chuỗi địa chỉ đầy đủ để gửi cho Goong
      const fullAddress = `${values.address_detail}, ${values.ward}, ${values.district}, ${values.province}`;

      // 2. Gọi hàm lấy tọa độ
      const coords = await getCoordinates(fullAddress);

      // 3. Chuẩn hóa payload bao gồm tọa độ mới lấy được
      const finalPayload = {
        ...values,
        full_name: values.full_name?.trim(),
        phone: values.phone?.trim(),
        province: values.province?.trim(),
        district: values.district?.trim(),
        ward: values.ward?.trim(),
        address_detail: values.address_detail?.trim(),
        lat: coords.lat, // <--- Thêm tọa độ vào đây
        lng: coords.lng, // <--- Thêm tọa độ vào đây
        is_default: values.is_default ? 1 : 0,
      };

      // 4. Trả kết quả về cho component cha (CheckoutPage hoặc ProfilePage)
      await onSave(finalPayload);
      
    } catch (error) {
      message.error("Không thể xử lý thông tin địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <Form.Item
        name="full_name"
        label="Họ tên"
        rules={[{ required: true, message: "Nhập họ tên" }]}
      >
        <Input placeholder="Nguyễn Văn A" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="SĐT"
        rules={[
          { required: true, message: "Nhập số điện thoại" },
          { pattern: /^[0-9]{9,11}$/, message: "Số điện thoại không hợp lệ" }
        ]}
      >
        <Input placeholder="0987654321" />
      </Form.Item>

      <Form.Item
        name="province"
        label="Tỉnh/Thành"
        rules={[{ required: true, message: "Nhập tỉnh/thành" }]}
      >
        <Input placeholder="Hà Nội" />
      </Form.Item>

      <Form.Item
        name="district"
        label="Quận/Huyện"
        rules={[{ required: true, message: "Nhập quận/huyện" }]}
      >
        <Input placeholder="Ba Đình" />
      </Form.Item>

      <Form.Item
        name="ward"
        label="Phường/Xã"
        rules={[{ required: true, message: "Nhập phường/xã" }]}
      >
        <Input placeholder="Phúc Xá" />
      </Form.Item>

      <Form.Item
        name="address_detail"
        label="Địa chỉ chi tiết"
        rules={[{ required: true, message: "Nhập địa chỉ chi tiết" }]}
      >
        <Input placeholder="Số nhà, đường..." />
      </Form.Item>

      <Form.Item name="is_default" valuePropName="checked">
        <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
      </Form.Item>

      <Form.Item>
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onCancel} disabled={loading}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddressForm;