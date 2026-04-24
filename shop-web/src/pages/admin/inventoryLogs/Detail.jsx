import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography } from "antd";
import inventoryLogService from "../../../services/inventoryLog.service";

const { Title } = Typography;

const Detail = () => {
  const { id } = useParams();
  const [log, setLog] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await inventoryLogService.getLogById(id);
        setLog(res.data.data);
      } catch (error) {
        console.error("Error fetching log:", error);
      }
    };

    fetchLog();
  }, [id]); // id là dependency duy nhất cần thiết

  if (!log) return <Card loading />;

  return (
    <Card>
      <Title level={3}>Inventory Log #{log.id}</Title>
      <p>Product: {log.Variant?.Product?.name}</p>
      <p>Variant: {log.Variant?.sku}</p>
      <p>Type: {log.type}</p>
      <p>Quantity: {log.quantity}</p>
      <p>Note: {log.note}</p>
      <p>Date: {log.created_at}</p>
    </Card>
  );
};

export default Detail;