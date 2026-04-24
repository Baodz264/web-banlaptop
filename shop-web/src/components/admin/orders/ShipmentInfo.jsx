import React from "react";
import { Card, Tag, Descriptions } from "antd";
import {
  TruckOutlined,
  NumberOutlined,
  CheckCircleOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const ShipmentInfo = ({ shipment }) => {
  if (!shipment) return null;

  const statusColor = {
    pending: "orange",
    shipping: "blue",
    delivered: "green",
    cancelled: "red"
  };

  const statusText = {
    pending: "Chờ giao hàng",
    shipping: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy"
  };

  return (
    <Card
      title="Thông tin vận chuyển"
      style={{ marginTop: 20 }}
      // THAY ĐỔI Ở ĐÂY: bordered={false} -> variant="borderless"
      variant="borderless" 
    >
      <Descriptions
        column={1}
        bordered
        size="middle"
      >
        <Descriptions.Item
          label={
            <>
              <TruckOutlined /> Đơn vị vận chuyển
            </>
          }
        >
          {shipment.carrier || "Không có"}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <NumberOutlined /> Mã vận đơn
            </>
          }
        >
          {shipment.tracking_code || "Không có"}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <CheckCircleOutlined /> Trạng thái giao hàng
            </>
          }
        >
          <Tag color={statusColor[shipment.shipping_status] || "default"}>
            {statusText[shipment.shipping_status] || shipment.shipping_status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <CalendarOutlined /> Ngày gửi hàng
            </>
          }
        >
          {shipment.shipped_at
            ? dayjs(shipment.shipped_at).format("DD/MM/YYYY HH:mm")
            : "-"}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <CalendarOutlined /> Ngày giao hàng
            </>
          }
        >
          {shipment.delivered_at
            ? dayjs(shipment.delivered_at).format("DD/MM/YYYY HH:mm")
            : "-"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ShipmentInfo;