import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Space, Avatar, Tag, Popconfirm, Card } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  UserOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import userService from "../../../services/user.service";
import exportService from "../../../services/export.service";
import { useToast } from "../../../context/ToastProvider";

const API_URL = "http://tbtshoplt.xyz";

const List = () => {
  const toast = useToast();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const res = await userService.getUsers({ page, limit });
      const result = res?.data?.data;

      if (!result) return;

      setData(result.items);

      setPagination({
        current: result.currentPage,
        pageSize: limit,
        total: result.totalItems,
      });
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers(1, 10);
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      toast.success("Xóa người dùng thành công");
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại");
    }
  };

  const handleExport = async (format) => {
    try {
      await exportService.exportData("users", format);
      toast.success(`Export ${format.toUpperCase()} thành công`);
    } catch {
      toast.error(`Export ${format.toUpperCase()} thất bại`);
    }
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar;
    if (avatar.startsWith("/")) return `${API_URL}${avatar}`;
    return `${API_URL}/uploads/users/${avatar}`;
  };

  // ✅ Mapping role cho gọn
  const roleMap = {
    admin: { color: "red", label: "Quản trị" },
    staff: { color: "purple", label: "Nhân viên" },
    shipper: { color: "blue", label: "Shipper" },
    user: { color: "green", label: "Khách hàng" },
  };

  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      render: (avatar, record) => {
        const avatarUrl = getAvatarUrl(avatar);
        return avatarUrl ? (
          <Avatar size={50} src={avatarUrl} />
        ) : (
          <Avatar size={50} icon={<UserOutlined />}>
            {record.name?.charAt(0)}
          </Avatar>
        );
      },
    },
    { title: "Tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Điện thoại", dataIndex: "phone" },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role) => {
        const roleInfo = roleMap[role] || roleMap.user;
        return <Tag color={roleInfo.color}>{roleInfo.label}</Tag>;
      },
    },
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
          <Link to={`/admin/users/detail/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/admin/users/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pag) => {
    fetchUsers(pag.current, pag.pageSize);
  };

  return (
    <Card
      title="Quản lý người dùng"
      extra={
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleExport("excel")}
          >
            Excel
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleExport("pdf")}
          >
            PDF
          </Button>
          <Link to="/admin/users/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm người dùng
            </Button>
          </Link>
        </Space>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default List;
