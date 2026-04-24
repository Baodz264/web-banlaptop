import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Upload, Card, Skeleton, Select } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import postService from "../../../services/post.service";
import topicService from "../../../services/topic.service";
import { useToast } from "../../../context/ToastProvider";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [content, setContent] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Đảm bảo loading bật khi fetch
        const [postRes, topicRes] = await Promise.all([
          postService.getPostById(id),
          topicService.getTopics({ page: 1, limit: 100 }),
        ]);

        const post = postRes.data.data;

        // Cập nhật form
        form.setFieldsValue({
          title: post.title,
          topic_id: post.topic_id,
        });

        setContent(post.content || "");
        setTopics(topicRes?.data?.data?.items || []);

        if (post.thumbnail) {
          setFileList([
            {
              uid: "-1",
              name: "thumbnail",
              status: "done",
              url: `http://tbtshoplt.xyz${post.thumbnail}`,
            },
          ]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Không tải được dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form, toast]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", content);
      formData.append("topic_id", values.topic_id);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("thumbnail", fileList[0].originFileObj);
      }

      await postService.updatePost(id, formData);
      toast.success("Cập nhật bài viết thành công");
      navigate("/admin/posts");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="Chỉnh sửa Post" style={{ maxWidth: 1000, margin: "auto" }}>
        {/* Quan trọng: Luôn render Form, chỉ dùng Skeleton bọc bên trong Form.Item hoặc bao quanh toàn bộ content */}
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Skeleton loading={loading} active paragraph={{ rows: 10 }}>
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Nhập tiêu đề" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Topic"
              name="topic_id"
              rules={[{ required: true, message: "Chọn topic" }]}
            >
              <Select
                placeholder="Chọn topic"
                options={topics.map((t) => ({
                  label: t.name,
                  value: t.id,
                }))}
              />
            </Form.Item>

            <Form.Item label="Nội dung">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                style={{ height: 300, marginBottom: 50 }}
              />
            </Form.Item>

            <Form.Item label="Thumbnail">
              <Upload
                beforeUpload={() => false}
                listType="picture-card"
                maxCount={1}
                fileList={fileList}
                onChange={handleUploadChange}
              >
                {fileList.length < 1 && (
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                )}
              </Upload>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              block
              disabled={loading}
            >
              Lưu thay đổi
            </Button>
          </Skeleton>
        </Form>
      </Card>
    </div>
  );
};

export default Edit;