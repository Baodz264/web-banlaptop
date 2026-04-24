import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Tag,
  Card,
  Button,
  Space,
  Popconfirm,
  Tooltip,
  Input,
  Select,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import warrantyService from "../../../services/warranty.service";
import OrderItemService from "../../../services/orderItem.service";
import { useToast } from "../../../context/ToastProvider";

const { Option } = Select;

const List = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
  });

  const toast = useToast();

  /* ================= FETCH DATA ================= */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const query = {
        page: pagination.current,
        limit: pagination.pageSize,
        keyword: filters.keyword,
        status: filters.status,
      };

      const [warrantyRes, orderItemRes] = await Promise.all([
        warrantyService.getWarranties(query),
        OrderItemService.getOrderItems({ limit: 1000 }),
      ]);

      const warranties = warrantyRes?.data?.data?.items || [];
      const total = warrantyRes?.data?.data?.total || 0;
      const orderItems = orderItemRes?.data?.data?.items || [];

      const mapped = warranties.map((w) => {
        const orderItem = orderItems.find(
          (i) => String(i.id) === String(w.order_item_id)
        );

        let productName = "Không xác định";
        let variantName = "N/A";
        let isError = false;
        let isCombo = false;

        if (!orderItem) {
          isError = true;
        } else {
          isCombo =
            !!orderItem.bundle_id ||
            orderItem.product_name?.toLowerCase().includes("combo");

          if (isCombo) {
            productName = orderItem.product_name || "Gói Combo";
            variantName = "Bundle/Combo";
          } else {
            const variantObj = orderItem.Variant;
            const productObj = variantObj?.Product;

            productName =
              productObj?.name ||
              orderItem.product_name ||
              "Sản phẩm không tồn tại";

            if (
              variantObj?.AttributeValues &&
              variantObj.AttributeValues.length > 0
            ) {
              variantName = variantObj.AttributeValues.map(
                (attr) => `${attr.Attribute?.name}: ${attr.value}`
              ).join(" - ");
            } else {
              variantName =
                variantObj?.sku || orderItem.variant_name || "N/A";
            }

            if (!variantObj) isError = true;
          }
        }

        return {
          ...w,
          product_name: productName,
          variant_name: variantName,
          _isCombo: isCombo,
          _hasError: isError,
        };
      });

      setData(mapped);
      
      // Sử dụng hàm cập nhật trạng thái để so sánh giá trị cũ, tránh loop
      setPagination((prev) => {
        if (prev.total !== total) {
          return { ...prev, total };
        }
        return prev;
      });
      
    } catch (error) {
      console.error("🔥 Error:", error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
    // FIX: Thêm 'pagination' vào dependency thay vì chỉ thuộc tính con
  }, [pagination, filters, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= HANDLE ================= */

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, keyword: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleFilterStatus = (value) => {
    setFilters((prev) => ({ ...prev, status: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pag) => {
    setPagination((prev) => ({
      ...prev,
      current: pag.current,
      pageSize: pag.pageSize,
    }));
  };

  const handleDelete = async (id) => {
    try {
      await warrantyService.deleteWarranty(id);
      toast.success("Xóa thành công");
      fetchData();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const statusTag = (s) => {
    const map = {
      active: { color: "green", text: "Đang hiệu lực" },
      expired: { color: "red", text: "Hết hạn" },
      processing: { color: "orange", text: "Đang xử lý" },
      completed: { color: "blue", text: "Hoàn tất" },
    };
    const config = map[s?.toLowerCase()] || { color: "default", text: s };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  /* ================= COLUMNS ================= */

  const columns = [
    {
      title: "Mã",
      dataIndex: "warranty_code",
      render: (text, record) => (
        <Space>
          <b style={{ color: "#1890ff" }}>{text}</b>
          {record._hasError && !record._isCombo && (
            <Tooltip title="Dữ liệu lỗi">
              <ExclamationCircleOutlined style={{ color: "#faad14" }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "product_name",
    },
    {
      title: "Thuộc tính",
      dataIndex: "variant_name",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Thời hạn",
      render: (_, r) => (
        <div>
          <div>📅 {formatDate(r.start_date)}</div>
          <div>⌛ {formatDate(r.end_date)}</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: statusTag,
    },
    {
      title: "Hành động",
      render: (_, r) => (
        <Space>
          <Link to={`/admin/warranties/edit/${r.id}`}>
            <Button icon={<EditOutlined />} size="small" />
          </Link>
          <Popconfirm
            title="Xóa?"
            onConfirm={() => handleDelete(r.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ================= UI ================= */

  return (
    <Card
      title="🛡️ Quản lý bảo hành"
      extra={
        <Link to="/admin/warranties/add">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm mới
          </Button>
        </Link>
      }
    >
      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input
            placeholder="Tìm mã bảo hành..."
            allowClear
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>

        <Col span={6}>
          <Select
            placeholder="Lọc trạng thái"
            allowClear
            style={{ width: "100%" }}
            onChange={handleFilterStatus}
          >
            <Option value="active">Đang hiệu lực</Option>
            <Option value="expired">Hết hạn</Option>
            <Option value="processing">Đang xử lý</Option>
            <Option value="completed">Hoàn tất</Option>
          </Select>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default List;