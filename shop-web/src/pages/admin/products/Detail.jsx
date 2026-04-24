import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import productService from "../../../services/product.service";
import productImageService from "../../../services/productImage.service";
import variantService from "../../../services/variant.service";

import ProductImages from "../../../components/admin/products/detail/ProductImages";
import ProductVariants from "../../../components/admin/products/detail/ProductVariants";
import ProductInfo from "../../../components/admin/products/detail/ProductInfo";
import ProductAccessories from "../../../components/admin/products/detail/ProductAccessories";
import ProductSpecifications from "../../../components/admin/products/detail/ProductSpecifications";

import { useToast } from "../../../context/ToastProvider";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);

  // Dùng useCallback để tránh việc hàm bị tạo lại mỗi khi component render
  // giúp fix lỗi dependency của useEffect và có thể truyền xuống component con mà không gây re-render thừa
  const fetchProduct = useCallback(async () => {
    try {
      const res = await productService.getProductById(id);
      setProduct(res.data.data);
    } catch {
      toast.error("Không tải được sản phẩm");
    }
  }, [id, toast]);

  const fetchImages = useCallback(async () => {
    try {
      const res = await productImageService.getByProduct(id);
      setImages(res.data.data);
    } catch {
      toast.error("Không tải được hình ảnh");
    }
  }, [id, toast]);

  const fetchVariants = useCallback(async () => {
    try {
      const res = await variantService.getByProduct(id);
      setVariants(res.data.data);
    } catch {
      toast.error("Không tải được variants");
    }
  }, [id, toast]);

  // Bây giờ dependency array đã đầy đủ và an toàn
  useEffect(() => {
    fetchProduct();
    fetchImages();
    fetchVariants();
  }, [fetchProduct, fetchImages, fetchVariants]);

  if (!product) return <Card loading />;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        Quay lại
      </Button>

      <Card title="Chi tiết sản phẩm">
        <ProductInfo product={product} />

        <ProductImages
          productId={id}
          images={images}
          reload={fetchImages}
        />

        <ProductVariants
          productId={id}
          variants={variants}
          reload={fetchVariants}
        />

        <ProductAccessories productId={id} />

        <ProductSpecifications productId={id} />
      </Card>
    </div>
  );
};

export default Detail;