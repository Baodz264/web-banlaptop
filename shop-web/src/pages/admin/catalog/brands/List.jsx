import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Avatar,
  Typography,
  Popconfirm,
  Input,
  Card,
  Tooltip
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined
} from "@ant-design/icons";

import brandService from "../../../../services/brand.service";
import exportService from "../../../../services/export.service";
import { useToast } from "../../../../context/ToastProvider";

const { Title } = Typography;

const List = () => {
  const toast = useToast();

  // States
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // URL API cơ sở (Nên đưa vào file config hoặc .env)
  const BASE_URL = "http://tbtshoplt.xyz";

  // ================= FETCH DATA =================
  const fetchBrands = useCallback(async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    try {
      const res = await brandService.getBrands({
        page,
        limit,
        search: search
      });

      const { items, totalItems, currentPage } = res.data.data;

      setBrands(items);
      setPagination(prev => ({
        ...prev,
        current: currentPage,
        total: totalItems,
        pageSize: limit
      }));
    } catch (err) {
      toast.error("Không thể tải danh sách thương hiệu.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // ================= EFFECT: SEARCH DEBOUNCE =================
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBrands(1, pagination.pageSize, searchText);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText, pagination.pageSize, fetchBrands]);

  // ================= ACTIONS =================
  const handleDelete = async (id) => {
    try {
      await brandService.deleteBrand(id);
      toast.success("Đã xóa thương hiệu thành công");
      fetchBrands(pagination.current, pagination.pageSize, searchText);
    } catch (err) {
      toast.error("Xóa thương hiệu thất bại.");
    }
  };

  const handleExport = async (format) => {
    try {
      toast.info(`Đang chuẩn bị file ${format.toUpperCase()}...`);
      await exportService.exportData("brands", format);
      toast.success(`Xuất file ${format.toUpperCase()} thành công!`);
    } catch (err) {
      toast.error(`Lỗi khi xuất file ${format.toUpperCase()}!`);
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: "center",
      // Tính toán STT: (Trang hiện tại - 1) * Số mục mỗi trang + (index của dòng đó + 1)
      render: (text, record, index) => 
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Logo",
      dataIndex: "logo",
      width: 100,
      render: (logo) => (
        <Avatar
          src={logo ? `${BASE_URL}${logo}` : "https://via.placeholder.com/50"}
          shape="square"
          size={50}
        />
      )
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Đường dẫn (Slug)",
      dataIndex: "slug",
      render: (slug) => <code className="text-blue-600">{slug}</code>
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Link to={`/admin/brands/edit/${record.id}`}>
              <Button icon={<EditOutlined />} type="default" />
            </Link>
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa"
            description={`Bạn có chắc chắn muốn xóa thương hiệu "${record.name}"?`}
            okText="Xóa ngay"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <Title level={3} style={{ margin: 0 }}>
            Quản lý Thương hiệu
          </Title>
        }
        extra={
          <Space wrap>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleExport("excel")}
            >
              Xuất Excel
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleExport("pdf")}
            >
              Xuất PDF
            </Button>
            <Link to="/admin/brands/add">
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm thương hiệu mới
              </Button>
            </Link>
          </Space>
        }
      >
        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm thương hiệu..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="max-w-md"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={brands}
          rowKey="id" 
          loading={loading}
          bordered
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `Tổng số ${total} thương hiệu`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize }));
              fetchBrands(page, pageSize, searchText);
            }
          }}
        />
      </Card>
    </div>
  );
};

export default List;