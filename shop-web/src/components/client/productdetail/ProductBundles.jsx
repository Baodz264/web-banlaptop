import React, { useState, useEffect } from "react";
import { Card, Button, Tag, Row, Col, Image, Typography, Space } from "antd";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastProvider";

const { Text } = Typography;
const API_URL = "http://tbtshoplt.xyz";

const ProductBundles = ({ bundles, bundleItems }) => {
  const { addBundle, variants: fullVariantsList } = useCart();
  const toast = useToast();
  const [bundleVariants, setBundleVariants] = useState({});

  useEffect(() => {
    if (!bundles || bundles.length === 0) return;

    const map = {};
    bundles.forEach((b) => {
      // 1. Lấy danh sách items (Ưu tiên bundleItems từ log của bạn)
      const rawItems = b.bundleItems || b.BundleItems || bundleItems?.[b.id] || [];
      
      const processedVariants = rawItems.map((item) => {
        // 2. Xác định Variant object (Theo log là item.variant)
        const v = item.variant || item.Variant || item;
        const pInfo = v?.Product || {};
        const variantId = v?.id || item.variant_id;

        // 3. LẤY ATTRIBUTES (Theo log: item.variant.AttributeValues)
        let attrs = v?.AttributeValues || v?.attribute_values || [];
        
        // Dự phòng nếu attrs rỗng và context có dữ liệu
        if ((!attrs || attrs.length === 0) && fullVariantsList) {
          const found = fullVariantsList.find(fv => String(fv.id) === String(variantId));
          if (found) {
            attrs = found.AttributeValues || found.attribute_values || [];
          }
        }

        return {
          id: variantId,
          name: pInfo.name || "Sản phẩm",
          price: Number(v?.price || 0),
          quantity: item.quantity || 1,
          image: v?.image || pInfo.thumbnail || "",
          attributes: attrs,
          sku: v?.sku || ""
        };
      });
      map[b.id] = processedVariants;
    });

    setBundleVariants(map);
  }, [bundles, bundleItems, fullVariantsList]);

  // Hàm render Attributes (Màu sắc, Ram, SSD...)
  const renderItemAttributes = (attrs) => {
    if (!attrs || !Array.isArray(attrs) || attrs.length === 0) return null;

    return (
      <div style={{ marginTop: 4 }}>
        <Space size={[4, 4]} wrap>
          {attrs.map((attr, idx) => {
            // Theo log: attr.Attribute.name và attr.value
            const label = attr.Attribute?.name || attr.attribute_name || "Tùy chọn";
            const value = attr.value || attr.attribute_value;

            if (!value) return null;

            return (
              <Tag 
                key={idx} 
                style={{ 
                  margin: 0, 
                  fontSize: '10px', 
                  background: '#f0f5ff', 
                  color: '#1d39c4', 
                  border: '1px solid #adc6ff', 
                  borderRadius: '4px', 
                  padding: '0 6px',
                  lineHeight: '18px'
                }}
              >
                <span style={{ color: '#595959', fontWeight: 600 }}>{label}:</span> {value}
              </Tag>
            );
          })}
        </Space>
      </div>
    );
  };

  const handleAddBundle = async (bundle) => {
    try {
      if (!bundle?.id) return;
      await addBundle(bundle.id, 1);
      toast.success(`Đã thêm combo "${bundle.name}" vào giỏ hàng! 🛒`);
    } catch (err) {
      console.error("Add bundle error:", err);
      toast.error("Không thể thêm combo vào giỏ hàng.");
    }
  };

  if (!bundles || bundles.length === 0) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <Row gutter={[16, 16]}>
        {bundles.map((bundle) => {
          const items = bundleVariants[bundle.id] || [];
          
          // Tính toán giá Combo
          const totalOriginal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          let finalPrice = totalOriginal;
          const discountVal = Number(bundle.discount_value || 0);

          if (bundle.discount_type === "percent") {
            finalPrice -= (totalOriginal * discountVal) / 100;
          } else {
            finalPrice -= discountVal;
          }
          
          const discountPercent = totalOriginal > 0 
            ? Math.round(((totalOriginal - finalPrice) / totalOriginal) * 100) 
            : 0;

          return (
            <Col span={24} key={bundle.id}>
              <Card 
                hoverable 
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '15px' }}>{bundle.name}</Text>
                    {discountPercent > 0 && <Tag color="red">Tiết kiệm {discountPercent}%</Tag>}
                  </div>
                }
              >
                {/* Giá tiền */}
                <div style={{ marginBottom: 15, textAlign: 'center' }}>
                  <Text style={{ color: "#ff4d4f", fontSize: "22px", fontWeight: "bold" }}>
                    {Math.max(0, Math.round(finalPrice)).toLocaleString()}₫
                  </Text>
                  {discountPercent > 0 && (
                    <div style={{ textDecoration: "line-through", color: '#8c8c8c', fontSize: '13px' }}>
                      Mua lẻ: {totalOriginal.toLocaleString()}₫
                    </div>
                  )}
                </div>

                {/* Danh sách items */}
                <div style={{ 
                  padding: '12px', background: '#f9f9f9', borderRadius: '8px', 
                  marginBottom: '15px', border: '1px solid #f0f0f0' 
                }}>
                  {items.map((i, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', alignItems: 'flex-start', marginBottom: idx === items.length - 1 ? 0 : 10,
                      background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #f0f0f0'
                    }}>
                      <Image
                        src={i.image?.startsWith('http') ? i.image : `${API_URL}${i.image}`}
                        width={42} height={42} preview={false}
                        style={{ borderRadius: 4, objectFit: 'cover' }}
                        fallback="https://via.placeholder.com/42?text=SP"
                      />
                      
                      <div style={{ flex: 1, marginLeft: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong style={{ fontSize: '13px' }}>{i.name}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>x{i.quantity}</Text>
                        </div>
                        
                        {/* RENDER THUỘC TÍNH Ở ĐÂY */}
                        {renderItemAttributes(i.attributes)}
                        
                        {(!i.attributes || i.attributes.length === 0) && i.sku && (
                          <Text type="secondary" style={{ fontSize: '10px', display: 'block', marginTop: 2 }}>
                            Mã: {i.sku}
                          </Text>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  type="primary" block size="large"
                  onClick={() => handleAddBundle(bundle)}
                  style={{ height: '48px', borderRadius: '8px', fontWeight: 'bold' }}
                >
                  MUA TRỌN BỘ COMBO
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ProductBundles;