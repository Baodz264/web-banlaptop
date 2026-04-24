import React, { useEffect, useState, useCallback } from "react";
import { Card, Tag, Typography, Button, Rate } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

import WishlistService from "../../services/wishlist.service";
import variantService from "../../services/variant.service";
import promotionService from "../../services/promotion.service";
import promotionItemService from "../../services/promotionItem.service";
import ReviewService from "../../services/review.service";

import { useToast } from "../../context/ToastProvider";

const { Text } = Typography;

const API_URL = "http://tbtshoplt.xyz";

function ProductCard({ product, initialIsFavorite = false }) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  const [price, setPrice] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 });

  const [hasStock, setHasStock] = useState(true);
  const [hovered, setHovered] = useState(false);

  const toast = useToast();

  // Helper function to check promotion match
  const isMatch = useCallback((product, item) => {
    if (item.apply_type === "all") return true;
    if (item.apply_type === "product") return product.id === item.product_id;
    if (item.apply_type === "brand") return product.brand_id === item.brand_id;
    if (item.apply_type === "category") return product.category_id === item.category_id;
    return false;
  }, []);

  // Helper function to apply promotion logic
  const applyPromotion = useCallback((price, promo) => {
    if (!promo) return price;
    if (promo.type === "percent") {
      return price - (price * promo.value) / 100;
    }
    if (promo.type === "fixed") {
      return price - promo.value;
    }
    return price;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [variantRes, promoRes, itemRes, ratingRes] = await Promise.all([
        variantService.getByProduct(product.id),
        promotionService.getPromotions({ status: 1, limit: 1000 }),
        promotionItemService.getItems(),
        ReviewService.getRatingSummary(product.id),
      ]);

      const variants = variantRes?.data?.data || [];
      const promotions = promoRes?.data?.data?.items || [];
      const items = itemRes?.data?.data || [];

      const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
      if (variants.length === 0 || totalStock <= 0) {
        setHasStock(false);
        return;
      }

      if (ratingRes?.data) {
        setRatingData({
          average: ratingRes.data.average || 0,
          count: ratingRes.data.count || 0,
        });
      }

      const minVariant = variants.reduce((min, v) =>
        !min || v.price < min.price ? v : min
      );

      const basePrice = minVariant.price;
      setPrice(basePrice);

      let bestPrice = basePrice;
      let bestPromo = null;

      for (const promo of promotions) {
        const now = new Date();
        if (promo.status !== 1) continue;
        if (promo.start_date && now < new Date(promo.start_date)) continue;
        if (promo.end_date && now > new Date(promo.end_date)) continue;

        const promoItems = items.filter((i) => i.promotion_id === promo.id);
        const found = promoItems.find((item) => isMatch(product, item));

        if (!found) continue;

        const discounted = applyPromotion(basePrice, promo);
        if (discounted < bestPrice) {
          bestPrice = discounted;
          bestPromo = promo;
        }
      }

      if (bestPromo) {
        setPriceData({
          original: Math.round(basePrice),
          final: Math.round(bestPrice),
          discount:
            bestPromo.type === "percent"
              ? Math.round(bestPromo.value)
              : Math.round((bestPromo.value / basePrice) * 100),
        });
      } else {
        setPriceData(null);
      }
    } catch (error) {
      console.error("ProductCard error:", error);
    }
  }, [product, isMatch, applyPromotion]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatPrice = (p) =>
    p ? Math.round(p).toLocaleString("vi-VN") + "₫" : "0₫";

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      if (isFavorite) {
        await WishlistService.removeWishlist(product.id);
        setIsFavorite(false);
        toast.info("Đã xóa khỏi yêu thích");
      } else {
        const res = await WishlistService.addWishlist({
          product_id: product.id,
        });

        if (res?.data?.exists) {
          toast.warning("Đã có trong yêu thích");
          setIsFavorite(true);
        } else {
          setIsFavorite(true);
          toast.success("Đã thêm vào yêu thích");
        }
      }
    } catch {
      toast.error("Lỗi wishlist!");
    } finally {
      setLoading(false);
    }
  };

  if (!hasStock) return null;

  const finalPrice = priceData?.final ?? price;
  const originalPrice = priceData?.original ?? price;
  const discount = priceData?.discount ?? null;

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.slug}`} style={{ textDecoration: "none" }}>
        <Card
          hoverable
          style={{
            borderRadius: 12,
            overflow: "hidden",
            height: 420,
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s ease",
            transform: hovered ? "translateY(-8px)" : "none",
            boxShadow: hovered
              ? "0 12px 24px rgba(0,0,0,0.15)"
              : "0 4px 12px rgba(0,0,0,0.05)",
          }}
          styles={{
            body: {
              padding: "12px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            },
          }}
          cover={
            <div
              style={{
                height: 220,
                overflow: "hidden",
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={`${API_URL}${product.thumbnail}`}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "10px",
                  transition: "0.5s",
                  transform: hovered ? "scale(1.1)" : "scale(1)",
                }}
              />
            </div>
          }
        >
          <div>
            <div style={{ marginBottom: 6 }}>
              {product.Brand?.name && (
                <Text
                  type="secondary"
                  style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  {product.Brand.name}
                </Text>
              )}
            </div>

            <div
              style={{
                fontWeight: 600,
                fontSize: 15,
                height: 44,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                marginBottom: 8,
                color: "#1f1f1f",
                lineHeight: "22px",
              }}
            >
              {product.name}
            </div>

            <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Rate
                disabled
                allowHalf
                value={ratingData.average}
                style={{ fontSize: 10 }}
              />
              <span style={{ fontSize: 12, color: "#bfbfbf" }}>
                ({ratingData.count || 0})
              </span>
            </div>
          </div>

          <div style={{ marginTop: "auto" }}>
            {discount ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Text strong style={{ color: "#ff4d4f", fontSize: 18 }}>
                    {formatPrice(finalPrice)}
                  </Text>
                  <Tag color="red" style={{ margin: 0, borderRadius: 4, fontWeight: 700 }}>
                    -{discount}%
                  </Tag>
                </div>
                <Text delete type="secondary" style={{ fontSize: 13 }}>
                  {formatPrice(originalPrice)}
                </Text>
              </div>
            ) : (
              <Text strong style={{ color: "#ff4d4f", fontSize: 18 }}>
                {formatPrice(price)}
              </Text>
            )}
          </div>
        </Card>
      </Link>

      <Button
        type="text"
        shape="circle"
        loading={loading}
        icon={
          isFavorite ? (
            <HeartFilled style={{ color: "#ff4d4f" }} />
          ) : (
            <HeartOutlined style={{ color: hovered ? "#ff4d4f" : "#8c8c8c" }} />
          )
        }
        onClick={handleWishlist}
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "white",
          opacity: hovered || isFavorite ? 1 : 0,
          transition: "0.3s",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 3,
        }}
      />

      {discount && (
        <div
          style={{
            position: "absolute",
            top: 15,
            right: 0,
            background: "linear-gradient(90deg, #ff7875 0%, #ff4d4f 100%)",
            color: "#fff",
            padding: "2px 12px",
            fontSize: 12,
            fontWeight: 700,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            zIndex: 2,
            boxShadow: "-2px 4px 8px rgba(255, 77, 79, 0.3)",
          }}
        >
          SALE
        </div>
      )}
    </div>
  );
}

export default ProductCard;