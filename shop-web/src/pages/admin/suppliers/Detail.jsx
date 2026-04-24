import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  message,
  Table,
  Tag,
  Descriptions,
  Divider
} from "antd";

import supplierService from "../../../services/supplier.service";

const { Title } = Typography;

const Detail = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sử dụng useCallback để hàm không bị tạo lại sau mỗi lần render
  const fetchSupplier = useCallback(async () => {
    try {
      setLoading(true);
      const res = await supplierService.getSupplierById(id);
      setSupplier(res.data.data);
    } catch (error) {
      message.error("Không tải được thông tin nhà cung cấp");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]); // Hàm sẽ chỉ thay đổi khi id thay đổi

  useEffect(() => {
    fetchSupplier();
  }, [fetchSupplier]); // Dependency giờ đã an toàn và đầy đủ

  if (loading) {
    return <Card loading className="m-6" />;
  }

  if (!supplier) {
    return <div className="p-6 text-center">Không tìm thấy dữ liệu nhà cung cấp</div>;
  }

  const columns = [
    {
      title: "Mã kho",
      dataIndex: "id",
    },
    {
      title: "SKU biến thể",
      dataIndex: ["Variant", "sku"],
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Giá nhập",
      dataIndex: "cost_price",
      render: (value) => `${Number(value).toLocaleString()} đ`,
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <Title level={3}>Chi tiết nhà cung cấp</Title>

        <Descriptions
          bordered
          column={2}
          style={{ marginTop: 20 }}
        >
          <Descriptions.Item label="Tên nhà cung cấp">
            {supplier.name}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            {supplier.status === 1 ? (
              <Tag color="green">Hoạt động</Tag>
            ) : (
              <Tag color="red">Ngưng hoạt động</Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Số điện thoại">
            {supplier.phone || "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            {supplier.email || "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Địa chỉ" span={2}>
            {supplier.address || "—"}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Title level={4}>Danh sách tồn kho từ nhà cung cấp</Title>

        <Table
          columns={columns}
          dataSource={supplier.Inventories || []}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default Detail;