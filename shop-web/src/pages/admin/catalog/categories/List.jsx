import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import {
  Table,
  Button,
  Space,
  Avatar,
  Tag,
  Typography,
  Popconfirm,
  Card,
  Tooltip,
  Input
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FolderOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  SearchOutlined
} from "@ant-design/icons";

import categoryService from "../../../../services/category.service";
import exportService from "../../../../services/export.service";
import { useToast } from "../../../../context/ToastProvider";

const { Title } = Typography;

const List = () => {
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: "id",
    order: "DESC",
    search: ""
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    showTotal: (total) => `Tổng cộng ${total} mục`,
  });

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        page: 1,
        search: searchText
      }));
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchText]);

  /* ================= FETCH DATA ================= */
  const fetchCategories = useCallback(async () => {
    setLoading(true);

    try {
      const res = await categoryService.getCategories(filters);
      const data = res?.data?.data;

      setCategories(data?.items || []);

      setPagination(prev => ({
        ...prev,
        current: data?.currentPage || 1,
        pageSize: filters.limit,
        total: data?.totalItems || 0
      }));

    } catch (err) {
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (err) {
      toast.error("Xóa danh mục thất bại");
    }
  };

  /* ================= TABLE CHANGE ================= */
  const handleTableChange = (pag, _, sorter) => {
    setFilters(prev => ({
      ...prev,
      page: pag.current,
      limit: pag.pageSize,
      sort: sorter.field || "id",
      order: sorter.order === "ascend" ? "ASC" : "DESC"
    }));
  };

  /* ================= EXPORT ================= */
  const handleExport = async (format) => {
    try {
      await exportService.exportData("categories", format);
      toast.success(`Xuất file ${format.toUpperCase()} thành công!`);
    } catch (err) {
      toast.error(`Xuất file ${format.toUpperCase()} thất bại!`);
    }
  };

  /* ================= COLUMNS ================= */
  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      render: (_, __, index) =>
        (filters.page - 1) * filters.limit + index + 1
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      width: 100,
      render: (img) => (
        <Avatar
          src={img ? `http://tbtshoplt.xyz` : null}
          icon={<FolderOutlined />}
          shape="square"
          size={40}
        />
      )
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      sorter: true
    },
    {
      title: "Slug",
      dataIndex: "slug"
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (s) =>
        s === 1
          ? <Tag color="green">Đang hoạt động</Tag>
          : <Tag color="red">Đang ẩn</Tag>
    },
    {
      title: "Thao tác",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/admin/categories/edit/${record.id}`}>
              <Button icon={<EditOutlined />} />
            </Link>
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa?"
            description={`Bạn có chắc chắn muốn xóa "${record.name}" không?`}
            okText="Xóa"
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
        title={<Title level={3} style={{ margin: 0 }}>Quản lý Danh mục</Title>}
        extra={
          <Space>
            {/* 🔍 SEARCH */}
            <Input
              placeholder="Tìm kiếm danh mục..."
              allowClear
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <Button
              icon={<FileExcelOutlined />}
              onClick={() => handleExport("excel")}
            >
              Excel
            </Button>

            <Button
              icon={<FilePdfOutlined />}
              onClick={() => handleExport("pdf")}
            >
              PDF
            </Button>

            <Link to="/admin/categories/add">
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm
              </Button>
            </Link>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          bordered
        />
      </Card>
    </div>
  );
};

export default List;
