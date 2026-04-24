import React, { useMemo } from "react";
import {
  Card,
  Typography,
  Divider,
  Space,
  Tag,
  Badge,
} from "antd";
import {
  CarOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const CheckoutSummary = ({
  items = [],
  bundles = [],
  bundleItems = [],
  shipping_fee = 0,
  orderDiscount = 0,
  shippingDiscount = 0,
  getFinalPrice = (item) => item.price || 0,
}) => {
  // Hàm chuyển đổi số an toàn
  const safeNum = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const safeShippingFee = Math.round(safeNum(shipping_fee));
  const safeOrderDiscount = Math.round(safeNum(orderDiscount));
  const safeShippingDiscount = Math.round(safeNum(shippingDiscount));

  // ================= TÍNH TOÁN SẢN PHẨM LẺ =================
  const { totalItemsPrice, totalItemsWeight } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const product = item.Product || item.Variant?.Product || item;
        const weight = safeNum(
          item.Variant?.weight || product.weight || item.weight || 0.5
        );
        const qty = safeNum(item.quantity || 1);

        const finalPrice = getFinalPrice({
          ...product,
          Variant: item.Variant || item,
        });

        return {
          totalItemsPrice: acc.totalItemsPrice + Math.round(finalPrice) * qty,
          totalItemsWeight: acc.totalItemsWeight + weight * qty,
        };
      },
      { totalItemsPrice: 0, totalItemsWeight: 0 }
    );
  }, [items, getFinalPrice]);

  // ================= TÍNH TOÁN COMBO (BUNDLES) =================
  const { renderedBundles, totalBundlesPrice, totalBundlesWeight } = useMemo(() => {
    let totalPrice = 0;
    let totalWeight = 0;

    const rendered = bundles.map((bundle) => {
      const itemsInBundle =
        bundle.comboItems ||
        bundleItems.filter((i) => String(i.bundle_id) === String(bundle.id));

      if (!itemsInBundle.length) return null;

      const unitWeight = itemsInBundle.reduce((sum, item) => {
        const w = safeNum(item.Variant?.weight || item.Product?.weight || 0.5);
        return sum + w * safeNum(item.quantity || 1);
      }, 0);

      const unitOriginalPrice = itemsInBundle.reduce(
        (sum, item) => sum + safeNum(item.Variant?.price || item.price || 0),
        0
      );

      let unitDiscountedPrice = unitOriginalPrice;
      const discountVal = safeNum(bundle.discount_value || 0);

      if (bundle.discount_type === "percent") {
        unitDiscountedPrice -= (unitOriginalPrice * discountVal) / 100;
      } else if (bundle.discount_type === "fixed") {
        unitDiscountedPrice -= discountVal;
      }

      unitDiscountedPrice = Math.max(0, unitDiscountedPrice);
      const qty = safeNum(bundle.quantity || 1);
      const finalBundlePrice = Math.round(unitDiscountedPrice) * qty;

      totalPrice += finalBundlePrice;
      totalWeight += unitWeight * qty;

      return (
        <div key={bundle.id} style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Sử dụng Space cơ bản, mặc định là horizontal (ngang) */}
              <Space size={4}>
                <Badge
                  color="cyan"
                  text={
                    <Text style={{ fontSize: 13, fontWeight: 500 }}>
                      Combo: {bundle.name}
                    </Text>
                  }
                />
                <Tag color="blue" style={{ margin: 0 }}>x{qty}</Tag>
              </Space>

              {unitDiscountedPrice < unitOriginalPrice && (
                <Text
                  delete
                  type="secondary"
                  style={{ fontSize: 11, marginLeft: 16 }}
                >
                  {(Math.round(unitOriginalPrice) * qty).toLocaleString()} đ
                </Text>
              )}
            </div>

            <Text strong>{finalBundlePrice.toLocaleString()} đ</Text>
          </div>
        </div>
      );
    });

    return {
      renderedBundles: rendered,
      totalBundlesPrice: totalPrice,
      totalBundlesWeight: totalWeight,
    };
  }, [bundles, bundleItems]);

  // ================= TỔNG CỘNG =================
  const subtotal = totalItemsPrice + totalBundlesPrice;
  const totalWeightFinal = (totalItemsWeight + totalBundlesWeight).toFixed(2);
  const finalShippingFee = Math.max(0, safeShippingFee - safeShippingDiscount);
  const grandTotal = Math.max(0, subtotal + finalShippingFee - safeOrderDiscount);

  return (
    <Card
      title={
        <Space>
          <CarOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Tóm tắt đơn hàng
          </Title>
        </Space>
      }
      style={{
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        border: "none",
      }}
    >
      <div
        style={{
          maxHeight: "220px",
          overflowY: "auto",
          marginBottom: 16,
          paddingRight: 4
        }}
      >
        {totalItemsPrice > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text type="secondary">Sản phẩm lẻ</Text>
            <Text strong>{totalItemsPrice.toLocaleString()} đ</Text>
          </div>
        )}

        {renderedBundles}
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text type="secondary">Trọng lượng tổng</Text>
          <Text>{totalWeightFinal} kg</Text>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text type="secondary">Tạm tính</Text>
          <Text>{subtotal.toLocaleString()} đ</Text>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text type="secondary">Phí vận chuyển</Text>
          <Text>
            {finalShippingFee === 0
              ? "Miễn phí"
              : `${finalShippingFee.toLocaleString()} đ`}
          </Text>
        </div>

        {safeOrderDiscount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text type="secondary">Voucher giảm giá</Text>
            <Text type="danger">
              -{safeOrderDiscount.toLocaleString()} đ
            </Text>
          </div>
        )}
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
        <Text strong style={{ fontSize: 16 }}>Tổng thanh toán</Text>
        <Title level={3} type="danger" style={{ margin: 0 }}>
          {grandTotal.toLocaleString()} đ
        </Title>
      </div>
    </Card>
  );
};

export default CheckoutSummary;