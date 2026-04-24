import React, { useEffect, useState } from "react";
import { Row, Col, Typography } from "antd";

import productService from "../../../services/product.service";
import variantService from "../../../services/variant.service"; // Cần import thêm service này
import ProductCard from "../../ui/ProductCard";

const { Title } = Typography;

function NewProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 1. Lấy danh sách sản phẩm mới
      const res = await productService.getProducts({
        status: 1,
        page: 1,
        limit: 12, // Lấy dư ra một chút để sau khi lọc vẫn đủ 8 cái
      });

      const rawProducts = res.data.data.items;

      // 2. Kiểm tra tồn kho cho từng sản phẩm
      // Lưu ý: Nếu Backend đã có trường total_stock thì bạn chỉ cần filter, 
      // không cần gọi thêm variantService.
      const stockChecks = await Promise.all(
        rawProducts.map(async (p) => {
          try {
            const vRes = await variantService.getByProduct(p.id);
            const variants = vRes?.data?.data || [];
            const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
            return totalStock > 0 ? p : null;
          } catch {
            return null;
          }
        })
      );

      // 3. Lọc bỏ các sản phẩm null (hết hàng) và giới hạn 8 cái
      const validProducts = stockChecks.filter(p => p !== null).slice(0, 8);
      
      setProducts(validProducts);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "40px 0" }}>
      <div className="container">
        <Title level={2}>Sản phẩm mới</Title>

        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              {/* Giữ nguyên cấu diện bọc Col ở đây */}
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
        
        {products.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#8c8c8c' }}>
            Hiện chưa có sản phẩm mới nào còn hàng.
          </div>
        )}
      </div>
    </div>
  );
}

export default NewProduct;