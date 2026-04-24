import ShipmentRepository from "./shipment.repository.js";
import ShipmentFeeService from "./shipmentFee.service.js";

import Order from "../../database/mysql/order/order.model.js";
import OrderStatusLog from "../../database/mysql/order/orderStatusLog.model.js";
import Payment from "../../database/mysql/payment/payment.model.js";

class ShipmentService {

  static async getShipments(query) {
    return await ShipmentRepository.findAll(query);
  }

  static async getShipmentById(id) {
    const shipment = await ShipmentRepository.findById(id);

    if (!shipment) {
      throw new Error("Không tìm thấy đơn giao hàng");
    }

    return shipment;
  }

  // ================= VALIDATE =================
  static validate(data) {
    if (!data.order_id) {
      throw new Error("Thiếu order_id");
    }

    if (data.shipping_fee !== undefined && Number(data.shipping_fee) < 0) {
      throw new Error("Phí ship không hợp lệ");
    }

    if (data.distance_km !== undefined && Number(data.distance_km) < 0) {
      throw new Error("Khoảng cách không hợp lệ");
    }

    if (data.shipping_type) {
      const validTypes = ["standard", "express"];
      if (!validTypes.includes(data.shipping_type)) {
        throw new Error("Loại ship không hợp lệ");
      }
    }

    if (data.shipping_status) {
      const validStatus = [
        "pending",
        "picked",
        "shipping",
        "delivered",
        "failed",
      ];
      if (!validStatus.includes(data.shipping_status)) {
        throw new Error("Trạng thái ship không hợp lệ");
      }
    }
  }

  // ================= MAP STATUS =================
  static mapShipmentToOrderStatus(shippingStatus) {
    const map = {
      pending: "pending",
      picked: "confirmed",
      shipping: "shipping",
      delivered: "delivered",
      failed: "cancelled",
    };

    return map[shippingStatus] || null;
  }

  // ================= CREATE SHIPMENT =================
  static async createShipment(data) {

    this.validate(data);

    const order = await Order.findByPk(data.order_id);

    if (!order) {
      throw new Error("Order không tồn tại");
    }

    if (order.status !== "confirmed") {
      throw new Error("Chỉ tạo shipment khi đơn hàng đã được xác nhận");
    }

    const existed = await ShipmentRepository.findByOrderId(data.order_id);
    if (existed) {
      return existed;
    }

    const from_lat = Number(data.from_lat || 0);
    const from_lng = Number(data.from_lng || 0);
    const to_lat = Number(data.to_lat || 0);
    const to_lng = Number(data.to_lng || 0);

    if (from_lat && from_lng && to_lat && to_lng) {
      try {
        const feeData = await ShipmentFeeService.calculateShippingFee({
          from_lat,
          from_lng,
          to_lat,
          to_lng,
          items: data.items || [],
          shipping_type: data.shipping_type || "standard",
        });

        data.shipping_fee =
          feeData?.shipping_fee ??
          feeData?.fee ??
          feeData?.data?.shipping_fee ??
          0;

        data.distance_km =
          feeData?.distance_km ??
          feeData?.data?.distance_km ??
          0;

      } catch (err) {
        console.error("SHIPMENT FEE ERROR:", err);
        data.shipping_fee = 0;
        data.distance_km = 0;
      }
    }

    data.shipping_fee = Number(data.shipping_fee ?? 0);
    data.shipping_type = data.shipping_type ?? "standard";
    data.shipping_status = data.shipping_status ?? "pending";

    return await ShipmentRepository.create(data);
  }

  // ================= UPDATE SHIPMENT =================
  static async updateShipment(id, data) {

    const shipment = await ShipmentRepository.findById(id);

    if (!shipment) {
      throw new Error("Không tìm thấy đơn giao hàng");
    }

    const merged = {
      ...shipment.toJSON(),
      ...data,
    };

    this.validate(merged);

    // recal fee
    if (
      data.from_lat ||
      data.from_lng ||
      data.to_lat ||
      data.to_lng
    ) {
      const feeData = await ShipmentFeeService.calculateShippingFee({
        from_lat: merged.from_lat,
        from_lng: merged.from_lng,
        to_lat: merged.to_lat,
        to_lng: merged.to_lng,
        items: merged.items || [],
        shipping_type: merged.shipping_type,
      });

      data.shipping_fee =
        feeData?.shipping_fee ??
        feeData?.fee ??
        0;

      data.distance_km =
        feeData?.distance_km ??
        0;
    }

    // timestamps
    if (data.shipping_status === "shipping") {
      data.shipped_at = new Date();
    }

    if (data.shipping_status === "delivered") {
      data.delivered_at = new Date();
    }

    // update shipment
    const updatedShipment = await ShipmentRepository.update(id, data);

    // ================= SYNC ORDER + PAYMENT =================
    if (data.shipping_status) {
      const orderId = shipment.order_id;

      const order = await Order.findByPk(orderId, {
        include: [{ model: Payment }]
      });

      // ===== UPDATE ORDER STATUS =====
      const newOrderStatus = this.mapShipmentToOrderStatus(data.shipping_status);

      if (newOrderStatus && order && order.status !== newOrderStatus) {
        const oldStatus = order.status;

        await order.update({
          status: newOrderStatus,
          updated_at: new Date(),
        });

        await OrderStatusLog.create({
          order_id: orderId,
          old_status: oldStatus,
          new_status: newOrderStatus,
          changed_by: data.shipper_id || null,
          note: `Auto sync from shipment #${shipment.id}`,
          created_at: new Date(),
        });
      }

      // ===== 🔥 FIX COD PAYMENT =====
      if (data.shipping_status === "delivered" && order?.Payments?.length) {

        for (const payment of order.Payments) {
          if (
            payment.method === "cod" &&
            payment.status !== "paid"
          ) {
            await payment.update({
              status: "paid",
              paid_at: new Date(),
            });

            console.log(`💰 COD payment #${payment.id} updated to PAID`);
          }
        }
      }
    }

    return updatedShipment;
  }

  // ================= DELETE =================
  static async deleteShipment(id) {
    const shipment = await ShipmentRepository.findById(id);

    if (!shipment) {
      throw new Error("Không tìm thấy đơn giao hàng");
    }

    return await ShipmentRepository.delete(id);
  }
}

export default ShipmentService;
