import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Empty, Button, Spin, message } from "antd";
import { ShoppingOutlined, HeartFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import WishlistService from "../../../services/wishlist.service";
import ProductCard from "../../../components/ui/ProductCard";

const { Title, Text } = Typography;

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await WishlistService.getWishlist();
      setWishlistItems(res?.data?.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          gap: "16px"
        }}
      >
        <Spin size="large" />
        <Text type="secondary">Đang tìm lại những món đồ bạn thích...</Text>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px 0",
        minHeight: "80vh",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Header */}
        <header
          style={{
            marginBottom: 40,
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <HeartFilled style={{ color: "#ff4d4f", fontSize: 24 }} />
            <Title
              level={2}
              style={{
                margin: 0,
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              Danh sách yêu thích
            </Title>
          </div>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Bạn đang có <b>{wishlistItems.length}</b> sản phẩm trong danh sách.
          </Text>
        </header>

        {/* Content */}
        {wishlistItems.length === 0 ? (
          <div style={{ padding: "100px 0", textAlign: "center" }}>
            <Empty
              description={
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Text style={{ fontSize: 18, color: "#595959" }}>
                    Danh sách này đang trống
                  </Text>
                  <Text type="secondary">
                    Hãy lướt xem các sản phẩm và nhấn trái tim để lưu lại nhé!
                  </Text>
                </div>
              }
            >
              <Link to="/product">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingOutlined />}
                  style={{
                    borderRadius: 8,
                    height: 45,
                    padding: "0 30px",
                    marginTop: 20,
                  }}
                >
                  Mua sắm ngay
                </Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <Row gutter={[24, 32]}>
            {wishlistItems.map((item) => (
              <Col key={item.product_id} xs={24} sm={12} md={8} lg={6}>
                <div className="wishlist-item-wrapper">
                  <ProductCard
                    product={item.Product}
                    initialIsFavorite={true}
                  />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <style>
        {`
        .wishlist-item-wrapper {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .wishlist-item-wrapper:hover {
          transform: translateY(-8px);
        }
        `}
      </style>
    </div>
  );
}

export default WishlistPage;