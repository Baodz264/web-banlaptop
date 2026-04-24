import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Table,
  Button,
  Input,
  Tag,  
  Avatar,
  Popconfirm,
  Space,
} from "antd";

import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import bannerService from "../../../services/banner.service";
import { useToast } from "../../../context/ToastProvider";

const { Search } = Input;

const API_URL = process.env.REACT_APP_API_URL || "tbtshoplt.xyz";

const List = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState("");

  // tạo đường dẫn hình ảnh
  const buildImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/60";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return `${API_URL}${img}`;
    if (img.startsWith("uploads")) return `${API_URL}/${img}`;
    return `${API_URL}/uploads/banners/${img}`;
  };

  // lấy danh sách banner
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bannerService.getList({
        page: pagination.page,
        limit: pagination.limit,
        search: search,
      });

      const result = res?.data?.data;
      setData(result?.items || []);

      setPagination((prev) => ({
        ...prev,
        total: result?.totalItems || 0,
        totalPages: result?.totalPages || 0,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Không tải được danh sách banner");
    }
    setLoading(false);
  }, [pagination.page, pagination.limit, search, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // xóa banner
  const handleDelete = async (id) => {
    try {
      await bannerService.delete(id);
      toast.success("Xóa banner thành công");
      fetchData();
    } catch (error) {
      toast.error("Xóa banner thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      width: 80,
      render: (_, __, index) =>
        (pagination.page - 1) * pagination.limit + index + 1,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (img) => (
        <Avatar shape="square" size={60} src={buildImageUrl(img)} />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Vị trí",
      dataIndex: "position",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) =>
        status === 1 ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Tắt</Tag>
        ),
    },
    {
      title: "Chức năng",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/banners/edit/${record.id}`)}
          />

          <Popconfirm
            title="Bạn có chắc muốn xóa banner này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={`Quản lý Banner (Trang ${pagination.page}/${pagination.totalPages})`}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/banners/add")}
        >
          Thêm mới
        </Button>
      }
    >
      <Search
        placeholder="Tìm banner..."
        allowClear
        enterButton
        style={{ width: 300, marginBottom: 20 }}
        onSearch={(value) => {
          setSearch(value);
          setPagination((prev) => ({
            ...prev,
            page: 1,
          }));
        }}
      />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: false,
          showTotal: (total) =>
            `Tổng ${total} banner | Trang ${pagination.page}/${pagination.totalPages}`,
          onChange: (page) => {
            setPagination((prev) => ({
              ...prev,
              page: page,
            }));
          },
        }}
      />
    </Card>
  );
};

export default List;
