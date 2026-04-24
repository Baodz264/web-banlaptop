import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Table, Descriptions, Button, Spin, Tag, Space } from "antd";
import { ArrowLeftOutlined, EyeOutlined } from "@ant-design/icons";

import userService from "../../../services/user.service";
import OrderService from "../../../services/order.service";
import { useToast } from "../../../context/ToastProvider";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sử dụng useCallback để tránh hàm bị khởi tạo lại mỗi lần render
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [userRes, orderRes] = await Promise.all([
        userService.getUserById(id),
        OrderService.getOrders({ user_id: id }),
      ]);

      setUser(userRes?.data?.data);

      const orderData = orderRes?.data?.data;
      setOrders(orderData?.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải chi tiết khách hàng");
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tổng tiền",
      dataIndex: "grand_total",
      key: "grand_total",
      render: (v) => (v ? v.toLocaleString() + " đ" : "0 đ"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case "pending":
            return <Tag color="orange">Chờ xử lý</Tag>;
          case "completed":
            return <Tag color="green">Hoàn thành</Tag>;
          case "cancelled":
            return <Tag color="red">Đã huỷ</Tag>;
          default:
            return <Tag>{status}</Tag>;
        }
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? new Date(date).toLocaleString() : "—"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Link to={`/admin/orders/detail/${record.id}`}>
          <Button icon={<EyeOutlined />} />
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        {/* Đã sửa từ tip sang description */}
        <Spin size="large" description="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 20 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Space>

      {/* THÔNG TIN KHÁCH HÀNG */}
      <Card title="Thông tin khách hàng" style={{ marginBottom: 20 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">{user?.id}</Descriptions.Item>
          <Descriptions.Item label="Tên">{user?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="SĐT">
            {user?.phone || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag color="blue">{user?.role?.toUpperCase()}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {user?.status === 1 ? (
              <Tag color="green">Hoạt động</Tag>
            ) : (
              <Tag color="red">Bị khóa</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* DANH SÁCH ĐƠN HÀNG */}
      <Card title="Danh sách đơn hàng">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={orders}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default CustomerDetail;