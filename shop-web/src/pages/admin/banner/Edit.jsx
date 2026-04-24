import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Skeleton,
  Select,
  Space,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import bannerService from "../../../services/banner.service";
import { useToast } from "../../../context/ToastProvider";

const API_URL = process.env.REACT_APP_API_URL || "tbtshoplt.xyz";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const buildImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return `${API_URL}${img}`;
    if (img.startsWith("uploads")) return `${API_URL}/${img}`;
    return `${API_URL}/uploads/banners/${img}`;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await bannerService.getById(id);
        const banner = res?.data?.data;

        if (banner) {
          form.setFieldsValue({
            title: banner.title,
            link: banner.link,
            position: banner.position,
            status: banner.status,
          });
          setImageUrl(banner.image);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Không tải được dữ liệu banner");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form, toast]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      let link = values.link || "";
      if (link && !link.startsWith("http")) {
        link = "https://" + link;
      }

      formData.append("title", values.title || "");
      formData.append("link", link);
      formData.append("position", values.position || "");
      formData.append("status", values.status ?? 1);

      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0].originFileObj);
      }

      await bannerService.update(id, formData);
      toast.success("Cập nhật banner thành công 🎉");
      navigate("/admin/banners");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Cập nhật banner thất bại");
    }
  };

  return (
    <Card
      title="Chỉnh sửa Banner"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/banners")}
        >
          Quay lại
        </Button>
      }
    >
      {/* QUAN TRỌNG: Thẻ <Form> phải luôn được render, không nằm trong câu điều kiện 
        hoặc Skeleton bọc ngoài để tránh lỗi "not connected".
      */}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Skeleton loading={loading} active paragraph={{ rows: 10 }}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề banner" }]}
          >
            <Input placeholder="Banner title" />
          </Form.Item>

          <Form.Item label="Link" name="link">
            <Input placeholder="https://example.com" />
          </Form.Item>

          <Form.Item label="Vị trí" name="position">
            <Input placeholder="home / sidebar / top" />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Select
              options={[
                { value: 1, label: "Hoạt động" },
                { value: 0, label: "Tắt" },
              ]}
            />
          </Form.Item>

          {/* Hiển thị ảnh cũ */}
          {imageUrl && (
            <div style={{ marginBottom: 20 }}>
              <p>Ảnh hiện tại:</p>
              <img
                src={buildImageUrl(imageUrl)}
                alt="banner"
                style={{
                  width: 200,
                  borderRadius: 6,
                  border: "1px solid #d9d9d9",
                  padding: 4,
                }}
              />
            </div>
          )}

          <Form.Item
            label="Hình ảnh mới"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture-card"
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
            <Button onClick={() => navigate("/admin/banners")}>Hủy</Button>
          </Space>
        </Skeleton>
      </Form>
    </Card>
  );
};

export default Edit;