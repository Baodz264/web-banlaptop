import React, { useEffect, useState, useCallback } from "react";
import { 
  Typography, 
  Card, 
  Spin, 
  message, 
  Row, 
  Col, 
  Badge, 
  Button, 
  Empty 
} from "antd";
import { 
  FireOutlined, 
  ShoppingOutlined, 
  ThunderboltOutlined 
} from "@ant-design/icons";
import BundleService from "../../../services/bundle.service";
import BundleItemService from "../../../services/bundleItem.service";
import ProductBundles from "../../../components/client/productdetail/ProductBundles";

const { Title, Text } = Typography;

const BundlePage = () => {
  const [bundles, setBundles] = useState([]);
  const [bundleItems, setBundleItems] = useState({});
  const [loading, setLoading] = useState(false);

  const normalize = (res) =>
    res?.data?.data?.items ||
    res?.data?.data?.rows ||
    res?.data?.data ||
    [];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [bundleRes, itemRes] = await Promise.all([
        BundleService.getBundles({ limit: 1000 }),
        BundleItemService.getItems(),
      ]);

      const bundleList = normalize(bundleRes);
      const itemList = normalize(itemRes);

      setBundles(bundleList);

      const grouped = {};
      itemList.forEach((item) => {
        if (!grouped[item.bundle_id]) {
          grouped[item.bundle_id] = [];
        }
        grouped[item.bundle_id].push(item);
      });

      setBundleItems(grouped);
    } catch (err) {
      console.error("Fetch error:", err);
      message.error("Không thể tải danh sách combo");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ 
      background: "#f0f2f5", 
      minHeight: "100vh", 
      padding: "40px 20px" 
    }}>
      <div style={{ maxWidth: 1200, margin: "auto" }}>
        {/* Header Section */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Badge count={<FireOutlined style={{ color: '#f5222d', fontSize: 24 }} />}>
            <Title level={1} style={{ margin: 0, padding: '0 10px' }}>
              Siêu Ưu Đãi Combo
            </Title>
          </Badge>
          <br />
          <Text type="secondary" style={{ fontSize: 16 }}>
            Tiết kiệm hơn khi mua sắm theo bộ sản phẩm được thiết kế riêng cho bạn
          </Text>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            {/* SỬA LỖI: tip -> description */}
            <Spin size="large" description="Đang săn combo tốt nhất..." />
          </div>
        ) : bundles.length > 0 ? (
          /* SỬA LỖI: bordered={false} -> variant="borderless" (Dành cho Antd v5.21+) 
             Nếu bạn dùng bản cũ hơn một chút, có thể giữ nguyên bordered={false} 
             nhưng đây là cách viết chuẩn mới nhất */
          <Card variant="borderless" style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
             {/* Component hiển thị danh sách combo */}
             <ProductBundles 
                bundles={bundles} 
                bundleItems={bundleItems} 
              />
          </Card>
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="Hiện chưa có chương trình combo nào."
          >
            <Button type="primary" onClick={fetchData}>Thử lại</Button>
          </Empty>
        )}

        {/* Footer Info */}
        <Row gutter={[16, 16]} style={{ marginTop: 40 }}>
          <Col xs={24} md={8}>
            <Card hoverable style={{ textAlign: 'center', borderRadius: 12 }}>
              <ThunderboltOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 16 }} />
              <h3>Mua nhanh chóng</h3>
              <p>Chỉ với một lần click để sở hữu trọn bộ sản phẩm.</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable style={{ textAlign: 'center', borderRadius: 12 }}>
              <ShoppingOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 16 }} />
              <h3>Giá cực hời</h3>
              <p>Cam kết giá combo luôn rẻ hơn mua lẻ từng món.</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable style={{ textAlign: 'center', borderRadius: 12 }}>
              <FireOutlined style={{ fontSize: 32, color: '#ff4d4f', marginBottom: 16 }} />
              <h3>Số lượng có hạn</h3>
              <p>Các chương trình khuyến mãi theo bộ có thời hạn nhất định.</p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BundlePage;