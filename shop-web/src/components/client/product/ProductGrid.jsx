import React from "react";
import { Row, Col, Empty } from "antd";
import ProductCard from "../../ui/ProductCard";

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return <Empty description="Không có sản phẩm" />;
  }

  return (
    <Row gutter={[16, 24]}>
      {products.map((product) => (
        <Col 
          key={product.id || product._id} 
          xs={24}    // 1 cột trên mobile
          sm={12}    // 2 cột trên tablet
          md={8}     // 3 cột trên laptop nhỏ
          lg={6}     // 4 cột trên màn hình lớn
        >
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;