import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Row, Col, Card, Tabs, Spin } from "antd";

import Sidebar from "../../../components/client/profile/Sidebar";
import AvatarUpload from "../../../components/client/profile/AvatarUpload";
import AddressForm from "../../../components/client/profile/AddressForm";
import AddressItem from "../../../components/client/profile/AddressItem";
import OrderItem from "../../../components/client/profile/OrderItem";
import OrderDetailModal from "../../../components/client/profile/OrderDetailModal";
import VoucherCard from "../../../components/client/profile/VoucherItem";
import ChangePasswordForm from "../../../components/client/profile/ChangePasswordForm";

import AddressService from "../../../services/address.service";
import OrderService from "../../../services/order.service";
import OrderItemService from "../../../services/orderItem.service";
import UserVoucherService from "../../../services/userVoucher.service";
import PaymentService from "../../../services/payment.service";

import { useAuth } from "../../../context/AuthContext";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  // Đã xóa biến toast ở đây để hết lỗi ESLint

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ================= ADDRESS =================
  const fetchAddresses = useCallback(async () => {
    try {
      const res = await AddressService.getAddresses();
      setAddresses(res?.data?.data || []);
    } catch (err) {
      console.error("Fetch Addresses Error:", err);
    }
  }, []);

  // ================= ORDERS =================
  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await OrderService.getOrders({ user_id: user.id });
      const orderList = res?.data?.data?.items || [];

      const ordersWithDetails = await Promise.all(
        orderList.map(async (order) => {
          try {
            let itemsData = order.OrderItems;

            if (!itemsData || itemsData.length === 0) {
              const itemRes = await OrderItemService.getOrderItems({
                order_id: order.id,
              });
              itemsData = itemRes?.data?.data || [];
            }

            const itemsProcessed = itemsData.map((item) => {
              const variant = item?.Variant || item?.variant || {};

              return {
                ...item,
                image:
                  item.product_thumbnail ||
                  item.image ||
                  variant?.image ||
                  variant?.Product?.thumbnail,

                product_name:
                  item.product_name ||
                  variant?.Product?.name ||
                  "Sản phẩm",

                AttributeValues:
                  item?.AttributeValues ||
                  variant?.AttributeValues ||
                  variant?.attribute_values ||
                  [],

                bundles: (item.bundles || []).map((b) => ({
                  ...b,
                  AttributeValues:
                    b?.AttributeValues ||
                    b?.variant?.AttributeValues ||
                    b?.variant?.attribute_values ||
                    [],
                })),

                display_variant: item.variant_name || null,
              };
            });

            let paymentData = order.Payment || null;

            if (!paymentData) {
              const payRes = await PaymentService.getPayments({
                order_id: order.id,
              }).catch(() => null);

              paymentData = payRes?.data?.data?.[0] || null;
            }

            const addressInfo =
              order?.UserAddress ||
              order?.userAddress ||
              order?.user_address ||
              order?.address ||
              null;

            return {
              ...order,
              OrderItems: itemsProcessed,
              Payment: paymentData,
              UserAddress: addressInfo,
            };
          } catch (err) {
            return order;
          }
        })
      );

      setOrders(ordersWithDetails);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    }
  }, [user?.id]);

  // ================= VOUCHER =================
  const fetchVouchers = useCallback(async () => {
    if (!user?.id) return;

    try {
      const res = await UserVoucherService.getUserVouchers({
        user_id: user.id,
      });

      const data = res?.data?.data?.items || [];

      const active = data
        .filter((v) => v.Voucher)
        .map((v) => ({
          ...v,
          name: v.Voucher.name,
          discount_value: Number(v.Voucher.discount_value || 0),
        }));

      setVouchers(active);
    } catch (err) {
      console.error("Fetch Vouchers Error:", err);
    }
  }, [user?.id]);

  // ================= LOAD ALL =================
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        refreshUser ? refreshUser() : Promise.resolve(),
        fetchAddresses(),
        fetchOrders(),
        fetchVouchers(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [refreshUser, fetchAddresses, fetchOrders, fetchVouchers]);

  useEffect(() => {
    if (user?.id) {
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ================= TABS =================
  const tabItems = useMemo(
    () => [
      {
        key: "1",
        label: "Hồ sơ",
        children: <AvatarUpload user={user} onReload={fetchAll} />,
      },
      {
        key: "2",
        label: "Địa chỉ",
        children: (
          <>
            <AddressForm onReload={fetchAddresses} />
            {addresses.length ? (
              addresses.map((a) => (
                <AddressItem
                  key={a.id}
                  data={a}
                  onReload={fetchAddresses}
                />
              ))
            ) : (
              <p style={{ textAlign: "center", marginTop: 20 }}>
                Chưa có địa chỉ
              </p>
            )}
          </>
        ),
      },
      {
        key: "3",
        label: "Đơn hàng",
        children: (
          <div>
            {orders.length ? (
              orders.map((o) => (
                <OrderItem
                  key={o.id}
                  data={o}
                  onView={() => setSelectedOrder(o)}
                />
              ))
            ) : (
              <p style={{ textAlign: "center", marginTop: 20 }}>
                Chưa có đơn hàng
              </p>
            )}
          </div>
        ),
      },
      {
        key: "4",
        label: "Voucher",
        children: vouchers.length ? (
          <Row gutter={[16, 16]}>
            {vouchers.map((v) => (
              <Col xs={24} sm={12} key={v.id}>
                <VoucherCard voucher={v} />
              </Col>
            ))}
          </Row>
        ) : (
          <p style={{ textAlign: "center", marginTop: 20 }}>
            Chưa có voucher
          </p>
        ),
      },
      {
        key: "5",
        label: "Đổi mật khẩu",
        children: <ChangePasswordForm />,
      },
    ],
    [user, addresses, orders, vouchers, fetchAll, fetchAddresses]
  );

  if (loading) return <Spin fullscreen description="Đang tải thông tin..." />;

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={6}>
          <Sidebar user={user} />
        </Col>

        <Col xs={24} md={18}>
          <Card variant="none" className="profile-tabs-card">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
            />
          </Card>
        </Col>
      </Row>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}