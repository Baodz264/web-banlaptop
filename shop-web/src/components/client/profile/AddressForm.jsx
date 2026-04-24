import { Form, Input, Button, Modal, Checkbox } from "antd";
import { useState } from "react";
import AddressService from "../../../services/address.service";
import { useToast } from "../../../context/ToastProvider";
import axios from "axios";

export default function AddressForm({ onReload }) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

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

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Chuẩn hóa dữ liệu địa chỉ để geocode
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

      await AddressService.createAddress(payload);

      toast.success("Thêm địa chỉ thành công");
      form.resetFields();
      setOpen(false);
      onReload?.(); // Load lại danh sách địa chỉ ở component cha
    } catch (error) {
      console.error(error);
      toast.error("Thêm địa chỉ thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Nút mở modal */}
      <Button type="primary" onClick={() => setOpen(true)}>
        + Thêm địa chỉ
      </Button>

      {/* Modal */}
      <Modal
        title="Thêm địa chỉ"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        // SỬA LỖI TẠI ĐÂY: Thay destroyOnClose bằng destroyOnHidden
        destroyOnHidden 
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          initialValues={{ is_default: false }}
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
                message: "Số điện thoại không đúng định dạng Việt Nam",
              },
            ]}
          >
            <Input placeholder="098xxxxxxx" />
          </Form.Item>

          <Form.Item
            name="province"
            label="Tỉnh/Thành phố"
            rules={[{ required: true, message: "Nhập tỉnh/thành" }]}
          >
            <Input placeholder="Ví dụ: Hồ Chí Minh" />
          </Form.Item>

          <Form.Item
            name="district"
            label="Quận/Huyện"
            rules={[{ required: true, message: "Nhập quận/huyện" }]}
          >
            <Input placeholder="Ví dụ: Quận 1" />
          </Form.Item>

          <Form.Item
            name="ward"
            label="Phường/Xã"
            rules={[{ required: true, message: "Nhập phường/xã" }]}
          >
            <Input placeholder="Ví dụ: Bến Nghé" />
          </Form.Item>

          <Form.Item
            name="address_detail"
            label="Địa chỉ chi tiết (Số nhà, tên đường)"
            rules={[{ required: true, message: "Nhập địa chỉ chi tiết" }]}
          >
            <Input placeholder="Ví dụ: 12 Nguyễn Huệ" />
          </Form.Item>

          <Form.Item name="is_default" valuePropName="checked">
            <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button 
              style={{ marginRight: 8 }} 
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm địa chỉ
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}