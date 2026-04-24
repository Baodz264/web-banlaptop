import React, { useEffect, useState } from "react";
import {
  Card,
  Steps,
  Typography,
  Spin,
  Tag,
  Row,
  Col,
  Image,
  Empty,
  Alert,
} from "antd";
import { useParams } from "react-router-dom";
import ShipmentService from "../../../services/shipment.service";

const { Title, Text } = Typography;

const statusMap = {
  pending: "Chờ lấy hàng",
  picked: "Đã lấy hàng",
  shipping: "Đang giao",
  delivered: "Đã giao",
  failed: "Thất bại",
};

// ===== NORMALIZE =====
const normalizeShipment = (item) => {
  if (!item) return null;

  let latestLocation = null;

  if (Array.isArray(item.Locations) && item.Locations.length > 0) {
    latestLocation = [...item.Locations].sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    )[0];
  }

  return {
    id: item.id,
    tracking_code: item.tracking_code || "N/A",
    shipping_status: item.shipping_status || "pending",
    distance_km: item.distance_km || null,
    location: latestLocation,
    proofs: Array.isArray(item.ShipmentProofs)
      ? item.ShipmentProofs
      : [],
  };
};

export default function ShipmentTracking() {
  const { id } = useParams();

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipment = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await ShipmentService.getShipments();

        const data = res?.data?.data;
        const items = Array.isArray(data?.items) ? data.items : [];

        const selected = items.find(
          (s) => Number(s.id) === Number(id)
        );

        if (!selected) {
          setShipment(null);
          return;
        }

        setShipment(normalizeShipment(selected));
      } catch (err) {
        console.error(err);
        setError("Có lỗi khi tải dữ liệu vận chuyển");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchShipment();
  }, [id]);

  // ===== UI =====
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Lỗi"
        description={error}
        style={{ margin: 20 }}
      />
    );
  }

  if (!shipment) {
    return (
      <Card style={{ margin: 20 }}>
        <Empty description="Không tìm thấy shipment" />
      </Card>
    );
  }

  const steps = ["pending", "picked", "shipping", "delivered"];
  const currentIndex = steps.indexOf(shipment.shipping_status);

  const lat = shipment.location?.latitude;
  const lng = shipment.location?.longitude;

  return (
    <Card style={{ maxWidth: 900, margin: "20px auto" }}>
      <Title level={4}>Tracking đơn #{shipment.id}</Title>

      <Text>Mã vận đơn: </Text>
      <Text strong copyable>
        {shipment.tracking_code}
      </Text>

      {/* STATUS */}
      <Card title="Trạng thái" style={{ marginTop: 20 }}>
        <Steps
          current={currentIndex === -1 ? 0 : currentIndex}
          items={steps.map((s) => ({
            key: s,
            title: statusMap[s],
          }))}
        />

        <Tag style={{ marginTop: 10 }}>
          {statusMap[shipment.shipping_status]}
        </Tag>
      </Card>

      {/* LOCATION + MAP + PROOF */}
      <Row gutter={20} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Vị trí">
            {shipment.location ? (
              <>
                <Tag>Lat: {lat}</Tag>
                <Tag>Lng: {lng}</Tag>
                <br />
                <Text type="secondary">
                  {shipment.location.updated_at}
                </Text>

                {/* ===== GOOGLE MAP ===== */}
                <div style={{ marginTop: 10 }}>
                  <iframe
                    title="map"
                    width="100%"
                    height="250"
                    style={{ border: 0, borderRadius: 8 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                  ></iframe>
                </div>
              </>
            ) : (
              <Empty description="Chưa có vị trí" />
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Proof">
            {shipment.proofs.length === 0 ? (
              <Empty />
            ) : (
              <Row gutter={[8, 8]}>
                {shipment.proofs.map((item) => (
                  <Col span={12} key={item.id}>
                    <Image
                      src={`http://tbtshoplt.xyz${item.image}`}
                      style={{
                        height: 100,
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
