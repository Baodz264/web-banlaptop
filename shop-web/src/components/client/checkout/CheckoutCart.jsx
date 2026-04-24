// components/client/checkout/CheckoutCart.jsx
import React, { useMemo } from "react";
import { Card, Divider, Typography, Space, Tag } from "antd";
import { GiftOutlined } from "@ant-design/icons";
import CartItemProduct from "../carts/CartItemProduct";

const { Text } = Typography;

const CheckoutCart = ({
  items = [],
  bundles = [],
  bundleItems = {},
  getFinalPrice,
}) => {
  // ===================== DATA SOURCE =====================
  const dataSource = useMemo(() => {
    const normalItems = (items || []).map((i) => ({
      ...i,
      rowKey: `item-${i.id}`,
      isComboGroup: false,
      quantity: i.quantity || 1,
    }));

    const comboGroups = (bundles || []).map((b) => ({
      ...b,
      rowKey: `bundle-${b.cart_item_id || b.id}`,
      isComboGroup: true,
      comboItems: (bundleItems[b.id] || b.comboItems || []).map(
        (ci) => ({
          ...ci,
          Variant: {
            ...ci.Variant,
            price: Number(ci.price || ci.Variant?.price || 0),
          },
        })
      ),
      quantity: b.quantity || 1,
      name: b.name || "Combo ưu đãi",
    }));

    return [...normalItems, ...comboGroups];
  }, [items, bundles, bundleItems]);

  // ===================== NORMALIZE =====================
  const getNormalizedProduct = (item) => {
    if (item.isComboGroup) return null;

    const product = item.Product || item.Variant?.Product || item;
    return {
      ...product,
      Variant: item.Variant,
      price: Number(
        item.Variant?.price || product.price || item.price || 0
      ),
    };
  };

  // ===================== 🔥 TỰ TÍNH COMBO =====================
  const calculateBundlePrice = (record) => {
    const items = record.comboItems || [];

    // ✅ giá gốc 1 combo (KHÔNG nhân quantity)
    const totalOriginal = items.reduce(
      (sum, i) =>
        sum + Number(i.Variant?.price || i.price || 0),
      0
    );

    let finalPrice = totalOriginal;
    const discountVal = Number(record.discount_value || 0);

    if (record.discount_type === "percent") {
      finalPrice -= (totalOriginal * discountVal) / 100;
    } else if (record.discount_type === "fixed") {
      finalPrice -= discountVal;
    }

    finalPrice = Math.max(finalPrice, 0);

    return {
      totalOriginal, // giá 1 combo
      finalPrice,    // giá 1 combo sau giảm
    };
  };

  // ===================== RENDER =====================
  return (
    <Card
      title={`Chi tiết đơn hàng (${dataSource.length})`}
      variant="borderless"
      styles={{ body: { padding: "16px" } }}
    >
      {dataSource.map((record, idx) => {
        let rawTotal = 0;
        let finalTotal = 0;

        // ===== COMBO =====
        if (record.isComboGroup) {
          const { totalOriginal, finalPrice } =
            calculateBundlePrice(record);

          // ✅ CHỈ nhân ở đây (DUY NHẤT 1 lần)
          rawTotal = totalOriginal * (record.quantity || 1);
          finalTotal = finalPrice * (record.quantity || 1);
        }

        // ===== PRODUCT =====
        else {
          const normalized = getNormalizedProduct(record);
          rawTotal = (normalized?.price || 0) * (record.quantity || 1);
          finalTotal =
            (getFinalPrice?.(record) || 0) * (record.quantity || 1);
        }

        return (
          <div
            key={record.rowKey}
            style={{
              marginBottom:
                idx !== dataSource.length - 1 ? 12 : 0,
            }}
          >
            <Space
              orientation="vertical" // Đã sửa từ direction thành orientation
              style={{ width: "100%" }}
              size={8}
            >
              {/* Sản phẩm */}
              <CartItemProduct item={record} hideSku={false} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                {/* LEFT */}
                <div>
                  {record.isComboGroup && (
                    <Tag color="blue" icon={<GiftOutlined />}>
                      {record.name}
                    </Tag>
                  )}

                  <Text
                    type="secondary"
                    style={{
                      marginLeft: record.isComboGroup ? 8 : 0,
                    }}
                  >
                    Số lượng: x{record.quantity}
                  </Text>
                </div>

                {/* RIGHT */}
                <div style={{ textAlign: "right" }}>
                  <Space size={8}>
                    {/* Giá gốc */}
                    {Math.round(finalTotal) <
                      Math.round(rawTotal) && (
                      <Text
                        delete
                        type="secondary"
                        style={{ fontSize: 13 }}
                      >
                        {Math.round(rawTotal).toLocaleString()} đ
                      </Text>
                    )}

                    {/* Giá cuối */}
                    <Text
                      strong
                      style={{
                        fontSize: 15,
                        color: record.isComboGroup
                          ? "#1677ff"
                          : "#ff4d4f",
                      }}
                    >
                      {Math.round(finalTotal).toLocaleString()} đ
                    </Text>
                  </Space>
                </div>
              </div>
            </Space>

            {idx !== dataSource.length - 1 && (
              <Divider style={{ margin: "16px 0" }} />
            )}
          </div>
        );
      })}
    </Card>
  );
};

export default CheckoutCart;