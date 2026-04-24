import PaymentRepository from "./payment.repository.js";
import Order from "../../database/mysql/order/order.model.js";
import VNPayService from "./vnpay.service.js";
import ShipmentService from "../shipments/shipment.service.js";

class PaymentService {

  static async getPayments(query) {
    return await PaymentRepository.findAll(query);
  }

  static async getPaymentById(id) {
    const payment = await PaymentRepository.findById(id);
    if (!payment) throw new Error("Không tìm thấy thanh toán");
    return payment;
  }

  static validate(data) {
    if (!data.order_id) throw new Error("Thiếu order_id");
    if (!data.method) throw new Error("Thiếu phương thức thanh toán");
    if (!data.amount || Number(data.amount) <= 0) {
      throw new Error("Số tiền không hợp lệ");
    }

    const validStatus = ["pending", "paid", "failed", "refunded"];
    if (data.status && !validStatus.includes(data.status)) {
      throw new Error("Trạng thái thanh toán không hợp lệ");
    }
  }

  static async createPayment(data) {
    this.validate(data);

    const order = await Order.findByPk(data.order_id);
    if (!order) throw new Error("Order không tồn tại");

    const existing = await PaymentRepository.findByOrderId(data.order_id);
    if (existing.find(p => p.status === "paid")) {
      throw new Error("Đơn hàng đã được thanh toán");
    }

    data.status = data.status ?? "pending";

    if (data.status === "paid") {
      data.paid_at = new Date();
    }

    return await PaymentRepository.create(data);
  }

  static async updatePayment(id, data) {
    const payment = await PaymentRepository.findById(id);
    if (!payment) throw new Error("Không tìm thấy thanh toán");

    const merged = { ...payment.toJSON(), ...data };
    this.validate(merged);

    if (data.status === "paid") {
      data.paid_at = new Date();
    }

    return await PaymentRepository.update(id, data);
  }

  static async deletePayment(id) {
    const payment = await PaymentRepository.findById(id);
    if (!payment) throw new Error("Payment not found");

    return await PaymentRepository.delete(id);
  }

  static async createVNPayPayment(order_id, ipAddr) {
    const order = await Order.findByPk(order_id);
    if (!order) throw new Error("Order không tồn tại");

    return VNPayService.createPaymentUrl(order, ipAddr);
  }

  static async handleVNPayReturn(query) {

    const orderId = query.vnp_TxnRef;
    const responseCode = query.vnp_ResponseCode;

    console.log("===================================");
    console.log("🔥 VNPay RETURN");
    console.log("orderId:", orderId);
    console.log("responseCode:", responseCode);
    console.log("===================================");

    const order = await Order.findByPk(orderId);

    if (!order) {
      console.log("❌ Order not found");
      return { success: false, message: "Order không tồn tại" };
    }

    console.log("📦 ORDER BEFORE:");
    console.log("status:", order.status);
    console.log("shipping_address:", order.shipping_address);

    // ❌ FAIL CASE
    if (responseCode !== "00") {
      console.log("❌ PAYMENT FAILED → cancel order");

      await order.update({
        status: "cancelled"
      });

      return { success: false, orderId };
    }

    // ================= SUCCESS =================
    if (responseCode === "00") {

      const existing = await PaymentRepository.findByOrderId(orderId);

      console.log("💳 existing payments:", existing?.length || 0);

      if (existing.find(p => p.status === "paid")) {
        console.log("⚠️ already paid");
        return { success: true, orderId };
      }

      // 1. CREATE PAYMENT
      console.log("💰 creating payment...");
      await PaymentRepository.create({
        order_id: orderId,
        method: "vnpay",
        amount: Number(query.vnp_Amount) / 100,
        status: "paid",
        paid_at: new Date(),
      });

      // 2. UPDATE ORDER
      console.log("🔄 updating order → confirmed");

      await order.update({
        status: "confirmed"
      });

      await order.reload();

      console.log("📦 ORDER AFTER:");
      console.log("status:", order.status);

      // ================= PARSE ADDRESS =================
      let address = order.shipping_address;

      if (!address) {
        console.log("❌ no shipping address");
        return { success: true, orderId };
      }

      console.log("📍 raw address:", address);

      if (typeof address === "string") {
        try {
          address = JSON.parse(address);
          console.log("📍 parsed address:", address);
        } catch (e) {
          console.log("❌ parse error:", e.message);
          address = null;
        }
      }

      const lat = Number(address?.lat);
      const lng = Number(address?.lng);

      console.log("📌 lat:", lat);
      console.log("📌 lng:", lng);

      const isValidCoord =
        !Number.isNaN(lat) &&
        !Number.isNaN(lng) &&
        lat !== 0 &&
        lng !== 0;

      console.log("✅ isValidCoord:", isValidCoord);
      console.log("📦 order.status check:", order.status);

      // ================= CREATE SHIPMENT =================
      if (isValidCoord && order.status === "confirmed") {

        console.log("🚚 creating shipment...");

        try {
          const shipment = await ShipmentService.createShipment({
            order_id: order.id,
            from_lat: 10.762622,
            from_lng: 106.660172,
            to_lat: lat,
            to_lng: lng,
            items: []
          });

          console.log("🎉 shipment created:", shipment);

        } catch (err) {
          console.log("❌ shipment error:");
          console.log(err);
        }

      } else {
        console.log("❌ skip shipment");
        if (!isValidCoord) console.log("- invalid coord");
        if (order.status !== "confirmed") console.log("- status not confirmed");
      }

      console.log("===================================");
      console.log("🔥 DONE SUCCESS");
      console.log("===================================");

      return { success: true, orderId };
    }

    return { success: false, orderId };
  }
}

export default PaymentService;
