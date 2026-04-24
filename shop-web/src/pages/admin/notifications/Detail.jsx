import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import {
  Card,
  Typography,
  Tag,
  Spin,
  message
} from "antd";

import NotificationService from "../../../services/notification.service";
import userService from "../../../services/user.service";

const { Title, Paragraph, Text } = Typography;


const NOTIFICATION_COLORS = {
  order: "blue",
  promotion: "green",
  system: "cyan",
  chat: "purple",
  wishlist: "orange",
};

const Detail = () => {
  const { id } = useParams();

  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await NotificationService.getNotificationById(id);
      const notificationData = res.data.data;
      setNotification(notificationData);

      // Load danh sách user để tìm user tương ứng
      const userRes = await userService.getUsers();
      const users = userRes.data?.data?.items || [];
      const foundUser = users.find(
        (u) => u.id === notificationData.user_id
      );

      setUser(foundUser);
    } catch (error) {
      console.error(error);
      message.error("Không tải được thông báo");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        {/* Đã sửa: dùng description thay cho tip */}
        <Spin size="large" description="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!notification) {
    return (
      <Card style={{ margin: 20 }}>
        <Text type="danger">Không tìm thấy dữ liệu thông báo.</Text>
      </Card>
    );
  }

  return (
    <Card 
      title="Chi tiết thông báo" 
      style={{ margin: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
    >
      <Title level={4}>
        {notification.title}
      </Title>

      <Tag color={NOTIFICATION_COLORS[notification.type] || "default"}>
        {notification.type?.toUpperCase()}
      </Tag>

      <Paragraph style={{ marginTop: 20, fontSize: '16px' }}>
        {notification.content}
      </Paragraph>

      <hr style={{ border: '0.5px solid #f0f0f0', margin: '20px 0' }} />

      <div style={{ marginBottom: 10 }}>
        <Text strong>Người dùng:</Text>{" "}
        {user ? (
          <Text>
            {user.name} ({user.email})
          </Text>
        ) : (
          <Text type="secondary">ID người dùng: {notification.user_id}</Text>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
        <Text strong>Trạng thái:</Text>{" "}
        {notification.is_read ? (
          <Tag color="green">Đã đọc</Tag>
        ) : (
          <Tag color="red">Chưa đọc</Tag>
        )}
      </div>

      <div>
        <Text strong>Ngày tạo:</Text>{" "}
        <Text>
          {notification.created_at 
            ? new Date(notification.created_at).toLocaleString("vi-VN") 
            : "N/A"}
        </Text>
      </div>
    </Card>
  );
};

export default Detail;