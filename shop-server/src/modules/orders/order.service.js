import OrderRepository from "./order.repository.js";
import {
  sequelize,
  OrderItem,
  OrderVoucher,
  OrderStatusLog,
  Variant,
  ProductBundleItem,
  Shipment,
} from "../../database/mysql/index.js";
import { Op } from "sequelize";

// 🔥 Goong shipping
import ShipmentFeeService from "../shipments/shipmentFee.service.js";

// 🔥 ADD THIS
import ShipmentService from "../shipments/shipment.service.js";

class OrderService {
  static async getOrders(query) {
    return await OrderRepository.findAll(query);
  }

  static async getOrderById(id) {
    const order = await OrderRepository.findById(id);
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    return order;
  }

  static validateOrder(orderInfo) {
    if (!orderInfo.user_id) {
      throw new Error("Thiếu user_id");
    }

    if (!orderInfo.shipping_address) {
      throw new Error("Thiếu địa chỉ giao hàng");
    }

    if (!orderInfo.total || Number(orderInfo.total) < 0) {
      throw new Error("Total không hợp lệ");
    }
  }

  /**
   * 🚀 CREATE ORDER
   */
  static async createOrder(data) {
    const { items = [], bundles = [], vouchers = [], ...orderInfo } = data;

    this.validateOrder(orderInfo);

    const t = await sequelize.transaction();

    try {
      // ✅ FIX: đảm bảo luôn có fallback hợp lệ
      const from_lat = Number(orderInfo.from_lat ?? 10.762622);
      const from_lng = Number(orderInfo.from_lng ?? 106.660172);

      const to_lat = Number(orderInfo.shipping_address?.lat);
      const to_lng = Number(orderInfo.shipping_address?.lng);

      let shipping_fee = 0;
      let distance_km = 0;

      if (!to_lat || !to_lng) {
        throw new Error("Địa chỉ chưa có tọa độ (lat/lng)");
      }

      // ✅ FIX: luôn đảm bảo items không rỗng + safe weight
      if (from_lat && from_lng && to_lat && to_lng) {
        const shippingItems = [];

        for (const item of items) {
          const variant = await Variant.findByPk(item.variant_id || item.id);

          shippingItems.push({
            weight: Number(item.weight || variant?.weight || 0.5),
            quantity: Number(item.quantity || 1),
          });
        }

        const shippingResult =
          await ShipmentFeeService.calculateShippingFee({
            from_lat,
            from_lng,
            to_lat,
            to_lng,
            items: shippingItems,
            shipping_type: orderInfo.shipping_type || "standard",
          });

        if (shippingResult?.shipping_fee != null) {
          shipping_fee = Number(shippingResult.shipping_fee);
          distance_km = Number(shippingResult.distance_km || 0);
        }
      }

      const total = Number(orderInfo.total ?? 0);

      let order_discount = 0;
      let shipping_discount = 0;

      vouchers.forEach((v) => {
        if (v.type === "shipping" || v.is_shipping) {
          shipping_discount += Number(v.discount_amount || 0);
        } else {
          order_discount += Number(v.discount_amount || 0);
        }
      });

      const actual_shipping_discount = Math.min(
        shipping_fee,
        shipping_discount,
      );

      const actual_order_discount = Math.min(total, order_discount);

      const total_discount_combined =
        actual_order_discount + actual_shipping_discount;

      const grand_total = Math.max(
        0,
        total -
          actual_order_discount +
          (shipping_fee - actual_shipping_discount),
      );

      const initialStatus =
        orderInfo.payment_method === "vnpay"
          ? "awaiting_payment"
          : "pending";

      const orderData = {
        ...orderInfo,
        from_lat,
        from_lng,
        shipping_fee: Math.round(shipping_fee),
        discount_total: Math.round(total_discount_combined),
        grand_total: Math.round(grand_total),
        status: initialStatus,
      };

      const order = await OrderRepository.create(orderData, {
        transaction: t,
      });

      for (const item of items) {
        const variantId = item.variant_id || item.id;

        const variant = await Variant.findByPk(variantId, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!variant) throw new Error(`Sản phẩm không tồn tại`);
        if (variant.stock < item.quantity) {
          throw new Error(
            `Sản phẩm ${item.name || variantId} không đủ tồn kho`,
          );
        }

        await variant.update(
          { stock: variant.stock - item.quantity },
          { transaction: t },
        );

        await OrderItem.create(
          {
            order_id: order.id,
            variant_id: variantId,
            product_name: item.name || item.Product?.name || "Sản phẩm lẻ",
            variant_name: variant.sku,
            product_thumbnail: variant.image,
            price: Math.round(item.price),
            quantity: item.quantity || 1,
            weight: Number(item.weight || variant.weight || 0.5),
            total_price: Math.round(item.price * item.quantity),
          },
          { transaction: t },
        );
      }

      for (const bundle of bundles) {
        const bundleId = bundle.bundle_id || bundle.id;

        const bundleItems = await ProductBundleItem.findAll({
          where: { bundle_id: bundleId },
          transaction: t,
        });

        for (const bItem of bundleItems) {
          const bVariant = await Variant.findByPk(bItem.variant_id, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          const totalReduce = bItem.quantity * (bundle.quantity || 1);

          if (!bVariant || bVariant.stock < totalReduce) {
            throw new Error(
              `Thành phần của Combo ${bundle.name} đã hết hàng`,
            );
          }

          await bVariant.update(
            { stock: bVariant.stock - totalReduce },
            { transaction: t },
          );
        }

        await OrderItem.create(
          {
            order_id: order.id,
            bundle_id: bundleId,
            product_name: bundle.name || "Sản phẩm Combo",
            price: Math.round(bundle.price),
            quantity: bundle.quantity || 1,
            weight: 0.5,
            total_price: Math.round(bundle.price * bundle.quantity),
          },
          { transaction: t },
        );
      }

      if (vouchers && vouchers.length > 0) {
        const orderVouchers = vouchers.map((v) => ({
          order_id: order.id,
          voucher_id: v.voucher_id || v.id,
          discount_amount: Math.round(v.discount_amount),
        }));

        await OrderVoucher.bulkCreate(orderVouchers, {
          transaction: t,
        });
      }

      await OrderStatusLog.create(
        {
          order_id: order.id,
          new_status: orderData.status,
          changed_by: orderInfo.user_id,
          note:
            initialStatus === "awaiting_payment"
              ? "Đang chờ thanh toán qua VNPay"
              : "Đơn hàng khởi tạo thành công (COD)",
        },
        { transaction: t },
      );

      await t.commit();
      return await OrderRepository.findById(order.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // ================= CANCEL =================
  static async cancelOrder(id, note = "Hệ thống tự động hủy") {
    const order = await OrderRepository.findById(id);
    if (!order || ["cancelled", "completed", "shipped"].includes(order.status))
      return order;

    const t = await sequelize.transaction();

    try {
      for (const item of order.OrderItems) {
        if (item.variant_id) {
          await Variant.increment("stock", {
            by: item.quantity,
            where: { id: item.variant_id },
            transaction: t,
          });
        }

        if (item.bundle_id) {
          const bItems = await ProductBundleItem.findAll({
            where: { bundle_id: item.bundle_id },
            transaction: t,
          });

          for (const bi of bItems) {
            await Variant.increment("stock", {
              by: bi.quantity * item.quantity,
              where: { id: bi.variant_id },
              transaction: t,
            });
          }
        }
      }

      const oldStatus = order.status;

      await order.update({ status: "cancelled" }, { transaction: t });

      await OrderStatusLog.create(
        {
          order_id: id,
          old_status: oldStatus,
          new_status: "cancelled",
          note,
        },
        { transaction: t },
      );

      await t.commit();
      return await OrderRepository.findById(id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async handleExpiredOrders() {
    try {
      const time = new Date(Date.now() - 15 * 60 * 1000);

      const result = await OrderRepository.findAll({
        status: "awaiting_payment",
        createdAt: {
          [Op.lt]: time,
        },
      });

      const orders = result?.rows || [];

      for (const order of orders) {
        await this.cancelOrder(order.id, "Quá hạn thanh toán");
      }
    } catch (err) {
      console.error("Expired order error:", err.message);
    }
  }

  // ================= FIX SHIPMENT =================
  static async updateOrder(id, data) {
    const order = await OrderRepository.findById(id);
    if (!order) throw new Error("Không tìm thấy đơn hàng");

    const oldStatus = order.status;

    await OrderRepository.update(id, data);

    const updatedOrder = await OrderRepository.findById(id, {
      include: ["OrderItems"],
    });

    const newStatus = updatedOrder.status;

    if (
      oldStatus !== "confirmed" &&
      newStatus === "confirmed" &&
      updatedOrder.OrderItems?.length > 0
    ) {
      const existed = await Shipment.findOne({
        where: { order_id: id },
      });

      if (!existed) {
        await ShipmentService.createShipment({
          order_id: id,

          from_lat: updatedOrder.from_lat || 10.762622,
          from_lng: updatedOrder.from_lng || 106.660172,

          to_lat: updatedOrder.shipping_address?.lat,
          to_lng: updatedOrder.shipping_address?.lng,

          items:
            updatedOrder.OrderItems?.map((i) => ({
              weight: i.weight || 0.5,
              quantity: i.quantity || 1,
            })) || [],
        });
      }
    }

    return updatedOrder;
  }

  static async deleteOrder(id) {
    const order = await OrderRepository.findById(id);
    if (!order) throw new Error("Không tìm thấy đơn hàng");
    return await OrderRepository.delete(id);
  }
}

export default OrderService;
