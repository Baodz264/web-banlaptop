import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Card,
  DatePicker,
  Select,
  Typography,
  Divider,
  Tag,
} from "antd";
import {
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import warrantyService from "../../../services/warranty.service";
import OrderService from "../../../services/order.service";
import OrderItemService from "../../../services/orderItem.service";
import { useToast } from "../../../context/ToastProvider";

const { Option } = Select;
const { Title, Text } = Typography;

const Add = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [fetchingItems, setFetchingItems] = useState(false);

  // 1. Tải danh sách đơn hàng
  const fetchOrders = useCallback(async () => {
    try {
      const res = await OrderService.getOrders();
      const sortedOrders = (res.data?.data?.items || []).sort((a, b) => b.id - a.id);
      setOrders(sortedOrders);
    } catch (error) {
      toast.error("Không tải được danh sách đơn hàng");
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 2. Xử lý khi chọn đơn hàng -> Tải OrderItems
  const handleOrderChange = async (orderId) => {
    try {
      setFetchingItems(true);
      const res = await OrderItemService.getOrderItems({
        order_id: orderId,
      });

      setOrderItems(res.data?.data?.items || []);
      // Reset giá trị sản phẩm khi đổi đơn hàng khác
      form.setFieldValue("order_item_id", null);
    } catch (error) {
      toast.error("Không tải được chi tiết sản phẩm trong đơn hàng");
    } finally {
      setFetchingItems(false);
    }
  };

  // 3. Gửi form
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        start_date: values.start_date ? values.start_date.format("YYYY-MM-DD") : null,
        end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
      };

      await warrantyService.createWarranty(payload);
      toast.success("Tạo bảo hành thành công");
      navigate("/admin/warranties");
    } catch (error) {
      console.error("Lỗi tạo bảo hành:", error);
      toast.error("Tạo bảo hành thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate("/admin/warranties")}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Card 
        style={{ 
          maxWidth: 700, 
          margin: "0 auto", 
          borderRadius: "12px", 
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)" 
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <SafetyCertificateOutlined style={{ fontSize: "40px", color: "#1890ff" }} />
          <Title level={3} style={{ marginTop: 12 }}>Đăng ký Bảo hành mới</Title>
          <Text type="secondary">Vui lòng chọn đơn hàng và sản phẩm để thiết lập thời hạn bảo hành</Text>
        </div>

        <Divider />

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Form.Item
            label={<b>Đơn hàng liên kết</b>}
            name="order_id"
            rules={[{ required: true, message: "Vui lòng chọn đơn hàng" }]}
          >
            <Select
              placeholder="Tìm kiếm mã đơn hàng (#ID)"
              onChange={handleOrderChange}
              showSearch
              optionFilterProp="children"
              size="large"
            >
              {orders.map((order) => (
                <Option key={order.id} value={order.id}>
                  Đơn hàng #{order.id} - Khách hàng ID: {order.user_id}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<b>Sản phẩm cần bảo hành</b>}
            name="order_item_id"
            rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
            tooltip="Danh sách bao gồm cả sản phẩm lẻ và các gói Combo"
          >
            <Select 
              placeholder="Chọn sản phẩm từ đơn hàng" 
              size="large"
              loading={fetchingItems}
              disabled={orderItems.length === 0}
              optionLabelProp="label"
            >
              {orderItems.map((item) => {
                const isCombo = !!item.bundle_id;
                const variantObj = item.Variant || item.variant;
                
                const productName = variantObj?.Product?.name || item.product_name || `Sản phẩm #${item.id}`;
                
                let variantDisplay = "";
                if (variantObj?.AttributeValues && variantObj.AttributeValues.length > 0) {
                  variantDisplay = variantObj.AttributeValues.map(
                    (attr) => `${attr.Attribute?.name}: ${attr.value}`
                  ).join(" - ");
                } else {
                  variantDisplay = variantObj?.sku || item.variant_name || "N/A";
                }

                const fullDisplayName = isCombo 
                  ? productName 
                  : `${productName} (${variantDisplay})`;

                return (
                  <Option key={item.id} value={item.id} label={fullDisplayName}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isCombo ? <Tag color="purple">COMBO</Tag> : <Tag color="blue">SẢN PHẨM</Tag>}
                        <b style={{ color: '#262626' }}>{productName}</b>
                      </div>
                      
                      {!isCombo && (
                        <>
                          <Text type="secondary" style={{ fontSize: "12px", marginLeft: 4 }}>
                            🧬 Thuộc tính: {variantDisplay}
                          </Text>
                          <Text type="secondary" style={{ fontSize: "11px", marginLeft: 4 }}>
                            📦 SKU: {variantObj?.sku || "N/A"}
                          </Text>
                        </>
                      )}
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              label={<b>Ngày bắt đầu</b>}
              name="start_date"
              rules={[{ required: true, message: "Chọn ngày kích hoạt" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" size="large" />
            </Form.Item>

            <Form.Item
              label={<b>Ngày kết thúc</b>}
              name="end_date"
              rules={[{ required: true, message: "Chọn ngày hết hạn" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" size="large" />
            </Form.Item>
          </div>

          <Form.Item
            label={<b>Trạng thái kích hoạt</b>}
            name="status"
            initialValue="active"
          >
            <Select size="large">
              <Option value="active">🟢 Đang hoạt động (Active)</Option>
              <Option value="expired">🔴 Hết hạn (Expired)</Option>
              <Option value="processing">🟠 Đang xử lý (Processing)</Option>
              <Option value="completed">🔵 Hoàn thành (Completed)</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ height: "48px", borderRadius: "8px", fontSize: "16px", fontWeight: "bold" }}
            >
              XÁC NHẬN TẠO BẢO HÀNH
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Add;