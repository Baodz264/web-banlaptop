import React from "react";
import { Card, Timeline, Empty, Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const OrderTimeline = ({ logs = [] }) => {
  const data = Array.isArray(logs) ? logs : [];

  // ===== Text hiển thị cho từng trạng thái =====
  const statusText = {
    awaiting_payment: "Chờ thanh toán",
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
    returned: "Trả hàng"
  };

  // ===== Màu sắc tag cho từng trạng thái =====
  const statusColor = {
    awaiting_payment: "gold",
    pending: "orange",
    confirmed: "blue",
    shipping: "purple",
    delivered: "green",
    cancelled: "red",
    returned: "volcano"
  };

  // ===== Icon cho timeline dot =====
  const statusIcon = {
    awaiting_payment: <DollarCircleOutlined />,
    pending: <ClockCircleOutlined />,
    confirmed: <CheckCircleOutlined />,
    shipping: <TruckOutlined />,
    delivered: <CheckCircleOutlined />,
    cancelled: <CloseCircleOutlined />,
    returned: <CloseCircleOutlined />
  };

  // ===== Chuẩn bị items cho Timeline =====
  const timelineItems = data.map((log) => ({
    key: log.id,
    icon: statusIcon[log.new_status] || <ClockCircleOutlined />,
    content: (
      <div style={{ paddingBottom: 16 }}>
        <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: "8px" }}>
          <Tag color={statusColor[log.old_status] || "default"}>
            {statusText[log.old_status] || log.old_status}
          </Tag>
          <span style={{ color: "#bfbfbf" }}>→</span>
          <Tag color={statusColor[log.new_status] || "default"}>
            {statusText[log.new_status] || log.new_status}
          </Tag>
        </div>
        <div style={{ color: "#8c8c8c", fontSize: "12px" }}>
          {dayjs(log.created_at).format("DD/MM/YYYY HH:mm")}
        </div>
      </div>
    ),
  }));

  return (
    <Card 
      title="Lịch sử trạng thái đơn hàng" 
      style={{ marginTop: 20 }}
      variant="outlined" // dùng variant thay cho bordered
    >
      {data.length === 0 ? (
        <Empty description="Chưa có lịch sử trạng thái" />
      ) : (
        <Timeline 
          mode="start" 
          items={timelineItems} 
        />
      )}
    </Card>
  );
};

export default OrderTimeline;
