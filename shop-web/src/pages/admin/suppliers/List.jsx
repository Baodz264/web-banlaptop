import { useEffect, useState, useCallback } from "react"; // Thêm useCallback
import { Link } from "react-router-dom";

import {
  Table,
  Button,
  Space,
  Typography,
  Popconfirm,
  Input,
  Card,
  Tag
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined
} from "@ant-design/icons";

import supplierService from "../../../services/supplier.service";
import exportService from "../../../services/export.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;

const List = () => {
  const toast = useToast();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // ================= FETCH (Dùng useCallback để tránh re-render vô tận) =================
  const fetchSuppliers = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await supplierService.getSuppliers({
        page,
        limit,
        search // search được lấy từ state
      });

      const { items, totalItems, currentPage } = res.data.data;

      setSuppliers(items);
      setPagination((prev) => ({
        ...prev,
        current: currentPage,
        pageSize: limit,
        total: totalItems
      }));
    } catch (error) {
      console.error(error);
      toast.error("Không tải được danh sách nhà cung cấp");
    } finally {
      setLoading(false);
    }
  }, [search, toast]); // Re-create hàm khi search hoặc toast thay đổi

  // ================= SIDE EFFECT =================
  useEffect(() => {
    fetchSuppliers(1, pagination.pageSize);
  }, [fetchSuppliers, pagination.pageSize]); 
  // Đã thêm đầy đủ dependency theo cảnh báo ESLint

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await supplierService.deleteSupplier(id);
      toast.success("Xóa nhà cung cấp thành công");
      fetchSuppliers(pagination.current, pagination.pageSize);
    } catch {
      toast.error("Xóa nhà cung cấp thất bại");
    }
  };

  // ================= EXPORT =================
  const handleExport = async (format) => {
    try {
      await exportService.exportData("suppliers", format);
      toast.success(`Export ${format.toUpperCase()} thành công`);
    } catch {
      toast.error(`Export ${format.toUpperCase()} thất bại`);
    }
  };

  // ================= COLUMNS =================
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 70
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name"
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone"
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Địa chỉ",
      dataIndex: "address"
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (value) =>
        value === 1
          ? <Tag color="green">Hoạt động</Tag>
          : <Tag color="red">Ngưng</Tag>
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/suppliers/detail/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>

          <Link to={`/admin/suppliers/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có chắc muốn xóa nhà cung cấp này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card
        title={<Title level={2}>Danh sách nhà cung cấp</Title>}
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

            <Link to="/admin/suppliers/add">
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm nhà cung cấp
              </Button>
            </Link>
          </Space>
        }
      >
        {/* SEARCH */}
        <Input
          placeholder="Tìm nhà cung cấp..."
          prefix={<SearchOutlined />}
          allowClear
          className="mb-4 max-w-md"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <Table
          columns={columns}
          dataSource={suppliers}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              fetchSuppliers(page, pageSize);
            },
            onShowSizeChange: (_, size) => {
              fetchSuppliers(1, size);
            }
          }}
        />
      </Card>
    </div>
  );
};

export default List;