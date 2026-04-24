import { useState, useEffect } from "react";
import { Modal, Button, Select, Flex, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { useToast } from "../../../context/ToastProvider";
import OrderService from "../../../services/order.service";
import OrderStatusLogService from "../../../services/orderStatusLog.service";
import NotificationService from "../../../services/notification.service";
import ShipmentService from "../../../services/shipment.service";
import socket from "../../../socket/socket";

const { Option } = Select;
const { Text } = Typography;

const UpdateStatusModal = ({ order, reload }) => {
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order?.status || "pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(order?.status || "pending");
  }, [order?.id, order?.status]);

  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return "Đơn hàng của bạn đang chờ xác nhận.";
      case "confirmed":
        return "Đơn hàng của bạn đã được xác nhận.";
      case "shipping":
        return "Đơn hàng của bạn đang được giao.";
      case "delivered":
        return "Đơn hàng của bạn đã được giao thành công.";
      case "cancelled":
        return "Đơn hàng của bạn đã bị hủy.";
      case "returned":
        return "Đơn hàng của bạn đang được trả lại.";
      default:
        return `Trạng thái đơn hàng đã thay đổi: ${status}`;
    }
  };

  // 🔥 TÍNH PHÍ SHIP
  const calculateShippingFee = async (orderData) => {
    try {
      const res = await ShipmentService.calculateFee({
        from_lat: 10.762622,
        from_lng: 106.660172,
        to_lat: orderData.shipping_address?.lat,
        to_lng: orderData.shipping_address?.lng,
        shipping_type: "standard",
        items: (orderData.items || []).map((i) => ({
          weight: i.weight || 0.5,
          quantity: i.quantity || 1,
        })),
      });

      const fee =
        res?.data?.shipping_fee ||
        res?.data?.fee ||
        res?.shipping_fee ||
        30000;

      return Number(fee);
    } catch (err) {
      console.error("CALC SHIPPING ERROR:", err);
      return 30000;
    }
  };

  const updateStatus = async () => {
    try {
      setLoading(true);

      const oldStatus = order.status;

      let updatePayload = {
        status,
      };

      // 🔥 CHỈ khi confirm mới tính lại phí ship
      if (status === "confirmed") {
        const fee = await calculateShippingFee(order);
        updatePayload.shipping_fee = fee;
      }

      // 🔥 update order
      await OrderService.updateOrder(order.id, updatePayload);

      // 🔥 log change
      if (oldStatus !== status) {
        await OrderStatusLogService.createLog({
          order_id: order.id,
          old_status: oldStatus,
          new_status: status,
          changed_by: null,
          note: null,
        });
      }

      // 🔥 notification
      const notificationData = {
        user_id: order.user_id,
        title: `Đơn hàng #${order.id}`,
        content: getStatusMessage(status),
        type: "order",
        ref_id: order.id,
      };

      await NotificationService.createNotification(notificationData);

      socket.emit("send_notification", notificationData);

      toast.success("Cập nhật trạng thái đơn hàng thành công");

      setOpen(false);

      if (typeof reload === "function") {
        reload(order.id);
      }
    } catch (err) {
      console.log("UPDATE STATUS ERROR:", err);

      toast.error(
        err?.response?.data?.message ||
          "Cập nhật trạng thái đơn hàng thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => setOpen(true)}
      >
        Cập nhật trạng thái
      </Button>

      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={updateStatus}
        confirmLoading={loading}
        okText="Cập nhật"
        cancelText="Hủy"
        width={400}
      >
        <Flex vertical gap="middle" style={{ width: "100%" }}>
          <Text strong>Chọn trạng thái đơn hàng</Text>

          <Select
            value={status}
            style={{ width: "100%" }}
            onChange={setStatus}
            placeholder="Chọn trạng thái"
          >
            <Option value="pending">Chờ xác nhận</Option>
            <Option value="confirmed">Đã xác nhận</Option>
            <Option value="shipping">Đang giao hàng</Option>
            <Option value="delivered">Đã giao hàng</Option>
            <Option value="cancelled">Đã hủy</Option>
            <Option value="returned">Trả hàng</Option>
          </Select>
        </Flex>
      </Modal>
    </>
  );
};

export default UpdateStatusModal;
