import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Card } from "antd";
import { 
  UploadOutlined, 
  SaveOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  PictureOutlined,
  IdcardOutlined 
} from "@ant-design/icons";
import userService from "../../../services/user.service";
import { useToast } from "../../../context/ToastProvider"; 

const API_URL = "http://tbtshoplt.xyz";

export default function AvatarUpload({ user, onReload }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Sử dụng custom hook toast thay vì message của antd
  const toast = useToast();

  // Hàm xử lý URL ảnh có kèm mã băm thời gian để tránh cache trình duyệt
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar;
    
    const timestamp = new Date().getTime();
    const path = avatar.startsWith("/") ? avatar : `/uploads/users/${avatar}`;
    return `${API_URL}${path}?t=${timestamp}`;
  };

  useEffect(() => {
    if (user) {
      // Chỉ set các field cần thiết để tránh lỗi Form
      form.setFieldsValue({
        name: user.name,
        phone: user.phone,
      });

      if (user.avatar) {
        setFileList([
          {
            uid: "-1",
            name: user.avatar,
            status: "done",
            url: getAvatarUrl(user.avatar),
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [user, form]);

  const handleChange = ({ fileList: newFileList }) => {
    // Xử lý tạo URL preview cho ảnh mới chọn từ máy tính
    const processedList = newFileList.map((file) => {
      if (file.originFileObj && !file.url) {
        file.url = URL.createObjectURL(file.originFileObj);
      }
      return file;
    });
    setFileList(processedList);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Append các thông tin text
      formData.append("name", values.name || "");
      formData.append("phone", values.phone || "");

      // Append file ảnh nếu có file mới được chọn (originFileObj tồn tại)
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("avatar", fileList[0].originFileObj);
      }

      await userService.updateProfile(formData);
      
      // Thông báo thành công bằng React-Toastify
      toast.success("Cập nhật thông tin thành công!");
      
      // Gọi hàm load lại dữ liệu ở component cha
      if (onReload) onReload();
      
    } catch (err) {
      console.error("Update profile error:", err);
      // Thông báo lỗi bằng React-Toastify
      toast.error("Không thể cập nhật hồ sơ. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <span style={{ fontWeight: 700, fontSize: "1.2rem", display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IdcardOutlined style={{ color: '#1677ff' }} /> Thông tin cá nhân
        </span>
      }
      style={{
        borderRadius: 24,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
      styles={{
        header: {
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          padding: "20px 24px",
        },
        body: {
          padding: "24px",
        }
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", gap: 20, marginBottom: 8 }}>
          <Form.Item
            name="name"
            label={<span style={{ fontWeight: 600, color: "#434343" }}><UserOutlined /> Tên của bạn</span>}
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Nhập tên..."
              style={{ borderRadius: 12, height: 45 }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span style={{ fontWeight: 600, color: "#434343" }}><PhoneOutlined /> Số điện thoại</span>}
            style={{ flex: 1 }}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Nhập số điện thoại..."
              style={{ borderRadius: 12, height: 45 }}
            />
          </Form.Item>
        </div>

        <Form.Item 
          label={<span style={{ fontWeight: 600, color: "#434343" }}><PictureOutlined /> Ảnh đại diện</span>}
        >
          <Upload
            beforeUpload={() => false} // Chặn upload tự động để xử lý thủ công bằng FormData
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            maxCount={1}
            className="custom-upload-wrapper"
            onRemove={() => setFileList([])}
          >
            {fileList.length < 1 && (
              <div style={{ color: "#8c8c8c" }}>
                <UploadOutlined style={{ fontSize: 20 }} />
                <div style={{ marginTop: 8, fontSize: 13 }}>Tải ảnh mới</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
          loading={loading}
          style={{
            width: "100%",
            height: 50,
            borderRadius: 14,
            fontWeight: 600,
            fontSize: 16,
            background: "linear-gradient(135deg, #1677ff 0%, #0041be 100%)",
            border: "none",
            boxShadow: "0 10px 20px rgba(22, 119, 255, 0.2)",
            marginTop: 8,
          }}
        >
          Lưu thay đổi
        </Button>
      </Form>

      <style>{`
        .custom-upload-wrapper .ant-upload.ant-upload-select {
          border-radius: 20px !important;
          border: 2px dashed #e8e8e8 !important;
          background: #fafafa !important;
          transition: all 0.3s ease;
        }
        .custom-upload-wrapper .ant-upload.ant-upload-select:hover {
          border-color: #1677ff !important;
          background: #f0f5ff !important;
        }
        .ant-form-item-label > label { font-size: 14px; }
        .ant-form-item-label > label span {
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>
    </Card>
  );
}