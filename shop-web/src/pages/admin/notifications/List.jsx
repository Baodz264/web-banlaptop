import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Space, Card, Tag, Popconfirm } from "antd";
import { EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import NotificationService from "../../../services/notification.service";
import userService from "../../../services/user.service";
import socket from "../../../socket/socket";
import { useToast } from "../../../context/ToastProvider";

const List = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const toast = useToast();

  // Sử dụng useCallback để hàm không bị tạo mới mỗi lần render
  const loadUsers = useCallback(async () => {
    try {
      const res = await userService.getUsers();
      const userData = res.data?.data?.items || [];
      setUsers(userData);
    } catch (error) {
      toast.error("Không tải được danh sách user");
    }
  }, [toast]);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await NotificationService.getAllNotifications();
      setNotifications(res.data?.data || []);
    } catch (error) {
      toast.error("Không tải được danh sách thông báo");
    }
  }, [toast]);

  useEffect(() => {
    loadUsers();
    loadNotifications();

    socket.on("receive_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info("Có thông báo mới");
    });

    return () => {
      socket.off("receive_notification");
    };
  }, [loadUsers, loadNotifications, toast]); // Đã thêm đầy đủ dependency

  const getUser = (user_id) => {
    return users.find((u) => u.id === user_id);
  };

  const handleDelete = async (id) => {
    try {
      await NotificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
      toast.success("Xóa thông báo thành công");
    } catch (error) {
      toast.error("Xóa thông báo thất bại");
    }
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "user_id",
      render: (user_id) => {
        const user = getUser(user_id);
        if (!user) return user_id;
        return (
          <>
            <div>{user.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{user.email}</div>
          </>
        );
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Loại",
      dataIndex: "type",
      render: (type) => {
        const colors = {
          order: "blue",
          promotion: "green",
          system: "default",
          chat: "purple",
          wishlist: "orange",
        };
        return <Tag color={colors[type] || "default"}>{type}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "is_read",
      render: (value) =>
        value ? (
          <Tag color="green">Đã đọc</Tag>
        ) : (
          <Tag color="red">Chưa đọc</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/notifications/detail/${record._id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có chắc muốn xóa thông báo?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý thông báo"
      extra={
        <Link to="/admin/notifications/add">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm thông báo
          </Button>
        </Link>
      }
    >
      <Table columns={columns} dataSource={notifications} rowKey="_id" />
    </Card>
  );
};

export default List;