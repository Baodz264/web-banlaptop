import React, { useState } from "react";
import {
  Form,
  Input,
  Rate,
  Button,
  Typography,
  Upload,
} from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ProductReviewForm = ({ user, form, submitReview }) => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= HANDLE UPLOAD =================
  const handleUploadChange = ({ fileList: newFileList }) => {
    // Giới hạn tối đa 5 ảnh
    setFileList(newFileList.slice(0, 5));
  };

  // ================= VALIDATE FILE =================
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isImage) {
      // Thông báo âm thầm hoặc bạn có thể dùng message.error ở đây
      return Upload.LIST_IGNORE;
    }
    if (!isLt5M) {
      return Upload.LIST_IGNORE;
    }

    return false; // Chặn upload tự động để submit thủ công qua API của mình
  };

  // ================= SUBMIT =================
  const onFinish = async (values) => {
    if (loading) return;

    setLoading(true);
    try {
      // Gửi dữ liệu qua props submitReview từ component cha (ProductDetail)
      const isSuccess = await submitReview(values, fileList);

      if (isSuccess) {
        setFileList([]); // Xóa danh sách ảnh sau khi thành công
        form.resetFields(); // Reset form antd
      }
    } catch (error) {
      console.error("Form Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= NOT LOGIN =================
  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "30px 20px", border: "1px dashed #d9d9d9", borderRadius: 8 }}>
        <Text strong>Bạn cần đăng nhập để thực hiện đánh giá sản phẩm này</Text>
        <br />
        <Link to="/login">
          <Button type="primary" style={{ marginTop: 15 }}>
            Đăng nhập ngay
          </Button>
        </Link>
      </div>
    );
  }

  // ================= UI =================
  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      
      {/* ⭐ RATING */}
      <Form.Item
        name="rating"
        label="Mức độ hài lòng"
        rules={[{ required: true, message: "Vui lòng chọn số sao đánh giá" }]}
      >
        <Rate style={{ fontSize: 24 }} />
      </Form.Item>

      {/* 💬 COMMENT */}
      <Form.Item
        name="comment"
        label="Nội dung đánh giá"
        rules={[
          { required: true, message: "Vui lòng viết một vài cảm nhận của bạn" },
          { min: 5, message: "Nội dung quá ngắn (tối thiểu 5 ký tự)" },
        ]}
      >
        <Input.TextArea
          rows={4}
          placeholder="Sản phẩm có tốt không? Giao hàng nhanh không? Chia sẻ cho mọi người nhé..."
          maxLength={500}
          showCount
        />
      </Form.Item>

      {/* 🖼 IMAGE */}
      <Form.Item 
        label="Hình ảnh thực tế (Tối đa 5 ảnh)"
        extra="Định dạng: JPG, PNG. Dung lượng < 5MB"
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={beforeUpload}
          multiple
          accept="image/*"
        >
          {fileList.length >= 5 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Thêm ảnh</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      {/* 🚀 SUBMIT BUTTON */}
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        loading={loading}
        block
        style={{ height: 45, fontWeight: "bold" }}
      >
        {loading ? "Đang gửi đánh giá..." : "Gửi đánh giá ngay"}
      </Button>
    </Form>
  );
};

export default ProductReviewForm;