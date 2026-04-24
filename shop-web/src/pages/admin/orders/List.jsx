import { useEffect, useState} from "react";
import { Card, Input, Select, Space, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import OrderService from "../../../services/order.service";
import exportService from "../../../services/export.service";
import OrderTable from "../../../components/admin/orders/OrderTable";
import { useToast } from "../../../context/ToastProvider";

const { Option } = Select;

const List = () => {
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ search: "", status: "", page: 1, limit: 10 });

  // Sử dụng useEffect để fetch data khi filters thay đổi
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const res = await OrderService.getOrders({
          search: filters.search,
          status: filters.status,
          page: filters.page,
          limit: filters.limit,
        });

        const data = res?.data?.data;

        setOrders(data?.items || []);
        setPagination({
          current: data?.currentPage || 1,
          pageSize: filters.limit,
          total: data?.totalItems || 0,
        });
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải danh sách đơn hàng");
        setOrders([]);
      }
      setLoading(false);
    };

    loadOrders();
  }, [filters, toast]); // Thêm toast vào dependency vì nó từ context

  const handleTableChange = (page, pageSize) => {
    setFilters((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleExport = async (format) => {
    try {
      await exportService.exportData("orders", format);
      toast.success(`Export ${format.toUpperCase()} thành công!`);
    } catch (err) {
      console.error(err);
      toast.error(`Export ${format.toUpperCase()} thất bại!`);
    }
  };

  return (
    <Card
      title="Quản lý đơn hàng"
      extra={
        <Space>
          <Button icon={<DownloadOutlined />} onClick={() => handleExport("excel")}>
            Export Excel
          </Button>
          <Button icon={<DownloadOutlined />} onClick={() => handleExport("pdf")}>
            Export PDF
          </Button>
        </Space>
      }
    >
      {/* Bộ lọc */}
      <Space style={{ marginBottom: 20 }}>
        <Input
          placeholder="Tìm kiếm đơn hàng theo tên/email..."
          allowClear
          style={{ width: 300 }}
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
        />
        <Select
          style={{ width: 220 }}
          placeholder="Lọc trạng thái"
          allowClear
          value={filters.status || undefined}
          onChange={(value) => setFilters((prev) => ({ ...prev, status: value || "", page: 1 }))}
        >
          <Option value="awaiting_payment">Chờ thanh toán</Option>
          <Option value="pending">Chờ xác nhận</Option>
          <Option value="confirmed">Đã xác nhận</Option>
          <Option value="shipping">Đang giao</Option>
          <Option value="delivered">Đã giao</Option>
          <Option value="cancelled">Đã hủy</Option>
          <Option value="returned">Trả hàng</Option>
        </Select>
      </Space>

      {/* Table */}
      <OrderTable
        orders={orders}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default List;