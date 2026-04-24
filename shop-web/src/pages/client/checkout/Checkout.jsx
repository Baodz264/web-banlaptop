import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Result,
  Card,
  Typography,
  App,
  Flex,
  Spin,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";

import CheckoutUserInfo from "../../../components/client/checkout/CheckoutUserInfo";
import CheckoutCart from "../../../components/client/checkout/CheckoutCart";
import CheckoutVoucher from "../../../components/client/checkout/CheckoutVoucher";
import CheckoutSummary from "../../../components/client/checkout/CheckoutSummary";
import CheckoutPayment from "../../../components/client/checkout/CheckoutPayment";

import OrderService from "../../../services/order.service";
import PaymentService from "../../../services/payment.service";
import ShipmentService from "../../../services/shipment.service";
import VoucherApplyService from "../../../services/voucherApply.service";

const { Title } = Typography;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { message } = App.useApp();

  const {
    removeItemsAfterCheckout,
    userVouchers = [],
    systemVouchers = [],
    getFinalPrice,
  } = useCart();

  const {
    items = [],
    bundles = [],
    bundleItems = [],
    selectedVoucher: initialVoucher = null,
    voucherDiscount: initialVoucherDiscount = 0,
  } = location.state || {};

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedOrderVoucher, setSelectedOrderVoucher] =
    useState(initialVoucher);
  const [selectedShippingVoucher, setSelectedShippingVoucher] = useState(null);
  const [loading, setLoading] = useState(false);

  const [dynamicShippingFee, setDynamicShippingFee] = useState(0);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);

  const [discounts, setDiscounts] = useState({
    orderDiscount: initialVoucherDiscount,
    shippingDiscount: 0,
  });

  const [voucherApplies, setVoucherApplies] = useState([]);

  const safeNum = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const handleVoucherChange = useCallback((data) => {
    setDiscounts((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  // ================= CALL API VOUCHER APPLY =================
  useEffect(() => {
    const fetchVoucherApply = async () => {
      if (!selectedOrderVoucher) {
        setVoucherApplies([]);
        return;
      }

      try {
        const vId =
          selectedOrderVoucher?.info?.id ||
          selectedOrderVoucher?.voucher_id ||
          selectedOrderVoucher?.id;

        if (!vId) return;

        const res = await VoucherApplyService.getVoucherApplies({
          voucher_id: vId,
        });

        setVoucherApplies(res.data?.data || []);
      } catch (err) {
        console.error("Lỗi lấy voucher apply:", err);
        setVoucherApplies([]);
      }
    };

    fetchVoucherApply();
  }, [selectedOrderVoucher]);

  // ================= CHECK APPLY =================
  const isVoucherApplicable = useCallback(() => {
    if (!voucherApplies.length) return true;

    return items.some((item) => {
      const productId = item.product_id || item.Product?.id;
      const categoryId = item.Product?.category_id;

      return voucherApplies.some((apply) => {
        if (apply.apply_type === "all") return true;

        if (apply.apply_type === "product") {
          return Number(apply.product_id) === Number(productId);
        }

        if (apply.apply_type === "category") {
          return Number(apply.category_id) === Number(categoryId);
        }

        return false;
      });
    });
  }, [voucherApplies, items]);

  // ================= AUTO VALIDATE VOUCHER (Đã fix lỗi deps) =================
  useEffect(() => {
    if (!selectedOrderVoucher || voucherApplies.length === 0) return;

    const valid = isVoucherApplicable();

    if (!valid) {
      message.warning("Voucher không áp dụng cho sản phẩm này");

      setSelectedOrderVoucher(null);
      setVoucherApplies([]);

      setDiscounts((prev) => ({
        ...prev,
        orderDiscount: 0,
      }));
    }
  }, [voucherApplies, isVoucherApplicable, message, selectedOrderVoucher]);

  // ================= TÍNH PHÍ SHIP =================
  useEffect(() => {
    const calculateFee = async () => {
      const toLat = safeNum(selectedAddress?.lat);
      const toLng = safeNum(selectedAddress?.lng);

      if (toLat && toLng) {
        setIsCalculatingFee(true);
        try {
          const payload = {
            from_lat: 10.762622,
            from_lng: 106.660172,
            to_lat: toLat,
            to_lng: toLng,
            shipping_type: "standard",
            items: items.map((item) => ({
              weight:
                item.weight ||
                item.Product?.weight ||
                item.Variant?.weight ||
                0.5,
              quantity: item.quantity || 1,
            })),
          };

          const res = await ShipmentService.calculateFee(payload);

          const findFee = (obj) => {
            if (!obj) return null;
            if (obj.shipping_fee != null) return obj.shipping_fee;
            if (obj.fee != null) return obj.fee;
            if (obj.shippingFee != null) return obj.shippingFee;
            if (obj.data) return findFee(obj.data);
            return null;
          };

          const fee = findFee(res);
          setDynamicShippingFee(safeNum(fee));
        } catch (err) {
          console.error("Ship fee error:", err);
          setDynamicShippingFee(30000);
        } finally {
          setIsCalculatingFee(false);
        }
      } else {
        setDynamicShippingFee(0);
      }
    };

    calculateFee();
  }, [selectedAddress?.lat, selectedAddress?.lng, items]);

  // ================= LOGIC GIÁ =================
  const getFinalItemPrice = useCallback(
    (item) => {
      try {
        return getFinalPrice(item);
      } catch {
        const product = item.Product || item.Variant?.Product || item;
        return safeNum(item.Variant?.price || product.price || item.price);
      }
    },
    [getFinalPrice]
  );

  const getFinalBundlePrice = useCallback(
    (bundle) => {
      const itemsOfBundle =
        bundle.comboItems ||
        bundleItems.filter((i) => String(i.bundle_id) === String(bundle.id));

      if (!itemsOfBundle.length) return 0;

      const rawTotal = itemsOfBundle.reduce((sum, item) => {
        const p = item.Product || item.Variant?.Product || item;
        const price = safeNum(item.Variant?.price || p.price || item.price);
        return sum + price * (item.quantity || 1);
      }, 0);

      let discounted = rawTotal;

      if (bundle.discount_type === "percent") {
        discounted = rawTotal * (1 - (bundle.discount_value || 0) / 100);
      } else if (bundle.discount_type === "fixed") {
        discounted = Math.max(0, rawTotal - (bundle.discount_value || 0));
      }

      return Math.round(discounted);
    },
    [bundleItems]
  );

  const subtotal = useMemo(() => {
    const itemsTotal = items.reduce(
      (sum, i) => sum + getFinalItemPrice(i) * (i.quantity || 1),
      0
    );

    const bundlesTotal = bundles.reduce(
      (sum, b) => sum + getFinalBundlePrice(b),
      0
    );

    return itemsTotal + bundlesTotal;
  }, [items, bundles, getFinalItemPrice, getFinalBundlePrice]);

  const { orderDiscount, shippingDiscount } = discounts;

  const finalTotal = Math.max(
    0,
    subtotal + dynamicShippingFee - orderDiscount - shippingDiscount
  );

  const isDataEmpty = items.length === 0 && bundles.length === 0;

  // ================= TẠO ĐƠN HÀNG =================
  const executeCreateOrder = async (isVnPay = false) => {
    const lat = safeNum(selectedAddress?.lat);
    const lng = safeNum(selectedAddress?.lng);

    if (!selectedAddress || !lat || !lng) {
      throw new Error("Địa chỉ không hợp lệ");
    }

    const appliedVouchers = [];

    if (selectedOrderVoucher) {
      const vId =
        selectedOrderVoucher.info?.id ||
        selectedOrderVoucher.voucher_id ||
        selectedOrderVoucher.id;

      if (vId) {
        appliedVouchers.push({
          voucher_id: Number(vId),
          discount_amount: Math.round(orderDiscount || 0),
        });
      }
    }

    if (selectedShippingVoucher) {
      const vShipId =
        selectedShippingVoucher.info?.id ||
        selectedShippingVoucher.voucher_id ||
        selectedShippingVoucher.id;

      if (vShipId) {
        appliedVouchers.push({
          voucher_id: Number(vShipId),
          discount_amount: Math.round(shippingDiscount || 0),
        });
      }
    }

    const fullOrderData = {
      user_id: Number(user?.id),
      shipping_address: { ...selectedAddress, lat, lng },
      from_lat: 10.762622,
      from_lng: 106.660172,
      total: Math.round(subtotal),
      shipping_fee: Math.round(dynamicShippingFee),
      discount_total: Math.round(orderDiscount + shippingDiscount),
      grand_total: Math.round(finalTotal),
      payment_method: isVnPay ? "vnpay" : "cod",
      shipping_type: "standard",

      items: items.map((item) => ({
        variant_id: Number(item.variant_id || item.Variant?.id || item.id),
        quantity: Number(item.quantity || 1),
        price: Math.round(getFinalItemPrice(item)),
        name: item.Product?.name || item.name,
      })),

      bundles: bundles.map((bundle) => {
        const qty = Number(bundle.quantity || 1);
        const totalPrice = Math.round(getFinalBundlePrice(bundle));

        return {
          bundle_id: Number(bundle.bundle_id || bundle.Bundle?.id || bundle.id),
          quantity: qty,
          price: Math.round(totalPrice / qty),
          name: bundle.name || bundle.Bundle?.name,
        };
      }),

      vouchers: appliedVouchers,
    };

    const orderRes = await OrderService.createOrder(fullOrderData);

    const orderId = orderRes.data?.id || orderRes.data?.data?.id || orderRes.id;

    if (!isVnPay && orderId) {
      try {
        await PaymentService.createPayment({
          order_id: orderId,
          method: "cod",
          status: "pending",
          amount: Math.round(finalTotal),
        });
      } catch (err) {
        console.error("COD payment create error:", err);
      }
    }

    return orderId;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress)
      return message.warning("Vui lòng chọn địa chỉ giao hàng");
    if (!selectedPayment)
      return message.warning("Vui lòng chọn phương thức thanh toán");
    if (isCalculatingFee)
      return message.warning("Đang tính toán phí vận chuyển...");

    setLoading(true);

    try {
      const itemIds = items.map((i) => i.id);
      const bundleIds = bundles.map((b) => b.id);

      if (selectedPayment.method === "vnpay") {
        const orderId = await executeCreateOrder(true);
        const res = await PaymentService.createVNPayPayment({
          order_id: orderId,
        });
        const url =
          res.data?.paymentUrl || res.data?.data?.paymentUrl || res.paymentUrl;

        if (!url) throw new Error("Không thể khởi tạo giao dịch VNPay");

        localStorage.setItem(
          "pending_checkout_items",
          JSON.stringify({
            itemIds,
            bundleIds,
          })
        );

        window.location.href = url;
      } else {
        await executeCreateOrder(false);
        message.success("Đặt hàng thành công!");
        await removeItemsAfterCheckout(itemIds, bundleIds);
        navigate("/profile");
      }
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      message.error(
        err?.response?.data?.message || err.message || "Có lỗi xảy ra"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated)
    return <Result status="403" title="Bạn cần đăng nhập để thanh toán" />;

  if (isDataEmpty)
    return (
      <Result
        status="404"
        title="Giỏ hàng của bạn đang trống"
        extra={
          <Button type="primary" onClick={() => navigate("/cart")}>
            Quay lại giỏ hàng
          </Button>
        }
      />
    );

  return (
    <div style={{ padding: "40px 20px", maxWidth: 1200, margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
        XÁC NHẬN THANH TOÁN
      </Title>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={15}>
          <Flex vertical gap="large" style={{ width: "100%" }}>
            <CheckoutUserInfo
              user={user}
              onAddressChange={setSelectedAddress}
            />

            <CheckoutCart
              items={items}
              bundles={bundles}
              bundleItems={bundleItems}
              getFinalPrice={getFinalItemPrice}
              getFinalBundlePrice={getFinalBundlePrice}
            />

            <CheckoutVoucher
              userVouchers={userVouchers}
              vouchers={systemVouchers}
              selectedOrderVoucher={selectedOrderVoucher}
              setSelectedOrderVoucher={setSelectedOrderVoucher}
              selectedShippingVoucher={selectedShippingVoucher}
              setSelectedShippingVoucher={setSelectedShippingVoucher}
              onVoucherChange={handleVoucherChange}
              subtotal={subtotal}
              shipping_fee={dynamicShippingFee}
              user={user}
            />
          </Flex>
        </Col>

        <Col xs={24} lg={9}>
          <Card variant="none" style={{ position: "sticky", top: 20 }}>
            <Spin spinning={isCalculatingFee}>
              <CheckoutSummary
                items={items}
                bundles={bundles}
                bundleItems={bundleItems}
                getFinalPrice={getFinalItemPrice}
                shipping_fee={dynamicShippingFee}
                orderDiscount={orderDiscount}
                shippingDiscount={shippingDiscount}
              />
            </Spin>

            <div style={{ margin: "24px 0" }}>
              <CheckoutPayment
                payments={[
                  {
                    id: 1,
                    method: "cod",
                    label: "Thanh toán khi nhận hàng (COD)",
                  },
                  { id: 2, method: "vnpay", label: "Cổng thanh toán VNPay" },
                ]}
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
              />
            </div>

            <Button
              type="primary"
              block
              size="large"
              loading={loading}
              onClick={handlePlaceOrder}
              style={{ height: 50, fontSize: 16, fontWeight: 600 }}
            >
              {selectedPayment?.method === "vnpay"
                ? "Thanh toán qua VNPay"
                : "Xác nhận đặt hàng"}
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;