import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Table,
  Card,
  Tag,
  Button,
  Typography
} from "antd";

import { EyeOutlined } from "@ant-design/icons";

import inventoryLogService from "../../../services/inventoryLog.service";

const { Title } = Typography;

const List = () => {

  const [data, setData] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await inventoryLogService.getLogs();
      setData(res.data.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [

    // ✅ STT
    {
      title: "STT",
      render: (_, __, index) => index + 1,
      width: 70
    },

    {
      title: "Sản phẩm",
      render: (_, r) => r.Variant?.Product?.name
    },

    {
      title: "Biến thể (SKU)",
      dataIndex: ["Variant", "sku"]
    },

    {
      title: "Loại",
      dataIndex: "type",
      render: (t) => {
        if (t === "import")
          return <Tag color="green">Nhập kho</Tag>;

        if (t === "export")
          return <Tag color="red">Xuất kho</Tag>;

        return <Tag color="orange">Điều chỉnh</Tag>;
      }
    },

    {
      title: "Số lượng",
      dataIndex: "quantity"
    },

    {
      title: "Thao tác",
      render: (_, r) => (
        <Link to={`/admin/inventoryLogs/detail/${r.id}`}>
          <Button icon={<EyeOutlined />} />
        </Link>
      )
    }

  ];

  return (
    <div className="p-6">
      <Card>
        <Title level={3}>
          Lịch sử nhập xuất kho
        </Title>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id" // vẫn giữ để React render ổn định
        />
      </Card>
    </div>
  );
};

export default List;
