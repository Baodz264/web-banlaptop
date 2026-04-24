import React, { useState, useMemo } from "react";
import { Row, Col, Typography, Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";

import CartTable from "../../../components/client/carts/CartTable";
import CartSummary from "../../../components/client/carts/CartSummary";
import CartEmpty from "../../../components/client/carts/CartEmpty";
import CartLoader from "../../../components/client/carts/CartLoader";

const { Title } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    items: rawItems = [],
    bundles: rawBundles = [],
    bundleItems: rawBundleItems = [],
    loading,
    getFinalPrice,
    products: allProducts = [],
  } = useCart() || {};

  const [selectedRows, setSelectedRows] = useState([]);

  // Xử lý logic gộp thông tin sản phẩm vào bundle items
  const bundleItemsWithProduct = useMemo(() => {
    const safeBundleItems = Array.isArray(rawBundleItems) ? rawBundleItems : [];
    return safeBundleItems.map((bItem) => {
      const product = allProducts.find(
        (p) => String(p.id) === String(bItem.product_id)
      );
      return { ...bItem, Product: product };
    });
  }, [rawBundleItems, allProducts]);

  const items = Array.isArray(rawItems) ? rawItems : [];
  const bundles = Array.isArray(rawBundles) ? rawBundles : [];
  const isCartEmpty = items.length === 0 && bundles.length === 0;

  // Lọc sản phẩm lẻ đã chọn dựa trên checkbox từ CartTable
  const selectedItems = useMemo(() => 
    selectedRows.filter((i) => !i.isComboGroup), 
  [selectedRows]);

  // Lọc các gói combo (bundles) đã chọn
  const selectedBundles = useMemo(() => 
    selectedRows.filter((i) => i.isComboGroup), 
  [selectedRows]);

  // Lọc chi tiết sản phẩm thuộc về các bundle đã chọn
  const selectedBundleItems = useMemo(() => {
    return bundleItemsWithProduct.filter((item) =>
      selectedBundles.some((b) => String(b.id) === String(item.bundle_id))
    );
  }, [bundleItemsWithProduct, selectedBundles]);

  // Trạng thái chờ dữ liệu
  if (loading) return <CartLoader />;

  // Kiểm tra quyền truy cập
  if (!isAuthenticated) {
    return (
      <div style={{ padding: "100px 0" }}>
        <Result
          status="403"
          title="Bạn chưa đăng nhập"
          subTitle="Vui lòng đăng nhập để xem giỏ hàng và hưởng các ưu đãi."
          extra={
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/login")}
            >
              Đăng nhập ngay
            </Button>
          }
        />
      </div>
    );
  }

  // Giỏ hàng trống
  if (isCartEmpty) return <CartEmpty />;

  return (
    <div style={{ padding: "64px 32px", maxWidth: 1400, margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: 48, textAlign: "center", fontWeight: 700 }}>
        Giỏ hàng của bạn
      </Title>

      <Row gutter={[40, 32]}>
        <Col xs={24} lg={16}>
          {/* Bảng danh sách sản phẩm */}
          <CartTable onSelectedChange={setSelectedRows} />
        </Col>

        <Col xs={24} lg={8}>
          {/* Phần tổng kết thanh toán */}
          <div style={{ position: "sticky", top: 32 }}>
            <CartSummary
              items={selectedItems}
              bundles={selectedBundles}
              bundleItems={selectedBundleItems}
              getFinalPrice={getFinalPrice}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;