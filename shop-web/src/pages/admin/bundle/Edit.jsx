import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Card,
  Select,
  InputNumber,
  DatePicker
} from "antd";

import BundleService from "../../../services/bundle.service";
import BundleItemService from "../../../services/bundleItem.service";
import variantService from "../../../services/variant.service";

import { useToast } from "../../../context/ToastProvider";

import dayjs from "dayjs";

const { Option } = Select;

const Edit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const toast = useToast();

  const [variants, setVariants] = useState([]);

  // Lấy danh sách variant - Dùng useCallback để tránh lỗi dependencies
  const fetchVariants = useCallback(async () => {
    try {
      const res = await variantService.getAll();
      const data = res?.data?.data?.items || res?.data?.data || res?.data;
      setVariants(data);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được variant");
    }
  }, [toast]);

  // Lấy dữ liệu bundle - Dùng useCallback để tránh lỗi dependencies
  const fetchBundle = useCallback(async () => {
    try {
      const res = await BundleService.getBundleById(id);
      const data = res?.data?.data || res?.data;

      const itemRes = await BundleItemService.getItemsByBundle(id);
      const items = itemRes?.data?.data || itemRes?.data || [];

      form.setFieldsValue({
        ...data,
        variants: items.map((i) => i.variant_id),
        start_date: data?.start_date ? dayjs(data.start_date) : null,
        end_date: data?.end_date ? dayjs(data.end_date) : null
      });
    } catch (error) {
      console.error(error);
      toast.error("Không tải được bundle");
    }
  }, [id, form, toast]);

  // useEffect giờ đã có đủ dependencies mà không bị loop
  useEffect(() => {
    fetchVariants();
    fetchBundle();
  }, [fetchVariants, fetchBundle]);

  const onFinish = async (values) => {
    try {
      const data = {
        name: values.name,
        discount_type: values.discount_type,
        discount_value: values.discount_value,
        start_date: values.start_date?.format("YYYY-MM-DD"),
        end_date: values.end_date?.format("YYYY-MM-DD")
      };

      // Cập nhật bundle
      await BundleService.updateBundle(id, data);

      // Xóa bundle items cũ
      const itemRes = await BundleItemService.getItemsByBundle(id);
      const oldItems = itemRes?.data?.data || itemRes?.data || [];

      for (const item of oldItems) {
        await BundleItemService.deleteItem(item.bundle_id, item.variant_id);
      }

      // Thêm lại items mới
      if (values.variants && values.variants.length > 0) {
        for (const variant_id of values.variants) {
          await BundleItemService.createItem({
            bundle_id: id,
            variant_id
          });
        }
      }

      toast.success("Cập nhật bundle thành công");
      navigate("/admin/bundles");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật bundle thất bại");
    }
  };

  return (
    <Card title="Cập nhật Bundle">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Tên bundle */}
        <Form.Item
          label="Tên bundle"
          name="name"
          rules={[{ required: true, message: "Nhập tên bundle" }]}
        >
          <Input />
        </Form.Item>

        {/* Loại giảm */}
        <Form.Item
          label="Loại giảm"
          name="discount_type"
          rules={[{ required: true, message: "Chọn loại giảm" }]}
        >
          <Select>
            <Option value="percent">Percent (%)</Option>
            <Option value="fixed">Fixed (VNĐ)</Option>
          </Select>
        </Form.Item>

        {/* Giá trị giảm */}
        <Form.Item
          label="Giá trị giảm"
          name="discount_value"
          rules={[{ required: true, message: "Nhập giá trị giảm" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* Ngày bắt đầu */}
        <Form.Item label="Ngày bắt đầu" name="start_date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Ngày kết thúc */}
        <Form.Item label="Ngày kết thúc" name="end_date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Chọn variant */}
        <Form.Item label="Sản phẩm trong bundle" name="variants">
          <Select mode="multiple" placeholder="Chọn variant">
            {variants.map((v) => {
              const attrs = v.AttributeValues?.map(av => `${av.Attribute?.name}: ${av.value}`).join(", ");
              return (
                <Option key={v.id} value={v.id}>
                  {v.Product?.name} {attrs && `(${attrs})`} - {v.sku} - {Number(v.price).toLocaleString()} ₫
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Cập nhật
        </Button>
      </Form>
    </Card>
  );
};

export default Edit;