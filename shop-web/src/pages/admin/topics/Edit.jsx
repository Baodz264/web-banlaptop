import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Card, Select, Skeleton, Space } from "antd";

import topicService from "../../../services/topic.service";
import { useToast } from "../../../context/ToastProvider";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const res = await topicService.getTopicById(id);
        
        // Kiểm tra kĩ cấu trúc data từ API của bạn
        if (res?.data?.data) {
          form.setFieldsValue(res.data.data);
        }
      } catch (error) {
        toast.error("Không tìm thấy chủ đề hoặc lỗi hệ thống");
        navigate("/admin/topics");
      } finally {
        // Cần một chút delay nhỏ để đảm bảo Form đã mount hoàn toàn trước khi tắt loading
        setTimeout(() => setLoading(false), 100);
      }
    };

    fetchTopic();
  }, [id, form, navigate, toast]);

  const onFinish = async (values) => {
    try {
      await topicService.updateTopic(id, values);
      toast.success("Cập nhật chủ đề thành công");
      navigate("/admin/topics");
    } catch (error) {
      toast.error("Cập nhật chủ đề thất bại");
    }
  };

  return (
    <div className="p-6">
      <Card 
        className="max-w-2xl mx-auto shadow-md" 
        title="Chỉnh sửa chủ đề"
      >
        {/* Bí kíp ở đây: Form LUÔN LUÔN render. 
          Chúng ta chỉ dùng Skeleton để che các thành phần bên trong khi loading.
        */}
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          // Giữ form luôn hiển thị nhưng có thể làm mờ hoặc ẩn nội dung bằng Skeleton
        >
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <>
              <Form.Item
                label="Tên chủ đề"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên chủ đề" }]}
              >
                <Input placeholder="Nhập tên chủ đề" />
              </Form.Item>

              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
              </Form.Item>

              <Form.Item label="Trạng thái" name="status">
                <Select
                  options={[
                    { label: "Hoạt động", value: 1 },
                    { label: "Không hoạt động", value: 0 },
                  ]}
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Space className="w-full justify-end">
                  <Button onClick={() => navigate("/admin/topics")}>
                    Hủy bỏ
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Lưu thay đổi
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default Edit;