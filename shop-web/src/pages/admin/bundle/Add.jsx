import { useEffect, useState, useCallback } from "react";
import { Form, Input, Button, Card, Select, InputNumber, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";

import BundleService from "../../../services/bundle.service";
import BundleItemService from "../../../services/bundleItem.service";
import variantService from "../../../services/variant.service";

import { useToast } from "../../../context/ToastProvider";

const { Option } = Select;

const Add = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const toast = useToast();
  const [variants, setVariants] = useState([]);

  // Sử dụng useCallback để ghi nhớ hàm, tránh re-render vô tận nếu đưa vào dependency
  const fetchVariants = useCallback(async () => {
    try {
      const res = await variantService.getAll();
      const data = res?.data?.data?.items || res?.data?.data || res?.data;

      setVariants(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được variant");
    }
  }, [toast]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  const onFinish = async (values) => {
    try {
      const data = {
        name: values.name,
        discount_type: values.discount_type,
        discount_value: values.discount_value,
        start_date: values.start_date?.format("YYYY-MM-DD"),
        end_date: values.end_date?.format("YYYY-MM-DD"),
      };

      // Tạo bundle
      const res = await BundleService.createBundle(data);
      const bundle = res?.data?.data || res?.data;

      // Thêm variant vào bundle
      if (values.variants && values.variants.length > 0) {
        // Dùng Promise.all để tối ưu hiệu năng thay vì await từng vòng lặp (nếu API hỗ trợ)
        // Nếu API bắt buộc tuần tự thì giữ nguyên for...of
        const itemPromises = values.variants.map((variant_id) =>
          BundleItemService.createItem({
            bundle_id: bundle.id,
            variant_id,
          })
        );
        await Promise.all(itemPromises);
      }

      toast.success("Tạo bundle thành công");
      navigate("/admin/bundles");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tạo bundle");
    }
  };

  return (
    <Card title="Thêm Bundle">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {/* Tên bundle */}
        <Form.Item
          label="Tên bundle"
          name="name"
          rules={[{ required: true, message: "Nhập tên bundle" }]}
        >
          <Input placeholder="Ví dụ: Combo Mùa Hè" />
        </Form.Item>

        <div style={{ display: "flex", gap: "16px" }}>
          {/* Loại giảm */}
          <Form.Item
            label="Loại giảm"
            name="discount_type"
            rules={[{ required: true, message: "Chọn loại giảm" }]}
            style={{ flex: 1 }}
          >
            <Select placeholder="Chọn loại">
              <Option value="percent">Percent (%)</Option>
              <Option value="fixed">Fixed (VNĐ)</Option>
            </Select>
          </Form.Item>

          {/* Giá trị giảm */}
          <Form.Item
            label="Giá trị giảm"
            name="discount_value"
            rules={[{ required: true, message: "Nhập giá trị giảm" }]}
            style={{ flex: 1 }}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          {/* Ngày bắt đầu */}
          <Form.Item label="Ngày bắt đầu" name="start_date" style={{ flex: 1 }}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* Ngày kết thúc */}
          <Form.Item label="Ngày kết thúc" name="end_date" style={{ flex: 1 }}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </div>

        {/* Chọn variant */}
        <Form.Item 
          label="Sản phẩm trong bundle" 
          name="variants"
          rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 sản phẩm" }]}
        >
          <Select 
            mode="multiple" 
            placeholder="Tìm và chọn sản phẩm..."
            optionFilterProp="children"
            showSearch
          >
            {variants.map((v) => {
              const attrs = v.AttributeValues?.map(
                (av) => `${av.Attribute?.name}: ${av.value}`
              ).join(", ");
              
              return (
                <Option key={v.id} value={v.id}>
                  {v.Product?.name} {attrs && `(${attrs})`} - {v.sku} - {Number(v.price).toLocaleString()} ₫
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Lưu Bundle
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Add;