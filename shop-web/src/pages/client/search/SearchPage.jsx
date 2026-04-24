import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Row, Col, Empty, Spin, Typography } from "antd";
import productService from "../../../services/product.service";
import variantService from "../../../services/variant.service";
import ProductCard from "../../../components/ui/ProductCard";

const { Title } = Typography;

function SearchPage() {
  const [params] = useSearchParams();
  const keyword = params.get("q") || params.get("keyword") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!keyword.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const res = await productService.getProducts({
          search: keyword,
        });

        const rawData =
          res?.data?.data?.items ||
          res?.data?.data?.products ||
          res?.data?.data ||
          [];

        // Kiểm tra tồn kho cho từng sản phẩm tìm được bằng Promise.all
        const stockChecks = await Promise.all(
          rawData.map(async (p) => {
            try {
              const vRes = await variantService.getByProduct(p.id || p._id);
              const variants = vRes?.data?.data || [];
              const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
              
              // Chỉ trả về sản phẩm nếu tổng tồn kho > 0
              return totalStock > 0 ? p : null;
            } catch {
              // Nếu lỗi API khi lấy variant, coi như hết hàng để tránh lỗi giao diện
              return null;
            }
          })
        );

        // Lọc bỏ các phần tử null (hết hàng)
        const validProducts = stockChecks.filter((p) => p !== null);
        setProducts(validProducts);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  return (
    <div style={{ padding: "20px 40px" }}>
      <Title level={3} style={{ marginBottom: 20 }}>
        Kết quả tìm kiếm cho: "{keyword}"
      </Title>

      {loading ? (
        <div style={{ textAlign: "center", padding: 100 }}>
          {/* ✅ Đã sửa: dùng description thay cho tip để hết warning antd */}
          <Spin size="large" description="Đang kiểm tra hàng còn..." />
        </div>
      ) : products.length === 0 ? (
        <Empty 
          description="Không tìm thấy sản phẩm nào còn hàng" 
          style={{ marginTop: 50 }}
        />
      ) : (
        <Row gutter={[16, 24]}>
          {products.map((product) => (
            <Col
              key={product.id || product._id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4}
            >
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default SearchPage;