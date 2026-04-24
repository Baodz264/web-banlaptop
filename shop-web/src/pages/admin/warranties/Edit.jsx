import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Select,
  DatePicker,
  Button,
  Card,
  Typography,
  Divider,
  Space,
  Spin,
} from "antd";
import {
  EditOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import warrantyService from "../../../services/warranty.service";
import { useToast } from "../../../context/ToastProvider";

const { Option } = Select;
const { Title, Text } = Typography;

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Tải thông tin bảo hành hiện tại
  const fetchWarranty = useCallback(async () => {
    try {
      setFetching(true);
      const res = await warrantyService.getWarrantyById(id);
      const data = res.data.data;

      // Đổ dữ liệu vào Form, chuyển string date thành đối tượng dayjs cho DatePicker
      form.setFieldsValue({
        status: data.status,
        start_date: data.start_date ? dayjs(data.start_date) : null,
        end_date: data.end_date ? dayjs(data.end_date) : null,
      });
    } catch (error) {
      console.error("Lỗi tải thông tin bảo hành:", error);
      toast.error("Không tải được thông tin bảo hành");
    } finally {
      setFetching(false);
    }
  }, [id, form, toast]);

  useEffect(() => {
    fetchWarranty();
  }, [fetchWarranty]);

  // 2. Xử lý cập nhật
  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Format lại ngày tháng trước khi gửi lên server
      const payload = {
        ...values,
        start_date: values.start_date ? values.start_date.format("YYYY-MM-DD") : null,
        end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
      };

      await warrantyService.updateWarranty(id, payload);
      toast.success("Cập nhật bảo hành thành công");
      navigate("/admin/warranties");
    } catch (error) {
      toast.error("Cập nhật bảo hành thất bại");
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
        Quay lại danh sách
      </Button>

      <Card
        style={{
          maxWidth: 700,
          margin: "0 auto",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        {/* Đã sửa tip thành description ở dòng dưới đây */}
        <Spin spinning={fetching} description="Đang tải dữ liệu...">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <EditOutlined style={{ fontSize: "40px", color: "#faad14" }} />
            <Title level={3} style={{ marginTop: 12 }}>Chỉnh sửa Bảo hành</Title>
            <Text type="secondary">Cập nhật thời hạn hoặc trạng thái cho mã bảo hành #{id}</Text>
          </div>

          <Divider />

          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            requiredMark="optional"
          >
            <Form.Item
              label={<b>Trạng thái bảo hành</b>}
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select size="large" placeholder="Chọn trạng thái">
                <Option value="active">🟢 Đang hoạt động (Active)</Option>
                <Option value="expired">🔴 Hết hạn (Expired)</Option>
                <Option value="processing">🟠 Đang xử lý (Processing)</Option>
                <Option value="completed">🔵 Hoàn thành (Completed)</Option>
              </Select>
            </Form.Item>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <Form.Item
                label={<b>Ngày bắt đầu</b>}
                name="start_date"
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
              >
                <DatePicker 
                  style={{ width: "100%" }} 
                  format="DD/MM/YYYY" 
                  size="large" 
                />
              </Form.Item>

              <Form.Item
                label={<b>Ngày kết thúc</b>}
                name="end_date"
                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
              >
                <DatePicker 
                  style={{ width: "100%" }} 
                  format="DD/MM/YYYY" 
                  size="large" 
                />
              </Form.Item>
            </div>

            <Divider style={{ margin: "24px 0" }} />

            <Form.Item>
              <Space style={{ width: "100%", justifyContent: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                  style={{ 
                    minWidth: "200px", 
                    height: "45px", 
                    borderRadius: "8px",
                    fontWeight: "bold"
                  }}
                >
                  LƯU THAY ĐỔI
                </Button>
                
                <Button 
                  size="large" 
                  onClick={() => navigate("/admin/warranties")}
                  style={{ borderRadius: "8px", height: "45px" }}
                >
                  Hủy bỏ
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default Edit;