import { Row, Col, Image, Typography, Card, Tag, Divider } from "antd";

const { Text, Title, Paragraph } = Typography;

const ProductInfo = ({ product }) => {

  if (!product) return null;

  return (

    <Card
      title={<Title level={4}>Thông tin sản phẩm</Title>}
      style={{ borderRadius: 10 }}
    >

      <Row gutter={[24, 24]}>

        {/* Ảnh sản phẩm */}
        <Col xs={24} md={10}>

          <Image
            src={`http://tbtshoplt.xyz${product.thumbnail}`}
            width="100%"
            style={{
              borderRadius: 10,
              objectFit: "cover"
            }}
          />

        </Col>

        {/* Thông tin */}
        <Col xs={24} md={14}>

          <Row gutter={[16, 16]}>

            <Col span={12}>
              <Text strong>Mã sản phẩm</Text>
              <div>{product.id}</div>
            </Col>

            <Col span={12}>
              <Text strong>Tên sản phẩm</Text>
              <div>{product.name}</div>
            </Col>

            <Col span={12}>
              <Text strong>Danh mục</Text>
              <div>
                <Tag color="blue">
                  {product.Category?.name || "Không có"}
                </Tag>
              </div>
            </Col>

            <Col span={12}>
              <Text strong>Thương hiệu</Text>
              <div>
                <Tag color="purple">
                  {product.Brand?.name || "Không có"}
                </Tag>
              </div>
            </Col>

          </Row>

          <Divider />

          <Text strong>Mô tả sản phẩm</Text>

          <Paragraph style={{ marginTop: 10 }}>
            {product.description || "Không có mô tả"}
          </Paragraph>

        </Col>

      </Row>

    </Card>

  );
};

export default ProductInfo;
