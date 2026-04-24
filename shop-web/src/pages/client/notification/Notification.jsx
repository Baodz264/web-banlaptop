import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Layout, Typography, Tabs, Button, 
  Avatar, Empty, Spin, Tag, Space 
} from "antd";
import { 
  CheckCircleOutlined, 
  ShoppingOutlined, 
  GiftOutlined,
  NotificationOutlined
} from "@ant-design/icons";

import NotificationService from "../../../services/notification.service";
import { useToast } from "../../../context/ToastProvider";
import socket from "../../../socket/socket"; 

const { Content } = Layout;
const { Title, Text } = Typography;

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const notify = useToast();

  // Memoize userId để tránh re-run effect
  const userId = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?._id;
    } catch {
      return null;
    }
  }, []);

  // 1. Fetch dữ liệu ban đầu
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await NotificationService.getNotifications();
      const data = res?.data?.data || res?.data || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      notify.error("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 2. Thiết lập Socket
  useEffect(() => {
    if (!userId) return;

    socket.emit("join_notification", userId);

    socket.on("receive_notification", (newNoti) => {
      setNotifications((prev) => [newNoti, ...prev]);
      notify.info(`Thông báo mới: ${newNoti.title}`);
    });

    socket.on("notification_read", (updatedNoti) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === updatedNoti._id ? { ...n, is_read: true } : n))
      );
    });

    return () => {
      socket.emit("leave_notification", userId);
      socket.off("receive_notification");
      socket.off("notification_read");
    };
  }, [userId, notify]);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await NotificationService.markAsRead(id);
      socket.emit("read_notification", { notification_id: id, user_id: userId });
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n._id);
    if (unreadIds.length === 0) return;

    try {
      await Promise.all(unreadIds.map(id => NotificationService.markAsRead(id)));
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      notify.success("Đã đánh dấu đọc tất cả");
    } catch (error) {
      notify.error("Có lỗi xảy ra");
    }
  };

  const filteredNoti = useMemo(() => {
    return notifications.filter(n => {
      if (activeTab === "unread") return !n.is_read;
      if (activeTab === "order") return n.type === "order";
      if (activeTab === "promo") return n.type === "promotion";
      return true;
    });
  }, [notifications, activeTab]);

  const getIcon = (type) => {
    switch(type) {
      case 'order': return <ShoppingOutlined />;
      case 'promotion': return <GiftOutlined />;
      default: return <NotificationOutlined />;
    }
  };

  const renderTag = (type) => {
    const configs = {
      order: { color: "blue", text: "Đơn hàng" },
      promotion: { color: "volcano", text: "Khuyến mãi" },
      system: { color: "gold", text: "Hệ thống" }
    };
    const config = configs[type] || configs.system;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const tabItems = [
    { key: "all", label: "Tất cả" },
    { key: "unread", label: `Chưa đọc (${notifications.filter(n => !n.is_read).length})` },
    { key: "order", label: "Đơn hàng" },
    { key: "promo", label: "Khuyến mãi" }
  ];

  return (
    <Content className="noti-wrapper">
      <div className="noti-container">
        <div className="noti-header">
          <div>
            <Title level={3} style={{ margin: 0 }}>Thông báo của tôi</Title>
            <Text type="secondary">
              Bạn đang có <b>{notifications.filter(n => !n.is_read).length}</b> thông báo mới
            </Text>
          </div>
          <Button
            type="primary" ghost icon={<CheckCircleOutlined />}
            onClick={handleMarkAllRead}
            disabled={notifications.filter(n => !n.is_read).length === 0}
          >
            Đọc tất cả
          </Button>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

        <div className="noti-list-body" style={{ marginTop: '16px' }}>
          <Spin spinning={loading}>
            {filteredNoti.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có thông báo nào" />
            ) : (
              <div className="custom-noti-list">
                {filteredNoti.map((item) => (
                  <div 
                    key={item._id} 
                    className={`noti-item-card ${!item.is_read ? "unread" : ""}`}
                    onClick={() => handleMarkAsRead(item._id, item.is_read)}
                  >
                    <div className="noti-item-left">
                      <Avatar 
                        size={48} 
                        icon={getIcon(item.type)} 
                        className={`noti-avatar ${item.type}`} 
                      />
                    </div>
                    <div className="noti-item-content">
                      <div className="noti-title-row">
                        <Text strong style={{ fontSize: '15px' }}>{item.title}</Text>
                        <Text type="secondary" className="noti-time">
                          {item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : "Vừa xong"}
                        </Text>
                      </div>
                      <Text className="noti-desc">{item.content}</Text>
                      <Space style={{ marginTop: 8 }}>
                        {renderTag(item.type)}
                        {!item.is_read && <Tag color="green">Mới</Tag>}
                      </Space>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Spin>
        </div>
      </div>

      <style>{`
        .noti-wrapper { background: #f0f2f5; min-height: 100vh; padding: 40px 20px; }
        .noti-container { max-width: 800px; margin: auto; background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .noti-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        
        /* Thay thế cho List component để tránh Warning */
        .custom-noti-list { display: flex; flex-direction: column; gap: 8px; }
        .noti-item-card { 
          display: flex; gap: 16px; padding: 16px; border-radius: 8px; 
          border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: all 0.3s;
        }
        .noti-item-card:hover { background: #fafafa; transform: translateX(4px); }
        .noti-item-card.unread { background: #f0f7ff; border-left: 4px solid #1890ff; }
        .noti-item-card.unread:hover { background: #e6f7ff; }
        
        .noti-item-content { flex: 1; }
        .noti-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
        .noti-desc { color: #595959; display: block; line-height: 1.5; }
        .noti-time { font-size: 12px; color: #bfbfbf; white-space: nowrap; margin-left: 12px; }
        
        .noti-avatar.order { background: #e6f7ff; color: #1890ff; }
        .noti-avatar.promotion { background: #fff1f0; color: #ff4d4f; }

        @media (max-width: 576px) {
          .noti-header { flex-direction: column; align-items: flex-start; gap: 12px; }
          .noti-title-row { flex-direction: column; gap: 2px; }
          .noti-time { margin-left: 0; margin-bottom: 4px; }
        }
      `}</style>
    </Content>
  );
};

export default NotificationsPage;