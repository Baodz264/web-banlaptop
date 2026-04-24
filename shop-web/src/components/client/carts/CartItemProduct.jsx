import React from "react";
import { Space, Image, Typography, Tag, Tooltip } from "antd";
import { GiftOutlined } from "@ant-design/icons";
import { useCart } from "../../../context/CartContext";

const { Text } = Typography;
const API_URL = "http://tbtshoplt.xyz";

const CartItemProduct = ({ item }) => {
  const { variants: fullVariantsList } = useCart();

  const getImgUrl = (path) => {
    if (!path) return "/no-image.png";
    return path.startsWith("http") ? path : `${API_URL}${path}`;
  };

  const renderAttributes = (targetItem) => {
    const v = targetItem?.Variant || targetItem;
    if (!v) return null;

    let attrs = v.AttributeValues || v.attribute_values || targetItem.AttributeValues || [];
    if ((!attrs || attrs.length === 0) && fullVariantsList) {
      const variantId = v.id || targetItem.variant_id;
      const found = fullVariantsList.find(fv => String(fv.id) === String(variantId));
      if (found) attrs = found.AttributeValues || found.attribute_values || [];
    }

    if (attrs && attrs.length > 0) {
      return (
        <div style={{ marginTop: 4 }}>
          <Space size={[4, 4]} wrap>
            {attrs.map((attr, idx) => {
              const label = attr.Attribute?.name || attr.attribute_name || "Tùy chọn";
              const value = attr.value || attr.attribute_value || attr.AttributeValue?.value;
              if (!value) return null;
              return (
                <Tag key={idx} style={{ margin: 0, fontSize: '10px', background: '#f0f5ff', color: '#1d39c4', border: '1px solid #adc6ff', borderRadius: '4px', padding: '0 6px' }}>
                  <span style={{ color: '#595959', fontWeight: 500 }}>{label}:</span> {value}
                </Tag>
              );
            })}
          </Space>
        </div>
      );
    }

    return v.sku ? <Text type="secondary" style={{ fontSize: '10px', display: 'block', marginTop: 2 }}>Mã: {v.sku}</Text> : null;
  };

  // ===================== COMBO =====================
  if (item.isComboGroup) {
    return (
      <div style={{ width: "100%", padding: '4px 0' }}>
        <Space align="center" style={{ marginBottom: 12 }}>
          <GiftOutlined style={{ fontSize: '18px', color: "#1677ff" }} />
          <Text strong style={{ color: "#1677ff", fontSize: "15px" }}>{item.name}</Text>
          <Tag color="blue" style={{ fontSize: '10px', borderRadius: '10px' }}>{item.comboItems?.length || 0} món</Tag>
        </Space>
        <div style={{ marginLeft: 10, paddingLeft: 16, borderLeft: "2px dashed #bae7ff", display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {item.comboItems && item.comboItems.length > 0 ? (
            item.comboItems.map((cItem, index) => {
              const pInfo = cItem.Product || {};
              const img = cItem.Variant?.image || pInfo.thumbnail || "/no-image.png";
              return (
                <Space key={index} align="start" size={12}>
                  <Image width={42} height={42} src={getImgUrl(img)} preview={false} style={{ borderRadius: 4, objectFit: "cover", border: "1px solid #f0f0f0" }} fallback="/no-image.png" />
                  <div>
                    <Text style={{ fontSize: "13px", display: 'block', fontWeight: 500 }}>{pInfo.name || "Sản phẩm"}</Text>
                    {renderAttributes(cItem)}
                  </div>
                </Space>
              );
            })
          ) : (
            <Text type="secondary" style={{ fontSize: '12px' }}>Combo chưa có sản phẩm</Text>
          )}
        </div>
      </div>
    );
  }

  // ===================== SẢN PHẨM BÌNH THƯỜNG =====================
  const productInfo = item.Product || item.Variant?.Product || {};
  return (
    <Space align="start" size={12}>
      <Image width={64} height={64} src={getImgUrl(item.Variant?.image || item.image || productInfo.thumbnail)} style={{ borderRadius: 8, border: "1px solid #f0f0f0", objectFit: "cover" }} preview={false} fallback="/no-image.png" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Tooltip title={productInfo.name}>
          <Text strong style={{ fontSize: "14px", maxWidth: 300, display: 'block' }} ellipsis>{productInfo.name || "Sản phẩm"}</Text>
        </Tooltip>
        {renderAttributes(item)}
        {(item.discount_value > 0 || item.hasPromo) && <Tag color="volcano" style={{ fontSize: '10px', width: 'fit-content', marginTop: 6 }}>ƯU ĐÃI</Tag>}
      </div>
    </Space>
  );
};

export default CartItemProduct;
