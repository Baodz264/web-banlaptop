import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Card, Divider, Spin, Form, Rate, Progress } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastProvider";

import productService from "../../../services/product.service";
import productImageService from "../../../services/productImage.service";
import variantService from "../../../services/variant.service";
import productSpecificationService from "../../../services/productSpecification.service";
import productAccessoryService from "../../../services/productAccessory.service";
import ReviewService from "../../../services/review.service";
import ReviewImageService from "../../../services/reviewImage.service";
import BundleService from "../../../services/bundle.service";
import BundleItemService from "../../../services/bundleItem.service";

import ProductImages from "../../../components/client/productdetail/ProductImages";
import ProductInfo from "../../../components/client/productdetail/ProductInfo";
import ProductSpecs from "../../../components/client/productdetail/ProductSpecs";
import ProductAccessories from "../../../components/client/productdetail/ProductAccessories";
import ProductReviewForm from "../../../components/client/productdetail/ProductReviewForm";
import ProductReviewList from "../../../components/client/productdetail/ProductReviewList";
import ProductBundles from "../../../components/client/productdetail/ProductBundles";
import RelatedProducts from "../../../components/client/productdetail/RelatedProducts";

const API_URL = "http://tbtshoplt.xyz";

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [form] = Form.useForm();

  // --- States ---
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [attributes, setAttributes] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [specs, setSpecs] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [bundleItems, setBundleItems] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewImages, setReviewImages] = useState({});
  const [reviewLoading, setReviewLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [reviewStats, setReviewStats] = useState({
    avg: 0,
    total: 0,
    counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  // --- Logic Thống kê Review ---
  const calculateReviewStats = useCallback((list) => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    list.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
      sum += r.rating;
    });
    const total = list.length;
    const avg = total ? (sum / total).toFixed(1) : 0;
    setReviewStats({ avg, total, counts });
  }, []);

  // --- Fetching Data ---
  const fetchImages = useCallback(async (id) => {
    try {
      const res = await productImageService.getByProduct(id);
      setImages(res?.data?.data || []);
    } catch {
      setImages([]);
    }
  }, []);

  const fetchVariants = useCallback(async (id) => {
    try {
      const res = await variantService.getByProduct(id);
      const list = res?.data?.data || [];
      setVariants(list);

      const attrMap = {};
      list.forEach((variant) => {
        const values = variant.AttributeValues || [];
        values.forEach((v) => {
          const attrName = v.Attribute?.name || "Thuộc tính";
          if (!attrMap[attrName]) attrMap[attrName] = [];
          if (!attrMap[attrName].find((item) => item.id === v.id)) {
            attrMap[attrName].push({ id: v.id, value: v.value });
          }
        });
      });
      setAttributes(attrMap);
    } catch {
      setVariants([]);
      setAttributes({});
    }
  }, []);

  const fetchSpecs = useCallback(async (id) => {
    try {
      const res = await productSpecificationService.getByProduct(id);
      setSpecs(res?.data?.data || []);
    } catch {
      setSpecs([]);
    }
  }, []);

  const fetchAccessories = useCallback(async (id) => {
    try {
      const res = await productAccessoryService.getByProduct(id);
      setAccessories(res?.data?.data || []);
    } catch {
      setAccessories([]);
    }
  }, []);

  const fetchBundles = useCallback(async (productId) => {
    try {
      const res = await BundleService.getBundles({ product_id: productId });
      const list = res?.data?.data?.items || [];
      setBundles(list);
      const itemsMap = {};
      await Promise.all(
        list.map(async (b) => {
          try {
            const resItem = await BundleItemService.getItemsByBundle(b.id);
            itemsMap[b.id] = resItem?.data?.data || [];
          } catch {
            itemsMap[b.id] = [];
          }
        }),
      );
      setBundleItems(itemsMap);
    } catch {
      setBundles([]);
    }
  }, []);

  const fetchReviews = useCallback(
    async (productId) => {
      try {
        setReviewLoading(true);
        const res = await ReviewService.getReviews({ product_id: productId });
        const list = res?.data?.items || [];
        setReviews(list);
        calculateReviewStats(list);
        const imagesMap = {};
        await Promise.all(
          list.map(async (r) => {
            try {
              const imgRes = await ReviewImageService.getImagesByReview(r.id);
              imagesMap[r.id] = imgRes?.data?.data || [];
            } catch {
              imagesMap[r.id] = [];
            }
          }),
        );
        setReviewImages(imagesMap);
      } catch (err) {
        console.error(err);
      } finally {
        setReviewLoading(false);
      }
    },
    [calculateReviewStats],
  );

  const fetchProduct = useCallback(async () => {
    try {
      const res = await productService.getProducts({ page: 1, limit: 100 });
      const items = res?.data?.data?.items || [];
      const found = items.find((p) => p.slug === slug);

      if (!found) {
        toast.error("Không tìm thấy sản phẩm");
        return;
      }

      setProduct(found);
      setMainImage(`${API_URL}${found.thumbnail}`);

      const related = items.filter(
        (p) => p.category_id === found.category_id && p.id !== found.id,
      );
      setRelatedProducts(related.slice(0, 10));

      // Gọi song song các dữ liệu liên quan
      fetchImages(found.id);
      fetchVariants(found.id);
      fetchSpecs(found.id);
      fetchAccessories(found.id);
      fetchBundles(found.id);
      fetchReviews(found.id);
    } catch (err) {
      toast.error("Không tải được sản phẩm");
    }
  }, [
    slug,
    toast,
    fetchImages,
    fetchVariants,
    fetchSpecs,
    fetchAccessories,
    fetchBundles,
    fetchReviews,
  ]);

  // --- Life Cycle ---
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    fetchProduct();
    setSelectedAttributes({});
    setSelectedVariant(null);
  }, [fetchProduct]);

  useEffect(() => {
    if (selectedVariant?.image) {
      setMainImage(`${API_URL}${selectedVariant.image}`);
    } else if (product?.thumbnail) {
      setMainImage(`${API_URL}${product.thumbnail}`);
    }
  }, [selectedVariant, product]);

  // --- Handlers ---
  const matchVariant = (variant, attrs) => {
    const selectedValueIds = Object.values(attrs).map((id) => String(id));
    if (selectedValueIds.length === 0) return false;
    const variantValueIds = (variant.AttributeValues || []).map((v) =>
      String(v.id),
    );
    return selectedValueIds.every((id) => variantValueIds.includes(id));
  };

  const selectAttribute = (name, valueId) => {
    let updated = { ...selectedAttributes };
    if (updated[name] === valueId) delete updated[name];
    else updated[name] = valueId;

    setSelectedAttributes(updated);

    if (Object.keys(updated).length === 0) {
      setSelectedVariant(null);
      return;
    }

    const totalRequiredAttributes = Object.keys(attributes).length;
    if (Object.keys(updated).length === totalRequiredAttributes) {
      const found = variants.find((variant) => matchVariant(variant, updated));
      setSelectedVariant(found || null);
      if (found?.image) {
        setMainImage(`${API_URL}${found.image}`);
      }
    } else {
      setSelectedVariant(null);
    }
  };

  const submitReview = async (values, files) => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để đánh giá");
      return false;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const reviewRes = await ReviewService.createReview(
        {
          product_id: product.id,
          rating: values.rating,
          comment: values.comment.trim(),
        },
        config,
      );

      const reviewData = reviewRes?.data?.data || reviewRes?.data || reviewRes;
      const reviewId = reviewData?.id;

      if (reviewId && files?.length > 0) {
        const uploadPromises = files.map((file) => {
          const formData = new FormData();
          formData.append("review_id", reviewId);
          formData.append("image", file.originFileObj);
          return ReviewImageService.createImage(formData, config);
        });
        await Promise.all(uploadPromises);
      }

      toast.success("Cảm ơn bạn đã để lại đánh giá!");
      form.resetFields();
      fetchReviews(product.id);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Bạn chưa thể đánh giá sản phẩm này. Vui lòng kiểm tra lại đơn hàng của bạn!";

      toast.error(errorMessage);
      return false;
    }
  };

  if (!product)
    return (
      <Spin size="large" style={{ margin: "150px auto", display: "block" }} />
    );

  return (
    <div style={{ maxWidth: 1400, margin: "auto", padding: 20 }}>
      <Row gutter={[24, 24]}>
        {/* CỘT TRÁI: Hình ảnh, Thông tin, Specs */}
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12, marginBottom: 20 }}>
            <Row gutter={[30, 30]}>
              <Col xs={24} md={10}>
                <ProductImages
                  product={product}
                  images={images}
                  mainImage={mainImage}
                  setMainImage={setMainImage}
                  selectedVariant={selectedVariant} // 👈 THÊM DÒNG NÀY
                />
              </Col>
              <Col xs={24} md={14}>
                <ProductInfo
                  {...{
                    product,
                    attributes,
                    selectedAttributes,
                    selectAttribute,
                    selectedVariant,
                    variants,
                    user,
                  }}
                />
              </Col>
            </Row>
          </Card>

          <Card title="Thông số kỹ thuật" style={{ borderRadius: 12 }}>
            <ProductSpecs specs={specs} />
          </Card>
        </Col>

        {/* CỘT PHẢI: Phụ kiện & Bundle */}
        <Col xs={24} lg={8}>
          <Card
            title="Phụ kiện đi kèm"
            style={{ marginBottom: 20, borderRadius: 12 }}
          >
            <ProductAccessories accessories={accessories} />
          </Card>

          <Card
            title="Combo ưu đãi"
            style={{ marginBottom: 20, borderRadius: 12 }}
            styles={{ body: { maxHeight: "500px", overflowY: "auto" } }}
          >
            <ProductBundles bundles={bundles} bundleItems={bundleItems} />
          </Card>
        </Col>
      </Row>

      {/* SẢN PHẨM LIÊN QUAN */}
      <div style={{ marginTop: 24 }}>
        <RelatedProducts products={relatedProducts} />
      </div>

      {/* PHẦN ĐÁNH GIÁ */}
      <Card
        title="Đánh giá từ khách hàng"
        style={{ marginTop: 24, borderRadius: 12 }}
      >
        <Row gutter={20} style={{ marginBottom: 20 }}>
          <Col span={6} style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "48px", margin: 0, color: "#faad14" }}>
              {reviewStats.avg}
            </h1>
            <Rate disabled allowHalf value={Number(reviewStats.avg)} />
            <div style={{ marginTop: 8, color: "#8c8c8c" }}>
              {reviewStats.total} nhận xét
            </div>
          </Col>
          <Col span={18}>
            {[5, 4, 3, 2, 1].map((star) => {
              const percent = reviewStats.total
                ? (reviewStats.counts[star] / reviewStats.total) * 100
                : 0;
              return (
                <Row key={star} align="middle" style={{ marginBottom: 8 }}>
                  <Col span={4}>{star} sao</Col>
                  <Col span={16}>
                    <Progress
                      percent={percent}
                      showInfo={false}
                      strokeColor="#fadb14"
                    />
                  </Col>
                  <Col span={4} style={{ paddingLeft: 10 }}>
                    {reviewStats.counts[star]}
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>

        <ProductReviewForm
          user={user}
          form={form}
          submitReview={submitReview}
        />

        <Divider />

        <ProductReviewList
          reviews={reviews}
          reviewImages={reviewImages}
          loading={reviewLoading}
        />
      </Card>
    </div>
  );
};

export default ProductDetail;
