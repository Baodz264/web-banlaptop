import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Skeleton,
  Typography
} from "antd";

import settingService from "../../../services/setting.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;

const Edit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        setLoading(true);
        const res = await settingService.getSettingById(id);
        // Ant Design khuyến khích setFieldsValue sau khi form đã mount
        form.setFieldsValue(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Không tìm thấy setting");
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, [id, form, toast]);

  const onFinish = async (values) => {
    try {
      await settingService.updateSetting(id, values);
      toast.success("Cập nhật setting thành công");
      navigate("/admin/settings");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto shadow-md">
        <Title level={3}>Edit Setting</Title>

        {/* Mẹo: Giữ Form luôn render để tránh lỗi "not connected", 
            nhưng hiển thị Skeleton bên trong cho đến khi có dữ liệu.
        */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <>
              <Form.Item
                label="Key"
                name="key"
                rules={[{ required: true, message: "Nhập key!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Value" name="value">
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                >
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default Edit;