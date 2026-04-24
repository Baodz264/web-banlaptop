import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import {
  Card,
  Typography,
  Table,
  Row,
  Col,
  Tag,
  Divider,
  Spin,
  message,
} from "antd";

import inventoryService from "../../../services/inventory.service";
import inventoryLogService from "../../../services/inventoryLog.service";
import variantService from "../../../services/variant.service";

const { Title, Text } = Typography;

const Detail = () => {
  const { id } = useParams();

  const [inventory, setInventory] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sử dụng useCallback để tránh tạo lại hàm khi component re-render
  // và giải quyết cảnh báo missing dependency của useEffect
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 1️⃣ Lấy inventory
      const res = await inventoryService.getInventoryById(id);
      const inventoryData = res.data?.data;

      if (!inventoryData) throw new Error("Không tìm thấy tồn kho");

      // 2️⃣ Lấy variant chi tiết kèm AttributeValues
      let variant = null;
      if (inventoryData.variant_id) {
        const variantRes = await variantService.getById(inventoryData.variant_id);
        variant = variantRes.data?.data || null;
      }

      // Gán variant vào inventory
      const inventoryWithVariant = { ...inventoryData, Variant: variant };
      setInventory(inventoryWithVariant);

      // 3️⃣ Lấy logs theo variant
      const logsRes = await inventoryLogService.getLogs({
        variant_id: inventoryData.variant_id,
      });
      const logData =
        logsRes.data?.data?.items || logsRes.data?.data || [];
      setLogs(logData);
    } catch (err) {
      console.error(err);
      message.error("Không tải được dữ liệu ❌");
    } finally {
      setLoading(false);
    }
  }, [id]); // fetchData sẽ chỉ thay đổi khi id thay đổi

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    {
      title: "Loại",
      dataIndex: "type",
      render: (type) => {
        let color = "blue";
        let text = type;

        if (type === "IMPORT") {
          color = "green";
          text = "Nhập kho";
        }

        if (type === "EXPORT") {
          color = "red";
          text = "Xuất kho";
        }

        if (type === "ADJUST") {
          color = "orange";
          text = "Điều chỉnh";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : "-"),
    },
  ];

  if (loading || !inventory) {
    return <Spin style={{ width: "100%", padding: "50px 0" }} />;
  }

  return (
    <>
      <Title level={3} style={{ marginBottom: 20 }}>
        Chi tiết tồn kho
      </Title>

      {/* Thông tin sản phẩm */}
      <Card style={{ marginBottom: 20 }}>
        <Title level={4}>{inventory.Variant?.Product?.name || "-"}</Title>

        <Text strong>Biến thể (SKU): </Text>
        {inventory.Variant
          ? `${inventory.Variant.sku}${
              inventory.Variant.AttributeValues?.length
                ? " - " +
                  inventory.Variant.AttributeValues.map(
                    (attr) => `${attr.Attribute.name}:${attr.value}`
                  ).join(", ")
                : ""
            }`
          : "-"}
      </Card>

      {/* Thông tin tồn kho */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Text strong>Số lượng tồn</Text>
            <Title level={3}>{inventory.quantity}</Title>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Text strong>Giá nhập</Text>
            <Title level={4}>
              {inventory.cost_price?.toLocaleString() || "-"} đ
            </Title>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Text strong>Nhà cung cấp</Text>
            <Title level={5}>
              {inventory.Supplier?.name || "Không có"}
            </Title>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Lịch sử tồn kho */}
      <Card title="Lịch sử nhập xuất kho">
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </>
  );
};

export default Detail;