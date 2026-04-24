import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Typography,
  Select,
  Row,
  Col
} from "antd";

import { UploadOutlined } from "@ant-design/icons";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import postService from "../../../services/post.service";
import topicService from "../../../services/topic.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;

const Add = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [form] = Form.useForm();

  const [topics, setTopics] = useState([]);
  const [thumbnail, setThumbnail] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"]
    ]
  };

  // Sử dụng useCallback để fetchTopics ổn định hoặc đưa trực tiếp vào useEffect
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await topicService.getTopics({
          page: 1,
          limit: 100
        });
        setTopics(res?.data?.data?.items || []);
      } catch (error) {
        console.error(error);
        toast.error("Không tải được topic");
      }
    };

    fetchTopics();
    // Thêm toast vào dependency array để hết lỗi ESLint
  }, [toast]);

  const handleUploadChange = ({ fileList }) => {
    setThumbnail(fileList);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", content);
      formData.append("topic_id", values.topic_id);
      formData.append("status", 1);

      if (thumbnail.length > 0) {
        formData.append("thumbnail", thumbnail[0].originFileObj);
      }

      await postService.createPost(formData);

      toast.success("Tạo bài viết thành công");

      form.resetFields();
      setThumbnail([]);
      setContent("");

      navigate("/admin/posts");
    } catch (error) {
      console.error(error);
      toast.error("Tạo bài viết thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ maxWidth: 1000, margin: "auto" }}>
        <Title level={3}>Thêm bài viết</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Nhập tiêu đề" }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            label="Topic"
            name="topic_id"
            rules={[{ required: true, message: "Chọn topic" }]}
          >
            <Select
              placeholder="Chọn topic"
              options={topics.map(topic => ({
                label: topic.name,
                value: topic.id
              }))}
            />
          </Form.Item>

          <Form.Item label="Nội dung">
            <Row gutter={20}>
              <Col span={12}>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  style={{ height: 300, marginBottom: 40 }} // Thêm margin bottom vì Quill hay đè lên element dưới
                />
              </Col>
              <Col span={12}>
                <div
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: 12,
                    height: 340,
                    overflowY: "auto",
                    background: "#fafafa"
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Thumbnail" style={{ marginTop: 20 }}>
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              maxCount={1}
              fileList={thumbnail}
              onChange={handleUploadChange}
            >
              {thumbnail.length < 1 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
          >
            Tạo bài viết
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Add;