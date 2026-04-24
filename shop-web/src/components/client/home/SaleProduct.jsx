import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Typography, Spin, Empty } from "antd";
import { motion } from "framer-motion";

import productService from "../../../services/product.service";
import promotionService from "../../../services/promotion.service";
import promotionItemService from "../../../services/promotionItem.service";
import variantService from "../../../services/variant.service";

import ProductCard from "../../ui/ProductCard";

const { Title } = Typography;

function SaleProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= CHECK MATCH =================
  const isMatch = useCallback((product, item) => {
    if (item.apply_type === "all") return true;
    if (item.apply_type === "product") return product.id === item.product_id;
    if (item.apply_type === "brand") return product.brand_id === item.brand_id;
    if (item.apply_type === "category") return product.category_id === item.category_id;
    return false;
  }, []);

  // ================= FETCH DATA =================
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productRes, promoRes, itemRes] = await Promise.all([
        productService.getProducts({ status: 1, limit: 1000 }),
        promotionService.getPromotions({ status: 1, limit: 1000 }),
        promotionItemService.getItems(),
      ]);

      const allProducts = productRes?.data?.data?.items || [];
      const promotions = promoRes?.data?.data?.items || [];
      const items = itemRes?.data?.data || [];
      const now = new Date();

      // 1. Lọc các chương trình khuyến mãi đang hoạt động
      const validPromos = promotions.filter(p => 
        p.status === 1 && 
        (!p.start_date || now >= new Date(p.start_date)) && 
        (!p.end_date || now <= new Date(p.end_date))
      );

      // 2. Tìm sản phẩm khớp với các chương trình khuyến mãi đó
      const productsWithSale = allProducts.filter((product) => {
        return validPromos.some((promo) => {
          const promoItems = items.filter((i) => i.promotion_id === promo.id);
          return promoItems.some((item) => isMatch(product, item));
        });
      });

      // 3. Kiểm tra tồn kho (Stock) của từng sản phẩm
      const finalProducts = await Promise.all(
        productsWithSale.map(async (product) => {
          try {
            const vRes = await variantService.getByProduct(product.id);
            const variants = vRes?.data?.data || [];
            const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
            
            return totalStock > 0 ? product : null;
          } catch (error) {
            return null;
          }
        })
      );

      setProducts(finalProducts.filter(p => p !== null));
    } catch (error) {
      console.error("SaleProduct error:", error);
    } finally {
      setLoading(false);
    }
  }, [isMatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Trạng thái đang tải
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        {/* Đã sửa từ tip thành description để hết lỗi Warning */}
        <Spin size="large" description="Đang tải sản phẩm khuyến mãi..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 0" }}>
      <div className="container">
        <Title level={2} style={{ marginBottom: '30px' }}>
          🔥 Sản phẩm đang khuyến mãi
        </Title>

        <Row gutter={[16, 24]}>
          {products.map((product, index) => (
            <Col key={product.id} xs={12} sm={12} md={8} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Thông báo khi không có sản phẩm nào */}
        {!loading && products.length === 0 && (
          <div style={{ marginTop: 60 }}>
            <Empty description="Hiện chưa có sản phẩm khuyến mãi nào còn hàng." />
          </div>
        )}
      </div>
    </div>
  );
}

export default SaleProduct;