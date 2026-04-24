import { Card, Typography } from "antd";
import { Link } from "react-router-dom";

// Lấy thêm Paragraph từ Typography
const { Text, Paragraph } = Typography;
const API_URL = "http://tbtshoplt.xyz";

const RelatedProducts = ({ products = [] }) => {
  return (
    <Card
      title="Sản phẩm tương tự"
      style={{ borderRadius: 12 }}
      styles={{ body: { padding: 16 } }}
    >
      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          paddingBottom: 10,
        }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.slug}`}
            style={{ minWidth: 220 }}
          >
            <Card 
              hoverable 
              styles={{ body: { padding: 10 } }}
            >
              <div
                style={{
                  height: 140,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#f5f5f5",
                }}
              >
                <img
                  src={`${API_URL}${p.thumbnail}`}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Thay đổi từ Text sang Paragraph để hỗ trợ ellipsis nhiều dòng */}
              <Paragraph
                strong
                ellipsis={{ rows: 2 }}
                style={{ marginBottom: 4, marginTop: 8, height: 44 }}
              >
                {p.name}
              </Paragraph>

              <Text
                style={{
                  color: "#ff4d4f",
                  fontWeight: 600,
                  display: "block",
                }}
              >
                {p.price?.toLocaleString()}₫
              </Text>
            </Card>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default RelatedProducts;