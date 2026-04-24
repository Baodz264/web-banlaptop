import React, { useEffect, useState, useCallback } from "react";
import { Typography, Tag, Divider, Button, Row, Col } from "antd";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastProvider";

const { Title, Paragraph, Text } = Typography;

const ProductInfo = ({
  product,
  attributes = {},
  selectedAttributes = {},
  selectAttribute,
  selectedVariant,
  variants = [],
}) => {
  const { addItem } = useCart();
  const toast = useToast();

  const [discountPrice, setDiscountPrice] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(null);

  // ==================== HELPERS ====================
  
  const matchVariant = (variant, attrs) => {
    const selectedValueIds = Object.values(attrs).map(id => String(id));
    if (selectedValueIds.length === 0) return false;

    const variantValueIds = (variant.AttributeValues || []).map(v => String(v.id));
    return selectedValueIds.every(id => variantValueIds.includes(id));
  };

  const isOptionAvailable = (attrName, valueId) => {
    const checkAttrs = { ...selectedAttributes, [attrName]: valueId };
    return variants.some((variant) => matchVariant(variant, checkAttrs));
  };

  // Dùng useCallback để tránh re-render trigger useEffect không cần thiết
  const applyPromotion = useCallback((price, promo) => {
    if (!promo) return price;
    if (promo.type === "percent") return price * (1 - promo.value / 100);
    if (promo.type === "fixed") return price - promo.value;
    return price;
  }, []);

  // ==================== FETCH PROMOTION ====================
  useEffect(() => {
    if (!selectedVariant) {
      setDiscountPrice(null);
      setDiscountPercent(null);
      return;
    }

    const fetchPromotion = async () => {
      try {
        const promoService = await import("../../../services/promotion.service");
        const promoItemService = await import("../../../services/promotionItem.service");

        const promoRes = await promoService.default.getPromotions({ status: 1, limit: 1000 });
        const itemRes = await promoItemService.default.getItems();

        const promotions = promoRes?.data?.data?.items || [];
        const items = itemRes?.data?.data || [];

        let basePrice = selectedVariant.price;
        let bestPrice = basePrice;
        let bestPromo = null;
        const now = new Date();

        for (const promo of promotions) {
          if (promo.status !== 1) continue;
          if (promo.start_date && now < new Date(promo.start_date)) continue;
          if (promo.end_date && now > new Date(promo.end_date)) continue;

          const promoItems = items.filter((i) => i.promotion_id === promo.id);
          const matchItem = promoItems.find((pi) => {
            if (pi.apply_type === "all") return true;
            if (pi.apply_type === "product") return pi.product_id === product.id;
            if (pi.apply_type === "brand") return pi.brand_id === product.brand_id;
            if (pi.apply_type === "category") return pi.category_id === product.category_id;
            return false;
          });

          if (!matchItem) continue;

          const discounted = applyPromotion(basePrice, promo);
          if (discounted < bestPrice) {
            bestPrice = discounted;
            bestPromo = promo;
          }
        }

        if (bestPromo) {
          setDiscountPrice(Math.round(bestPrice));
          setDiscountPercent(
            bestPromo.type === "percent"
              ? Math.round(bestPromo.value)
              : Math.round(((basePrice - bestPrice) / basePrice) * 100)
          );
        } else {
          setDiscountPrice(null);
          setDiscountPercent(null);
        }
      } catch (err) {
        console.error("Lỗi fetch promotion:", err);
      }
    };

    fetchPromotion();
    // Thêm đầy đủ dependency để thỏa mãn react-hooks/exhaustive-deps
  }, [selectedVariant, product.id, product.brand_id, product.category_id, applyPromotion]);

  // ==================== ACTIONS ====================
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.warning("Vui lòng chọn đầy đủ phiên bản sản phẩm");
      return;
    }

    try {
      const finalPrice = discountPrice || selectedVariant.price;
      
      const cartData = {
        variant_id: selectedVariant.id,
        quantity: 1,
        price: finalPrice,
        name: product.name,
        thumbnail: product.thumbnail,
        sku: selectedVariant.sku,
        attributes: (selectedVariant.AttributeValues || []).map(v => v.value).join(" / ")
      };

      await addItem(cartData, 1);
      toast.success("Đã thêm vào giỏ hàng thành công!");
    } catch (err) {
      console.error("Chi tiết lỗi thêm giỏ hàng:", err);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  // ==================== RENDER ====================
  return (
    <>
      <Title level={2}>{product.name}</Title>

      <div style={{ marginBottom: 15 }}>
        {product.Category && <Tag color="blue">{product.Category.name}</Tag>}
        {product.Brand && <Tag color="purple">{product.Brand.name}</Tag>}
        <Tag color="green">Chính hãng</Tag>
      </div>

      <Paragraph type="secondary" ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
        {product.description}
      </Paragraph>

      <Divider />

      {/* ATTRIBUTES SELECTION */}
      {Object.keys(attributes).map((attrName) => (
        <div key={attrName} style={{ marginBottom: 20 }}>
          <Text strong>{attrName}: </Text>
          <Text type="secondary">
            {attributes[attrName].find(v => v.id === selectedAttributes[attrName])?.value || "Chưa chọn"}
          </Text>
          <div style={{ marginTop: 10 }}>
            {attributes[attrName].map((v) => {
              const active = selectedAttributes[attrName] === v.id;
              const available = isOptionAvailable(attrName, v.id);

              return (
                <Button
                  key={v.id}
                  type={active ? "primary" : "default"}
                  disabled={!available}
                  onClick={() => selectAttribute(attrName, v.id)}
                  style={{ 
                    marginRight: 8, 
                    marginBottom: 8,
                    borderRadius: 4,
                    minWidth: 70,
                    borderColor: active ? undefined : (available ? '#d9d9d9' : '#f0f0f0')
                  }}
                >
                  {v.value}
                </Button>
              );
            })}
          </div>
        </div>
      ))}

      <Divider />

      {/* PRICE DISPLAY */}
      <div style={{ padding: '10px 0', minHeight: 100 }}>
        {selectedVariant ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Title level={2} style={{ color: "#ff4d4f", margin: 0 }}>
                {(discountPrice || selectedVariant.price).toLocaleString("vi-VN")} đ
              </Title>
              {discountPercent > 0 && (
                <Tag color="red" style={{ fontSize: 14, padding: '2px 8px', fontWeight: 'bold' }}>
                  -{discountPercent}%
                </Tag>
              )}
            </div>

            {discountPrice && (
              <div style={{ marginTop: 5 }}>
                <Text delete type="secondary" style={{ fontSize: 16 }}>
                  {selectedVariant.price.toLocaleString("vi-VN")} đ
                </Text>
              </div>
            )}

            <div style={{ marginTop: 10 }}>
              <Text type="secondary">Tình trạng: </Text>
              <Text strong style={{ color: selectedVariant.stock > 0 ? "green" : "red" }}>
                {selectedVariant.stock > 0 ? `Còn hàng (${selectedVariant.stock})` : "Hết hàng"}
              </Text>
            </div>
          </div>
        ) : (
          <div style={{ padding: '15px', background: '#fff7e6', border: '1px solid #ffd591', borderRadius: 8 }}>
            <Text type="warning" strong>Vui lòng chọn đầy đủ phiên bản để xem giá</Text>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <Row gutter={12} style={{ marginTop: 25 }}>
        <Col span={12}>
          <Button 
            type="primary" 
            danger
            size="large"
            block
            icon={<ThunderboltOutlined />} 
            disabled={!selectedVariant || selectedVariant.stock <= 0}
            onClick={handleAddToCart}
          >
            MUA NGAY
          </Button>
        </Col>
        <Col span={12}>
          <Button 
            size="large"
            block
            icon={<ShoppingCartOutlined />} 
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock <= 0}
          >
            THÊM GIỎ HÀNG
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ProductInfo;