import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Card, Skeleton } from "antd";

import { useToast } from "../../../context/ToastProvider";

import OrderService from "../../../services/order.service";
import OrderItemService from "../../../services/orderItem.service";
import PaymentService from "../../../services/payment.service";
import ShipmentService from "../../../services/shipment.service";
import OrderStatusLogService from "../../../services/orderStatusLog.service";

import OrderItems from "../../../components/admin/orders/OrderItems";
import PaymentInfo from "../../../components/admin/orders/PaymentInfo";
import ShipmentInfo from "../../../components/admin/orders/ShipmentInfo";
import OrderTimeline from "../../../components/admin/orders/OrderTimeline";
import UpdateStatusModal from "../../../components/admin/orders/UpdateStatusModal";
import ShippingAddress from "../../../components/admin/orders/ShippingAddress";

const Detail = () => {
  const { id } = useParams();
  const toast = useToast();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [payment, setPayment] = useState(null);
  const [shipment, setShipment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Sử dụng useCallback để tránh lỗi exhaustive-deps và tối ưu hiệu năng
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        orderRes,
        itemsRes,
        payRes,
        shipRes,
        logRes
      ] = await Promise.all([
        OrderService.getOrderById(id),
        OrderItemService.getOrderItems({ order_id: id }),
        PaymentService.getPayments({ order_id: id }),
        ShipmentService.getShipments({ order_id: id }),
        OrderStatusLogService.getLogs({ order_id: id })
      ]);

      setOrder(orderRes?.data?.data || null);

      // ✅ Cập nhật state từ kết quả API
      setItems(itemsRes?.data?.data?.items || []);
      setPayment(payRes?.data?.data?.items?.[0] || null);
      setShipment(shipRes?.data?.data?.items?.[0] || null);
      setLogs(logRes?.data?.data?.items || []);

    } catch (error) {
      console.error("Error loading order details:", error);
      toast.error("Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [id, toast]); // Dependency bao gồm id và toast

  useEffect(() => {
    loadData();
  }, [loadData]); // useEffect giờ đây phụ thuộc vào hàm loadData đã được memoized

  if (loading) return <Skeleton active />;
  if (!order) return <p style={{ padding: 20 }}>Không tìm thấy đơn hàng</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Card
        title={`Order #${order.id}`}
        extra={<UpdateStatusModal order={order} reload={loadData} />}
        style={{ marginBottom: 20 }}
      />

      <OrderItems items={items} />
      
      <div style={{ marginTop: 20 }}>
        <PaymentInfo payment={payment} />
      </div>

      <div style={{ marginTop: 20 }}>
        <ShipmentInfo shipment={shipment} />
      </div>

      <div style={{ marginTop: 20 }}>
        <ShippingAddress
          shipping_address={order?.shipping_address}
          user_id={order?.user_id}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <OrderTimeline logs={logs} />
      </div>
    </div>
  );
};

export default Detail;