import { useNavigate } from "react-router-dom";

import {
  Card,
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  DatePicker,
  Row,
  Col
} from "antd";

import VoucherService from "../../../services/voucher.service";
import { useToast } from "../../../context/ToastProvider";

const { RangePicker } = DatePicker;

const Add = () => {

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const toast = useToast();

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
          : null

      };

      await VoucherService.createVoucher(data);

      toast.success("Thêm voucher thành công");

      navigate("/admin/vouchers");

    } catch (error) {

      console.error(error);

      toast.error("Thêm voucher thất bại");

    }

  };

  return (

    <Card title="Thêm Voucher">

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >

        <Row gutter={16}>

          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã voucher"
              rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
            >
              <Input placeholder="VD: SALE10" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên voucher"
              rules={[{ required: true, message: "Vui lòng nhập tên voucher" }]}
            >
              <Input placeholder="Ví dụ: Giảm giá mùa hè" />
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
                placeholder="Chọn loại"
                options={[
                  { value: "order", label: "Giảm đơn hàng" },
                  { value: "shipping", label: "Giảm vận chuyển" }
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
                placeholder="Chọn kiểu"
                options={[
                  { value: "percent", label: "Phần trăm (%)" },
                  { value: "fixed", label: "Giảm tiền (VNĐ)" }
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
            <Form.Item
              name="max_discount"
              label="Giảm tối đa"
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

        </Row>

        <Row gutter={16}>

          <Col span={12}>
            <Form.Item
              name="min_order_value"
              label="Đơn hàng tối thiểu"
            >
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

        <Form.Item
          name="date"
          label="Thời gian áp dụng"
        >
          <RangePicker
            style={{ width: "100%" }}
            showTime
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo voucher
          </Button>
        </Form.Item>

      </Form>

    </Card>

  );

};

export default Add;
