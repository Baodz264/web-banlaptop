import { useEffect, useState, useCallback } from "react";
import { Typography, Spin } from "antd";
import { useNavigate } from "react-router-dom";

import productService from "../../../services/product.service";
import postProductService from "../../../services/postProduct.service";

const { Title, Text } = Typography;

const PostProducts = ({ postId }) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH (Dùng useCallback để tránh lỗi dependency) =================
  const fetchProducts = useCallback(async () => {
    if (!postId) return;

    setLoading(true);

    try {
      const resPostProduct = await postProductService.getPostProducts({
        post_id: postId,
      });

      const postProducts =
        resPostProduct?.data?.data?.items ||
        resPostProduct?.data?.data ||
        resPostProduct?.data ||
        [];

      if (!Array.isArray(postProducts) || postProducts.length === 0) {
        setProducts([]);
        return;
      }

      const productIds = postProducts.map((item) => Number(item.product_id));

      const resProducts = await productService.getProducts({
        page: 1,
        limit: 50,
      });

      const items =
        resProducts?.data?.data?.items ||
        resProducts?.data?.items ||
        resProducts?.data ||
        [];

      let result = items.filter((p) => productIds.includes(Number(p.id)));

      // 👉 chỉ lấy 4 cho gọn sidebar
      setProducts(result.slice(0, 4));
    } catch (err) {
      console.error("❌ ERROR:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [postId]); // dependency là postId

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Bây giờ fetchProducts đã ổn định nhờ useCallback

  // ================= UI =================
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <Spin size="small" />
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="post-products">
      <Title level={5} className="title">
        Sản phẩm liên quan
      </Title>

      {products.map((item) => (
        <div
          key={item.id}
          className="product-item"
          onClick={() => navigate(`/product/${item.slug}`)}
        >
          {/* IMAGE */}
          <img
            src={
              item.thumbnail?.startsWith("http")
                ? item.thumbnail
                : `http://tbtshoplt.xyz${item.thumbnail}`
            }
            alt={item.name}
          />

          {/* CONTENT */}
          <div className="info">
            <div className="name">{item.name}</div>

            <Text className="price">
              {item.price
                ? Number(item.price).toLocaleString("vi-VN") + " đ"
                : "Liên hệ"}
            </Text>
          </div>
        </div>
      ))}

      {/* STYLE */}
      <style>
        {`
        .post-products {
          background: #fff;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #eee;
          margin-bottom: 20px;
        }

        .title {
          margin-bottom: 12px !important;
          font-size: 15px !important;
        }

        .product-item {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: 0.2s;
        }

        .product-item:last-child {
          margin-bottom: 0;
        }

        .product-item:hover {
          transform: translateX(3px);
        }

        .product-item img {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 8px;
          background: #f5f5f5;
        }

        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .name {
          font-size: 13px;
          line-height: 18px;
          height: 36px;
          overflow: hidden;
          font-weight: 500;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .price {
          font-size: 14px;
          font-weight: 600;
          color: #ee4d2d;
        }
        `}
      </style>
    </div>
  );
};

export default PostProducts;