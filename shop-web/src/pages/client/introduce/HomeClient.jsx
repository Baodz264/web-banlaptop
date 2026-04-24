import { useEffect, useState } from "react";
import { Row, Col, Typography, Spin, Card, Space, Button } from "antd";
import { Link } from "react-router-dom";
import {
  SafetyCertificateOutlined,
  RocketOutlined,
  CustomerServiceOutlined,
  ToolOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import productService from "../../../services/product.service";
import BrandService from "../../../services/brand.service";
import variantService from "../../../services/variant.service"; 

import ProductCard from "../../../components/ui/ProductCard";

const { Title, Paragraph, Text } = Typography;

const BASE_URL = "http://tbtshoplt.xyz";

const IntroducePage = () => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FETCH DATA (GIỮ NGUYÊN LOGIC) =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [resP, resB] = await Promise.all([
        productService.getProducts({
          status: 1,
          page: 1,
          limit: 12,
        }),
        BrandService.getBrands({ status: 1 }),
      ]);

      const rawProducts = resP?.data?.data?.items || [];

      const stockChecks = await Promise.all(
        rawProducts.map(async (p) => {
          try {
            const vRes = await variantService.getByProduct(p.id);
            const variants = vRes?.data?.data || [];
            const totalStock = variants.reduce(
              (sum, v) => sum + (v.stock || 0),
              0
            );
            return totalStock > 0 ? p : null;
          } catch {
            return null;
          }
        })
      );

      const validProducts = stockChecks
        .filter((p) => p !== null)
        .slice(0, 8);

      setProducts(validProducts);
      setBrands(resB?.data?.data?.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        {/* FIX: Thay tip thành description */}
        <Spin size="large" description="Đang khởi tạo không gian công nghệ..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "60px 20px" }}>
      
      {/* HERO SECTION */}
      <div style={{ textAlign: "center", marginBottom: 100 }}>
        <Text strong style={{ color: '#1890ff', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Welcome to Tech Store
        </Text>
        <Title style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, marginTop: 10 }}>
          Nâng Tầm Trải Nghiệm Công Nghệ
        </Title>
        <Paragraph style={{ fontSize: 18, color: "#666", maxWidth: 750, margin: "0 auto", lineHeight: 1.6 }}>
          Chuyên cung cấp các dòng Laptop, PC và Linh kiện máy tính chính hãng. 
          Chúng tôi đồng hành cùng bạn trên con đường chinh phục đỉnh cao công việc và giải trí.
        </Paragraph>
      </div>

      {/* WHY CHOOSE US */}
      <Row gutter={[24, 24]} style={{ marginBottom: 100 }}>
        {[
          { icon: <SafetyCertificateOutlined />, title: "Chính hãng 100%", desc: "Cam kết nguồn gốc rõ ràng từ Dell, ASUS, Apple..." },
          { icon: <RocketOutlined />, title: "Giao hàng nhanh", desc: "Vận chuyển thần tốc, đóng gói chuyên nghiệp." },
          { icon: <ToolOutlined />, title: "Hỗ trợ kỹ thuật", desc: "Đội ngũ chuyên gia xử lý sự cố 24/7." },
          { icon: <CustomerServiceOutlined />, title: "Hậu mãi tốt", desc: "Chính sách đổi trả 1-1 cực kỳ linh hoạt." },
        ].map((item, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              hoverable
              style={{
                textAlign: "center",
                height: "100%",
                borderRadius: 16,
                border: "1px solid #f0f0f0",
                transition: 'all 0.3s'
              }}
              /* FIX: Thay bodyStyle thành styles={{ body: ... }} */
              styles={{
                body: { padding: '40px 20px' }
              }}
            >
              <div style={{ fontSize: 45, color: "#1890ff", marginBottom: 20 }}>
                {item.icon}
              </div>
              <Title level={4} style={{ marginBottom: 15 }}>{item.title}</Title>
              <Text type="secondary" style={{ fontSize: 15 }}>{item.desc}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* BRANDS */}
      <div style={{ marginBottom: 100 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 50, fontWeight: 700 }}>
          Đối Tác Chiến Lược
        </Title>
        <Row gutter={[40, 40]} justify="center" align="middle">
          {brands.map((b) => (
            <Col xs={12} sm={8} md={4} key={b.id}>
              <div style={{ textAlign: "center", padding: '10px' }}>
                <img
                  src={`${BASE_URL}${b.logo}`}
                  alt={b.name}
                  className="brand-logo-img"
                  style={{
                    width: "100%",
                    maxHeight: 50,
                    objectFit: "contain",
                    filter: "grayscale(100%)",
                    opacity: 0.6,
                    transition: "0.4s",
                    cursor: 'pointer'
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* PRODUCT SECTION */}
      <div style={{ marginBottom: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Sản phẩm nổi bật</Title>
            <div style={{ width: 60, height: 4, background: '#1890ff', marginTop: 10, borderRadius: 2 }}></div>
          </div>
          <Link to="/products" style={{ fontWeight: 600, color: '#1890ff', fontSize: 16 }}>
            Xem tất cả <ArrowRightOutlined />
          </Link>
        </div>

        <Row gutter={[20, 20]}>
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        {products.length === 0 && (
          <div style={{ textAlign: "center", padding: '60px', background: '#f5f5f5', borderRadius: 16, color: "#999" }}>
            Hiện chưa có sản phẩm nào còn hàng.
          </div>
        )}
      </div>

      {/* CTA SECTION */}
      <div
        style={{
          textAlign: "center",
          padding: "80px 40px",
          background: "linear-gradient(135deg, #001529 0%, #003a8c 100%)",
          borderRadius: 30,
          color: "#fff",
          boxShadow: "0 20px 40px rgba(0, 21, 41, 0.25)",
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ 
          position: 'absolute', top: '-50px', right: '-50px', width: 200, height: 200, 
          background: 'rgba(24, 144, 255, 0.15)', borderRadius: '50%' 
        }} />

        <Title level={2} style={{ color: "#fff", fontSize: '2.5rem', fontWeight: 700, marginBottom: 20 }}>
          Sẵn sàng nâng cấp thiết bị của bạn?
        </Title>

        <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
          Đừng bỏ lỡ những siêu phẩm công nghệ mới nhất. Nâng cấp ngay hôm nay để bứt phá hiệu suất làm việc!
        </Paragraph>

        <Space size="large">
          <Link to="/products">
            <Button 
              type="primary" 
              size="large" 
              style={{ 
                height: 'auto', padding: "14px 40px", borderRadius: 50, 
                fontWeight: 700, fontSize: 16, border: 'none',
                boxShadow: '0 4px 15px rgba(24, 144, 255, 0.4)'
              }}
            >
              Mua ngay
            </Button>
          </Link>
          <Link to="/chat">
            <Button 
              ghost 
              size="large" 
              style={{ height: 'auto', padding: "14px 40px", borderRadius: 50, fontWeight: 600, fontSize: 16, color: '#fff', borderColor: '#fff' }}
            >
              Liên hệ tư vấn
            </Button>
          </Link>
        </Space>
      </div>

      <style>{`
        .brand-logo-img:hover {
          filter: grayscale(0%) !important;
          opacity: 1 !important;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default IntroducePage;