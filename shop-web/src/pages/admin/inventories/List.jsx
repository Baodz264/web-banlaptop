import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Typography,
  Popconfirm,
  Card,
  Spin
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  DownloadOutlined
} from "@ant-design/icons";

import inventoryService from "../../../services/inventory.service";
import variantService from "../../../services/variant.service";
import exportService from "../../../services/export.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;

const List = () => {
  const toast = useToast();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // ================= FETCH =================
  const fetchInventories = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await inventoryService.getInventories({ page, limit });
      const inventoryData = res.data?.data || {};
      const items = inventoryData.items || [];
      const totalItems = inventoryData.totalItems || items.length;
      const currentPage = inventoryData.currentPage || page;

      const variantIds = items.map((i) => i.variant_id).filter(Boolean);

      const variantResList = await Promise.all(
        variantIds.map((id) => variantService.getById(id))
      );
      const variants = variantResList.map((r) => r.data?.data || null);

      const mappedItems = items.map((item) => {
        const variant = variants.find((v) => v.id === item.variant_id);
        return { ...item, Variant: variant };
      });

      setData(mappedItems);
      setPagination((prev) => ({
        ...prev,
        current: currentPage,
        pageSize: limit,
        total: totalItems
      }));
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách tồn kho ❌");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInventories(1, pagination.pageSize);
  }, [fetchInventories, pagination.pageSize]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await inventoryService.deleteInventory(id);
      toast.success("Xóa tồn kho thành công ✅");
      fetchInventories(pagination.current, pagination.pageSize);
    } catch (err) {
      console.error(err);
      toast.error("Xóa tồn kho thất bại ❌");
    }
  };

  // ================= EXPORT =================
  const handleExport = async (format) => {
    try {
      await exportService.exportData("inventories", format);
      toast.success(`Export ${format.toUpperCase()} thành công`);
    } catch (err) {
      console.error(err);
      toast.error(`Export ${format.toUpperCase()} thất bại`);
    }
  };

  // ================= COLUMNS =================
  const columns = [
    {
      title: "STT",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: "Sản phẩm",
      render: (_, record) => record.Variant?.Product?.name || "-"
    },
    {
      title: "Biến thể (SKU)",
      render: (_, record) => {
        const v = record.Variant;
        if (!v) return "-";
        const attrs = v.AttributeValues?.length
          ? v.AttributeValues
              .map((attr) => `${attr.Attribute.name}:${attr.value}`)
              .join(", ")
          : "";
        return `${v.sku}${attrs ? " - " + attrs : ""}`;
      }
    },
    {
      title: "Nhà cung cấp",
      render: (_, record) => record.Supplier?.name || "-"
    },
    {
      title: "Số lượng",
      dataIndex: "quantity"
    },
    {
      title: "Giá nhập",
      dataIndex: "cost_price",
      render: (v) => (v ? `${Number(v).toLocaleString()} đ` : "-")
    },
    {
      title: "Ngày nhập",
      dataIndex: "import_date",
      render: (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "-")
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/inventories/detail/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>

          <Link to={`/admin/inventories/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có chắc muốn xóa tồn kho này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
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
        title={<Title level={2}>Danh sách tồn kho</Title>}
        extra={
          <Space>
            <Button icon={<DownloadOutlined />} onClick={() => handleExport("excel")}>
              Excel
            </Button>
            <Button icon={<DownloadOutlined />} onClick={() => handleExport("pdf")}>
              PDF
            </Button>

            <Link to="/admin/inventories/add">
              <Button type="primary" icon={<PlusOutlined />}>
                Nhập kho
              </Button>
            </Link>
          </Space>
        }
      >
        {loading ? (
          <Spin style={{ width: "100%", padding: "50px 0" }} />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              onChange: (page, pageSize) => fetchInventories(page, pageSize),
              onShowSizeChange: (_, size) => fetchInventories(1, size)
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default List;
