import { Card, Image, Row, Col, Empty } from "antd";
import { CameraOutlined } from "@ant-design/icons";

const ShipmentProof = ({ proofs = [] }) => {

  if (!proofs.length) {

    return (
      <Card
        title={
          <>
            <CameraOutlined /> Ảnh xác nhận giao hàng
          </>
        }
        style={{ marginTop: 20 }}
      >
        <Empty description="Chưa có ảnh xác nhận giao hàng" />
      </Card>
    );

  }

  return (

    <Card
      title={
        <>
          <CameraOutlined /> Ảnh xác nhận giao hàng
        </>
      }
      style={{ marginTop: 20 }}
    >

      <Row gutter={[16, 16]}>

        {proofs.map((p) => (

          <Col key={p.id} xs={24} sm={12} md={8} lg={6}>

            <Image
              width="100%"
              style={{
                borderRadius: 8,
                objectFit: "cover"
              }}
              src={`http://tbtshoplt.xyz${p.image}`}
            />

          </Col>

        ))}

      </Row>

    </Card>

  );

};

export default ShipmentProof;
