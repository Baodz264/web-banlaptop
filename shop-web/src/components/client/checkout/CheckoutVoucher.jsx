import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Card, Select, Typography, Tag } from "antd";
import OrderVoucherService from "../../../services/orderVoucher.service";

const { Option } = Select;
const { Text } = Typography;

const CheckoutVoucher = ({
  vouchers = [],
  userVouchers = [],
  selectedOrderVoucher,
  setSelectedOrderVoucher,
  selectedShippingVoucher,
  setSelectedShippingVoucher,
  subtotal = 0,
  shipping_fee = 0,
  onVoucherChange,
  user,
  refreshKey
}) => {
  const [usedVoucherIds, setUsedVoucherIds] = useState([]);
  const [fetching, setFetching] = useState(false);

  // ================= FETCH USED VOUCHERS =================
  useEffect(() => {
    const fetchUsedVouchers = async () => {
      try {
        setFetching(true);
        const res = await OrderVoucherService.getOrderVouchers({
          user_id: user?.id,
        });
        const ids = res.data?.data?.map((v) => Number(v.voucher_id)) || [];
        setUsedVoucherIds(ids);
      } catch (error) {
        console.error("Lỗi lấy voucher đã dùng:", error);
      } finally {
        setFetching(false);
      }
    };

    if (user?.id) {
      fetchUsedVouchers();
    }
  }, [user?.id, refreshKey]);

  // ================= MAP INFO =================
  const getVoucherInfo = useCallback(
    (uv) =>
      vouchers.find(
        (v) => String(v.id) === String(uv.voucher_id || uv.voucherId)
      ),
    [vouchers]
  );

  // ================= REMOVE DUPLICATE =================
  const displayVouchers = useMemo(() => {
    const map = new Map();

    userVouchers.forEach((uv) => {
      const info = getVoucherInfo(uv);
      if (!info?.id) return;

      const key = String(info.id);

      // loại voucher đã dùng + duplicate
      if (!map.has(key) && !usedVoucherIds.includes(Number(info.id))) {
        map.set(key, {
          ...uv,
          info,
        });
      }
    });

    return Array.from(map.values());
  }, [userVouchers, usedVoucherIds, getVoucherInfo]);

  // ================= FILTER =================
  const orderVouchers = useMemo(
    () => displayVouchers.filter((v) => v.info.type === "order"),
    [displayVouchers]
  );

  const shippingVouchers = useMemo(
    () => displayVouchers.filter((v) => v.info.type === "shipping"),
    [displayVouchers]
  );

  // ================= CALCULATE =================
  useEffect(() => {
    let orderDiscount = 0;
    let shippingDiscount = 0;

    if (selectedOrderVoucher?.info) {
      const v = selectedOrderVoucher.info;
      if (subtotal >= (v.min_order_value || 0)) {
        orderDiscount =
          v.discount_type === "percent"
            ? (subtotal * v.discount_value) / 100
            : v.discount_value || 0;

        if (v.max_discount && orderDiscount > v.max_discount) {
          orderDiscount = v.max_discount;
        }
      }
    }

    if (selectedShippingVoucher?.info) {
      const v = selectedShippingVoucher.info;

      if (subtotal >= (v.min_order_value || 0)) {
        if (v.discount_type === "percent") {
          shippingDiscount =
            (shipping_fee * (v.discount_value || 0)) / 100;
        } else if (v.discount_type === "fixed" && v.discount_value > 0) {
          shippingDiscount = v.discount_value;
        } else {
          shippingDiscount = shipping_fee;
        }

        shippingDiscount = Math.min(shipping_fee, shippingDiscount);
      }
    }

    onVoucherChange?.({
      orderDiscount: Math.round(orderDiscount),
      shippingDiscount: Math.round(shippingDiscount),
    });
  }, [
    selectedOrderVoucher,
    selectedShippingVoucher,
    subtotal,
    shipping_fee,
    onVoucherChange,
  ]);

  // ================= RENDER =================
  const renderVoucherSelect = (
    title,
    vouchersList,
    selectedVoucher,
    setSelected
  ) => (
    <Card
      title={`${title} (${vouchersList.length})`}
      size="small"
      style={{
        marginTop: 16,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
      loading={fetching}
    >
      <Select
        placeholder={`Chọn ${title.toLowerCase()}`}
        style={{ width: "100%" }}
        value={selectedVoucher?.id || undefined} // ✅ dùng id
        allowClear
        onChange={(id) => {
          if (!id) return setSelected(null);

          const found = vouchersList.find(
            (v) => String(v.id) === String(id)
          );

          if (found) setSelected(found);
        }}
      >
        {vouchersList.map((item) => {
          const info = item.info || {};
          const isDisabled = subtotal < (info.min_order_value || 0);

          return (
            <Option
              key={item.id} // ✅ unique tuyệt đối
              value={item.id} // ✅ đồng bộ với key
              disabled={isDisabled}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  <Tag
                    color={info.type === "shipping" ? "green" : "red"}
                    style={{ borderRadius: 4 }}
                  >
                    {info.code}
                  </Tag>
                  <Text strong>
                    {info.type === "shipping" && !info.discount_value
                      ? "Freeship"
                      : `${Number(info.discount_value).toLocaleString()}${
                          info.discount_type === "percent" ? "%" : "đ"
                        }`}
                  </Text>
                </span>

                {info.min_order_value > 0 && (
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    (Đơn ≥{" "}
                    {Number(info.min_order_value).toLocaleString()}đ)
                  </Text>
                )}
              </div>
            </Option>
          );
        })}
      </Select>
    </Card>
  );

  return (
    <>
      {renderVoucherSelect(
        "Voucher đơn hàng",
        orderVouchers,
        selectedOrderVoucher,
        setSelectedOrderVoucher
      )}

      {renderVoucherSelect(
        "Voucher vận chuyển",
        shippingVouchers,
        selectedShippingVoucher,
        setSelectedShippingVoucher
      )}
    </>
  );
};

export default CheckoutVoucher;
