import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Spin,
  Row,
  Col,
  Tabs,
  Tag,
  Divider,
  Typography,
  Space,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
} from "@ant-design/icons";

import userService from "../../../services/user.service";
import authService from "../../../services/auth.service";

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [user, setUser] = useState(null);

  // ================= GET PROFILE =================
  const fetchProfile = useCallback(async () => {
    try {
      const res = await userService.getProfile();
      const data = res.data.data;

      setUser(data);
      setAvatar(data.avatar);

      // Cập nhật giá trị vào form
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: [],
      });
    } catch (err) {
      message.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ================= UPDATE PROFILE =================
  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone || "");

      if (values.avatar?.length > 0) {
        formData.append("avatar", values.avatar[0].originFileObj);
      }

      await userService.updateProfile(formData);

      message.success("Cập nhật thông tin thành công!");
      fetchProfile();
      setPreviewImage(null);
    } catch (err) {
      message.error("Cập nhật thất bại, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = async (values) => {
    setSubmitting(true);
    try {
      await authService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      message.success("Đổi mật khẩu thành công");
      passwordForm.resetFields();
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Mật khẩu cũ không chính xác"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= PREVIEW AVATAR =================
  const handlePreview = (info) => {
    const fileList = info.fileList;
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      {/* SỬA LỖI 1: Thay 'tip' bằng 'description' cho Spin 
      */}
      <Spin spinning={loading} description="Đang tải dữ liệu...">
        <Row gutter={[24, 24]}>
          {/* LEFT INFO */}
          <Col xs={24} md={8} lg={7}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: "center", overflow: "hidden" }}
              cover={
                <div
                  style={{
                    height: 100,
                    background: "linear-gradient(135deg, #1890ff 0%, #001529 100%)",
                  }}
                />
              }
            >
              <Avatar
                size={100}
                src={
                  previewImage || (avatar ? `http://tbtshoplt.xyz${avatar}` : null)
                }
                icon={<UserOutlined />}
                style={{
                  marginTop: -50,
                  border: "4px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />

              <Title level={4} style={{ marginTop: 15 }}>
                {user?.name || "Đang tải..."}
              </Title>

              {/* SỬA LỖI 2: Thay 'direction' bằng 'orientation' cho Space 
              */}
              <Space orientation="vertical" size={0} style={{ width: '100%', justifyContent: 'center' }}>
                <Tag color="blue">{user?.role?.toUpperCase() || "..."}</Tag>
                <Text type="secondary">
                  Tham gia: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                </Text>
              </Space>

              <Divider />

              <div style={{ textAlign: "left" }}>
                <p>
                  <MailOutlined /> <Text strong> Email:</Text>
                  <br />
                  <Text copyable>{user?.email}</Text>
                </p>
                <p>
                  <PhoneOutlined /> <Text strong> SĐT:</Text>{" "}
                  {user?.phone || "Chưa cập nhật"}
                </p>
                <div>
                  <Text strong>Trạng thái: </Text>
                  <Tag color={user?.status ? "green" : "red"}>
                    {user?.status ? "Đang hoạt động" : "Bị khóa"}
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>

          {/* RIGHT TABS */}
          <Col xs={24} md={16} lg={17}>
            <Card style={{ borderRadius: 12 }}>
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: "1",
                    label: (
                      <span>
                        <EditOutlined /> Thông tin cá nhân
                      </span>
                    ),
                    children: (
                      <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        style={{ maxWidth: 600 }}
                      >
                        <Form.Item
                          label="Ảnh đại diện"
                          name="avatar"
                          valuePropName="fileList"
                          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                        >
                          <Upload
                            beforeUpload={() => false}
                            maxCount={1}
                            onChange={handlePreview}
                            showUploadList={false}
                          >
                            <Button icon={<UploadOutlined />}>Thay đổi ảnh</Button>
                          </Upload>
                        </Form.Item>

                        <Form.Item
                          label="Họ và tên"
                          name="name"
                          rules={[{ required: true, message: "Nhập họ tên" }]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item label="Email" name="email">
                          <Input disabled prefix={<MailOutlined />} />
                        </Form.Item>

                        <Form.Item label="SĐT" name="phone">
                          <Input prefix={<PhoneOutlined />} />
                        </Form.Item>

                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={submitting}
                          block
                        >
                          Lưu thay đổi
                        </Button>
                      </Form>
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <span>
                        <SafetyCertificateOutlined /> Bảo mật
                      </span>
                    ),
                    children: (
                      <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handleChangePassword}
                        style={{ maxWidth: 400 }}
                      >
                        <Form.Item
                          name="oldPassword"
                          label="Mật khẩu hiện tại"
                          rules={[{ required: true, message: "Nhập mật khẩu cũ" }]}
                        >
                          <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Divider />
                        <Form.Item
                          name="newPassword"
                          label="Mật khẩu mới"
                          rules={[
                            { required: true, message: "Nhập mật khẩu mới" },
                            { min: 6, message: "Tối thiểu 6 ký tự" },
                          ]}
                        >
                          <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item
                          name="confirmPassword"
                          label="Xác nhận mật khẩu"
                          dependencies={["newPassword"]}
                          rules={[
                            { required: true, message: "Xác nhận lại mật khẩu" },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue("newPassword") === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error("Mật khẩu không khớp"));
                              },
                            }),
                          ]}
                        >
                          <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Button
                          type="primary"
                          danger
                          htmlType="submit"
                          loading={submitting}
                          block
                        >
                          Đổi mật khẩu
                        </Button>
                      </Form>
                    ),
                  },
                  {
                    key: "3",
                    label: (
                      <span>
                        <HistoryOutlined /> Nhật ký
                      </span>
                    ),
                    children: (
                      <div>
                        <ul style={{ marginTop: 10 }}>
                          <li>Đăng nhập - 10 phút trước</li>
                          <li>Cập nhật avatar - 1 giờ trước</li>
                          <li>Tạo đơn hàng - 2 ngày trước</li>
                        </ul>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Profile;