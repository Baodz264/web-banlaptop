import { Table, Tag, Button, Space } from "antd";
import { Link } from "react-router-dom";
import { EyeOutlined, TruckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const OrderTable = ({ orders = [], loading, pagination, onChange }) => {
  // Mapping trạng thái sang màu và text
  const STATUS_CONFIG = {
    awaiting_payment: { color: "gold", text: "Chờ thanh toán" },
    pending: { color: "orange", text: "Chờ xác nhận" },
    confirmed: { color: "blue", text: "Đã xác nhận" },
    shipping: { color: "purple", text: "Đang giao" },
    delivered: { color: "green", text: "Đã giao" },
    cancelled: { color: "red", text: "Đã hủy" },
    returned: { color: "volcano", text: "Trả hàng" },
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Khách hàng",
      dataIndex: "User",
      key: "user",
      render: (user) =>
        user ? `${user.name} (${user.email || user.phone || "-"})` : "-",
    },
    {
      title: "Tổng tiền",
      dataIndex: "grand_total",
      key: "grand_total",
      render: (v) => `${Number(v || 0).toLocaleString()} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = STATUS_CONFIG[status] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/orders/detail/${record.id}`}>
            <Button type="primary" icon={<EyeOutlined />} size="small" />
          </Link>
          <Link to={`/admin/orders/shipment/${record.id}`}>
            <Button icon={<TruckOutlined />} size="small" />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={orders}
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50"],
      }}
      onChange={(pager) => onChange && onChange(pager.current, pager.pageSize)}
    />
  );
};

export default OrderTable;
