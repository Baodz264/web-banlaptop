import React from "react";
import { Card, Typography, Button, Divider, Tag, Flex } from "antd";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const CartSummary = ({
  items = [],
  bundles = [],
  bundleItems = [],
  selectedVoucher,
  getFinalPrice = (item) => item.price || 0,
}) => {
  const navigate = useNavigate();

  // ================= NORMALIZE =================
  const getNormalizedProduct = (item) => {
    const product = item.Product || item.Variant?.Product || item;
    return {
      ...product,
      Variant: item.Variant || item,
      price: Number(
        item.Variant?.price || product.price || item.price || 0
      ),
    };
  };

  // ================= ITEMS =================
  const totalItems = items.reduce((sum, item) => {
    const normalized = getNormalizedProduct(item);
    return sum + getFinalPrice(normalized) * (item.quantity || 1);
  }, 0);

  // ================= ✅ FIX BUNDLE =================
  const calculateBundlePrice = (bundle) => {
    const itemsOfBundle =
      bundle.comboItems ||
      bundleItems.filter(
        (i) => String(i.bundle_id) === String(bundle.id)
      );

    if (!itemsOfBundle.length) {
      return { totalOriginal: 0, finalPrice: 0 };
    }

    // 🔥 FIX: KHÔNG nhân item.quantity nữa (tránh double)
    const totalOriginal = itemsOfBundle.reduce((sum, item) => {
      const price = Number(item.Variant?.price || item.price || 0);
      return sum + price;
    }, 0);

    let finalPrice = totalOriginal;
    const discountVal = Number(bundle.discount_value || 0);

    if (bundle.discount_type === "percent") {
      finalPrice -= (totalOriginal * discountVal) / 100;
    } else if (bundle.discount_type === "fixed") {
      finalPrice -= discountVal;
    }

    finalPrice = Math.max(finalPrice, 0);

    return {
      totalOriginal,
      finalPrice, // 👉 giá 1 combo
    };
  };

  // ================= BUNDLES =================
  let totalBundles = 0;

  const renderedBundles = bundles.map((bundle) => {
    const { totalOriginal, finalPrice } = calculateBundlePrice(bundle);

    // ✅ chỉ nhân ở đây
    const bundleTotal = finalPrice * (bundle.quantity || 1);

    totalBundles += bundleTotal;

    return (
      <Flex
        key={bundle.id}
        justify="space-between"
        align="flex-start"
        style={{ marginBottom: 12 }}
      >
        <Flex vertical gap={0}>
          <Flex gap={4} align="center">
            <Text type="secondary">Combo ({bundle.name}):</Text>
            <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
              Combo
            </Tag>
          </Flex>

          {bundleTotal < totalOriginal && (
            <Text delete type="secondary" style={{ fontSize: 12 }}>
              {Math.round(totalOriginal).toLocaleString()} đ
            </Text>
          )}
        </Flex>

        <Text strong style={{ color: "#1677ff" }}>
          {Math.round(bundleTotal).toLocaleString()} đ
        </Text>
      </Flex>
    );
  });

  // ================= TOTAL =================
  const subtotal = totalItems + totalBundles;

  // ================= VOUCHER =================
  let voucherDiscount = 0;
  const voucherInfo = selectedVoucher?.voucher;

  if (voucherInfo && subtotal > 0) {
    if (voucherInfo.discount_type === "percent") {
      voucherDiscount = (subtotal * voucherInfo.discount_value) / 100;

      if (
        voucherInfo.max_discount &&
        voucherDiscount > voucherInfo.max_discount
      ) {
        voucherDiscount = voucherInfo.max_discount;
      }
    } else {
      voucherDiscount = voucherInfo.discount_value || 0;
    }
  }

  const finalTotal = Math.max(0, subtotal - voucherDiscount);

  // ================= CHECKOUT =================
  const handleCheckout = () => {
    if (subtotal === 0) return;

    navigate("/checkout", {
      state: {
        items,
        bundles,
        bundleItems,
        selectedVoucher,
        subtotal,
        voucherDiscount,
        finalTotal,
      },
    });
  };

  // ================= UI =================
  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0 }}>
          Tóm tắt đơn hàng
        </Title>
      }
      variant="none"
      style={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "8px",
      }}
    >
      {totalItems > 0 && (
        <Flex justify="space-between" style={{ marginBottom: 12 }}>
          <Text type="secondary">Sản phẩm lẻ:</Text>
          <Text strong>{Math.round(totalItems).toLocaleString()} đ</Text>
        </Flex>
      )}

      {renderedBundles}

      {voucherInfo && subtotal > 0 && (
        <Flex justify="space-between" style={{ marginBottom: 12 }}>
          <Text type="secondary">Voucher ({voucherInfo.code}):</Text>
          <Text type="danger">
            - {Math.round(voucherDiscount).toLocaleString()} đ
          </Text>
        </Flex>
      )}

      <Divider style={{ margin: "12px 0" }} />

      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16 }}>Tổng cộng:</Text>
        <Title level={3} type="danger" style={{ margin: 0 }}>
          {Math.round(finalTotal).toLocaleString()} đ
        </Title>
      </Flex>

      <Button
        type="primary"
        size="large"
        block
        disabled={subtotal === 0}
        onClick={handleCheckout}
      >
        THANH TOÁN NGAY
      </Button>
    </Card>
  );
};

export default CartSummary;
