import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Input, Button, Card, Typography, Select } from "antd";

import topicService from "../../../services/topic.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;

const Add = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      await topicService.createTopic(values);

      toast.success("Thêm chủ đề thành công");

      navigate("/admin/topics");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi thêm chủ đề",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto shadow-md">
        <Title level={3}>Thêm chủ đề</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tên chủ đề"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên chủ đề" }]}
          >
            <Input placeholder="Nhập tên chủ đề" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} placeholder="Nhập mô tả..." />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" initialValue={1}>
            <Select
              options={[
                { label: "Hoạt động", value: 1 },
                { label: "Không hoạt động", value: 0 },
              ]}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Tạo chủ đề
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Add;
