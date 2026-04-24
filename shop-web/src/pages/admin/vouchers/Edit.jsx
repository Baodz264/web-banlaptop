import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Card,
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  DatePicker,
  Skeleton,
  Row,
  Col
} from "antd";

import dayjs from "dayjs";

import VoucherService from "../../../services/voucher.service";
import { useToast } from "../../../context/ToastProvider";

const { RangePicker } = DatePicker;

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState(null);

  const [form] = Form.useForm();

  // ================= FETCH DATA =================
  // Sử dụng useCallback để tránh tạo lại hàm khi component re-render
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await VoucherService.getVoucherById(id);
      const data = res?.data?.data;

      setVoucher(data);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được dữ liệu voucher");
    } finally {
      setLoading(false);
    }
  }, [id, toast]); // Dependency bao gồm id và toast

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ================= SET FORM SAU KHI CÓ DATA =================
  useEffect(() => {
    if (voucher) {
      form.setFieldsValue({
        code: voucher.code,
        name: voucher.name,
        type: voucher.type,
        discount_type: voucher.discount_type,
        discount_value: voucher.discount_value,
        max_discount: voucher.max_discount,
        min_order_value: voucher.min_order_value,
        quantity: voucher.quantity,
        date:
          voucher.start_date && voucher.end_date
            ? [dayjs(voucher.start_date), dayjs(voucher.end_date)]
            : null,
      });
    }
  }, [voucher, form]);

  // ================= SUBMIT =================
  const onFinish = async (values) => {
    try {
      const data = {
        code: values.code,
        name: values.name,
        type: values.type,
        discount_type: values.discount_type,
        discount_value: values.discount_value,
        max_discount: values.max_discount,
        min_order_value: values.min_order_value,
        quantity: values.quantity,
        start_date: values.date
          ? values.date[0].format("YYYY-MM-DD HH:mm:ss")
          : null,
        end_date: values.date
          ? values.date[1].format("YYYY-MM-DD HH:mm:ss")
          : null,
      };

      await VoucherService.updateVoucher(id, data);
      toast.success("Cập nhật voucher thành công");
      navigate("/admin/vouchers");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật voucher thất bại");
    }
  };

  // ================= RENDER =================
  if (loading) return <Skeleton active />;

  return (
    <Card title="Chỉnh sửa Voucher">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã voucher"
              rules={[{ required: true, message: "Nhập mã voucher" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên voucher"
              rules={[{ required: true, message: "Nhập tên voucher" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Loại voucher"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "order", label: "Giảm đơn hàng" },
                  { value: "shipping", label: "Giảm phí vận chuyển" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="discount_type"
              label="Kiểu giảm giá"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "percent", label: "Phần trăm (%)" },
                  { value: "fixed", label: "Giảm tiền (VNĐ)" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="discount_value"
              label="Giá trị giảm"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="max_discount" label="Giảm tối đa">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="min_order_value" label="Đơn hàng tối thiểu">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="quantity"
              label="Số lượng voucher"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="date" label="Thời gian áp dụng">
          <RangePicker
            style={{ width: "100%" }}
            showTime
            format="DD/MM/YYYY HH:mm"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Edit;