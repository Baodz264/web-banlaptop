import { useEffect, useState, useCallback } from "react";
import { Table, Button, Space, Avatar, Tag, Card } from "antd";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import userService from "../../../services/user.service";
import { useToast } from "../../../context/ToastProvider";

const API_URL = "http://tbtshoplt.xyz";

const CustomerList = () => {
  const toast = useToast();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Sử dụng useCallback để ghi nhớ hàm, tránh re-create hàm mỗi khi component render
  const fetchCustomers = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const res = await userService.getUsers({
        page,
        limit,
        role: "customer", 
      });

      const result = res?.data?.data;

      if (!result) return;

      setData(result.items);

      setPagination({
        current: result.currentPage,
        pageSize: limit,
        total: result.totalItems,
      });
    } catch (err) {
      toast.error("Lỗi tải khách hàng");
    } finally {
      setLoading(false);
    }
  }, [toast]); // toast được đưa vào dependency vì nó từ context

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]); // Bây giờ fetchCustomers đã an toàn để đưa vào dependency

  const handleTableChange = (pag) => {
    fetchCustomers(pag.current, pag.pageSize);
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar;
    if (avatar.startsWith("/")) return `${API_URL}${avatar}`;
    return `${API_URL}/uploads/users/${avatar}`;
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      render: (avatar, record) => {
        const url = getAvatarUrl(avatar);

        return url ? (
          <Avatar src={url} />
        ) : (
          <Avatar icon={<UserOutlined />}>
            {record.name?.charAt(0)}
          </Avatar>
        );
      },
    },
    { title: "Tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "SĐT", dataIndex: "phone" },

    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) =>
        status === 1 ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Bị khóa</Tag>
        ),
    },

    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/customers/detail/${record.id}`}>
            <Button icon={<EyeOutlined />} title="Xem chi tiết" />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý khách hàng">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default CustomerList;