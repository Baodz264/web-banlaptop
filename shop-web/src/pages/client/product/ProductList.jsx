import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, message, Spin, Empty, Rate, Card, Pagination } from "antd";

import productService from "../../../services/product.service";
import ReviewService from "../../../services/review.service";
import variantService from "../../../services/variant.service";

import { useParams } from "react-router-dom"; 

import FilterSidebar from "../../../components/client/product/FilterSidebar";
import ProductToolbar from "../../../components/client/product/ProductToolbar";
import ProductGrid from "../../../components/client/product/ProductGrid";

const ProductList = () => {
  const { slug } = useParams(); 

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    price: [0, 100000000],
    sort: undefined,
    rating: [],
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({ page: 1, limit: 1000 });
      const items = res?.data?.data?.items || [];

      const productsWithData = await Promise.all(
        items.map(async (p) => {
          try {
            const [ratingRes, variantRes] = await Promise.all([
              ReviewService.getRatingSummary(p.id),
              variantService.getByProduct(p.id),
            ]);

            const variants = variantRes?.data?.data || [];
            const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

            if (totalStock <= 0) return null;

            const minPrice = variants.length
              ? Math.min(...variants.map((v) => Number(v.price)))
              : 0;

            return {
              ...p,
              avg_rating: Number(ratingRes?.data?.average || 0),
              price: minPrice,
              total_stock: totalStock,

              // ✅ FIX: map slug từ Category
              category_slug: p.Category?.slug,
              category_id: p.category_id,
              brand_id: p.brand_id,
            };
          } catch (error) {
            console.error("Lỗi khi tải chi tiết sản phẩm:", p.id, error);
            return null;
          }
        })
      );

      const validProducts = productsWithData.filter((p) => p !== null);
      setAllProducts(validProducts);
      setFilteredProducts(validProducts);
    } catch (err) {
      message.error("Lỗi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= FILTER LOGIC =================
  useEffect(() => {
    let result = [...allProducts];

    
    if (slug) {
      result = result.filter((p) => p.category_slug === slug);
    }

    // Lọc Category từ sidebar (ID)
    if (filters.category.length > 0) {
      result = result.filter((p) =>
        filters.category.includes(Number(p.category_id))
      );
    }

    // Lọc Brand
    if (filters.brand.length > 0) {
      result = result.filter((p) =>
        filters.brand.includes(Number(p.brand_id))
      );
    }

    // Lọc Giá
    result = result.filter(
      (p) =>
        p.price >= filters.price[0] &&
        p.price <= filters.price[1]
    );

    // Lọc Rating
    if (filters.rating.length > 0) {
      const minRating = Math.max(...filters.rating);
      result = result.filter((p) => p.avg_rating >= minRating);
    }

    // Sort
    if (filters.sort) {
      result.sort((a, b) => {
        if (filters.sort === "price_asc") return a.price - b.price;
        if (filters.sort === "price_desc") return b.price - a.price;
        if (filters.sort === "rating_asc") return a.avg_rating - b.avg_rating;
        if (filters.sort === "rating_desc") return b.avg_rating - a.avg_rating;
        return 0;
      });
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [filters, allProducts, slug]); 

  // ================= PAGINATION =================
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ padding: "20px 40px" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={6}>
          <FilterSidebar filters={filters} setFilters={setFilters} />

          <Card size="small" title="Đánh giá tối thiểu" style={{ marginTop: 20 }}>
            <Rate
              allowClear
              value={filters.rating.length ? Math.max(...filters.rating) : 0}
              onChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  rating: val ? [val] : [],
                }))
              }
            />
          </Card>
        </Col>

        <Col xs={24} md={18}>
          <ProductToolbar setFilters={setFilters} />

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Spin size="large" description="Đang tải sản phẩm..." />
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <ProductGrid products={currentData} />

              <div style={{ marginTop: 40, textAlign: "center" }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredProducts.length}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={["12", "24", "48"]}
                  showTotal={(total) => `Tổng cộng ${total} sản phẩm`}
                />
              </div>
            </>
          ) : (
            <Empty
              style={{ marginTop: 60 }}
              description="Không tìm thấy sản phẩm nào phù hợp"
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductList;