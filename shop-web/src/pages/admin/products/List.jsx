import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Image,
  Tag,
  Typography,
  Popconfirm,
  Input,
  Card,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

import productService from "../../../services/product.service";
import categoryService from "../../../services/category.service";
import BrandService from "../../../services/brand.service";
import exportService from "../../../services/export.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;
const { Option } = Select;

const ProductList = () => {
  const toast = useToast();

  // ================= STATE =================
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    category_id: null,
    brand_id: null,
    status: null,
  });

  // ================= FETCH PRODUCTS (Sử dụng useCallback) =================
  const fetchProducts = useCallback(async (page = 1, limit = pagination.pageSize) => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        page,
        limit,
        ...filters,
      });

      const data = res.data.data || {};
      const items = Array.isArray(data.items) ? data.items : [];
      const totalItems = data.totalItems || 0;
      const currentPage = data.currentPage || 1;

      setProducts(items);
      setPagination((prev) => ({
        ...prev,
        current: currentPage,
        pageSize: limit,
        total: totalItems,
      }));
    } catch (err) {
      toast.error("Không tải được sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.pageSize, toast]); // Dependency của useCallback

  // ================= FETCH CATEGORIES (Sử dụng useCallback) =================
  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getCategories({ page: 1, limit: 1000 });
      const data = res.data.data || {};
      setCategories(Array.isArray(data.items) ? data.items : []);
    } catch {
      toast.error("Không tải được danh mục");
    }
  }, [toast]);

  // ================= FETCH BRANDS (Sử dụng useCallback) =================
  const fetchBrands = useCallback(async () => {
    try {
      const res = await BrandService.getBrands({ page: 1, limit: 1000 });
      const data = res.data.data || {};
      setBrands(Array.isArray(data.items) ? data.items : []);
    } catch {
      toast.error("Không tải được thương hiệu");
    }
  }, [toast]);

  // ================= LIFECYCLE =================
  
  // Khởi tạo dữ liệu ban đầu
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts();
  }, [fetchCategories, fetchBrands, fetchProducts]);

  // Xử lý debounce khi filter thay đổi
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProducts(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchProducts]);

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      toast.success("Xóa sản phẩm thành công");
      fetchProducts(pagination.current, pagination.pageSize);
    } catch {
      toast.error("Xóa sản phẩm thất bại");
    }
  };

  // ================= EXPORT =================
  const handleExport = async (format) => {
    try {
      await exportService.exportData("products", format);
      toast.success(`Xuất file ${format.toUpperCase()} thành công`);
    } catch {
      toast.error(`Xuất file ${format.toUpperCase()} thất bại`);
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { title: "ID", dataIndex: "id", width: 70 },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      render: (thumb) =>
        thumb ? <Image src={`http://tbtshoplt.xyz${thumb}`} width={50} /> : "Không có",
    },
    { title: "Tên sản phẩm", dataIndex: "name" },
    { title: "Danh mục", render: (_, record) => record.Category?.name || "Không có" },
    { title: "Thương hiệu", render: (_, record) => record.Brand?.name || "Không có" },
    {
      title: "Loại",
      dataIndex: "product_type",
      render: (type) =>
        type === "main" ? <Tag color="blue">Sản phẩm chính</Tag> : <Tag color="purple">Phụ kiện</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (status === 1 ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngừng hoạt động</Tag>),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/products/detail/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/admin/products/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm?"
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

  // ================= RENDER =================
  return (
    <div className="p-6">
      <Card>
        {/* HEADER */}
        <div className="flex justify-between mb-5">
          <Title level={2}>Quản lý sản phẩm</Title>
          <Space>
            <Link to="/admin/products/add">
              <Button type="primary" icon={<PlusOutlined />} size="large">
                Thêm sản phẩm
              </Button>
            </Link>
            <Button icon={<FileExcelOutlined />} onClick={() => handleExport("excel")}>Xuất Excel</Button>
            <Button icon={<FilePdfOutlined />} onClick={() => handleExport("pdf")}>Xuất PDF</Button>
          </Space>
        </div>

        {/* FILTERS */}
        <Space wrap className="mb-4">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            placeholder="Chọn danh mục"
            allowClear
            style={{ minWidth: 150 }}
            value={filters.category_id}
            onChange={(value) => setFilters({ ...filters, category_id: value })}
          >
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>{cat.name}</Option>
            ))}
          </Select>
          <Select
            placeholder="Chọn thương hiệu"
            allowClear
            style={{ minWidth: 150 }}
            value={filters.brand_id}
            onChange={(value) => setFilters({ ...filters, brand_id: value })}
          >
            {brands.map((brand) => (
              <Option key={brand.id} value={brand.id}>{brand.name}</Option>
            ))}
          </Select>
          <Select
            placeholder="Trạng thái"
            allowClear
            style={{ minWidth: 150 }}
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
          >
            <Option value={1}>Hoạt động</Option>
            <Option value={0}>Ngừng hoạt động</Option>
          </Select>
        </Space>

        {/* TABLE */}
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showTotal: (total) => `Tổng ${total} sản phẩm`,
            onChange: (page, pageSize) => fetchProducts(page, pageSize),
          }}
        />
      </Card>
    </div>
  );
};

export default ProductList;