import {
  Order,
  User,
  Review,
  Wishlist,
  OrderItem,
  Variant,
  Product,
  ProductBundle, 
} from "../../database/mysql/index.js";

import { Op, fn, col, literal } from "sequelize";

// ================== THỜI GIAN ==================
const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);

  const start = new Date(now);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  return start;
};

const getLastWeekRange = () => {
  const start = getStartOfWeek();
  const end = new Date(start);

  start.setDate(start.getDate() - 7);

  end.setDate(end.getDate() - 1);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// ================== API ==================
export const getDashboardData = async () => {
  const startOfWeek = getStartOfWeek();
  const { start: lastWeekStart, end: lastWeekEnd } = getLastWeekRange();

  try {
    const [
      orders,
      users,
      lastWeekOrders,
      lastWeekUsers,
      topRated,
      topWishlist,
      topSelling,
      recentOrders,
      revenueByDay,
      ordersByDay,
      usersByDay,
      topBundles, // 👈 Thêm biến nhận dữ liệu Bundle
    ] = await Promise.all([
      // ===== TUẦN NÀY =====
      Order.findAll({
        where: {
          created_at: { [Op.gte]: startOfWeek },
          status: "delivered",
        },
      }),

      User.count({
        where: {
          created_at: { [Op.gte]: startOfWeek },
        },
      }),

      // ===== TUẦN TRƯỚC =====
      Order.findAll({
        where: {
          created_at: {
            [Op.between]: [lastWeekStart, lastWeekEnd],
          },
          status: "delivered",
        },
      }),

      User.count({
        where: {
          created_at: {
            [Op.between]: [lastWeekStart, lastWeekEnd],
          },
        },
      }),

      // ===== TOP RATED =====
      Review.findAll({
        attributes: [
          "product_id",
          [fn("AVG", col("Review.rating")), "avg_rating"],
          [fn("COUNT", col("Review.id")), "total_reviews"],
        ],
        include: [{ model: Product, attributes: ["id", "name", "thumbnail"] }],
        group: ["Review.product_id", "Product.id"],
        order: [[literal("avg_rating"), "DESC"]],
        limit: 5,
      }),

      // ===== TOP WISHLIST =====
      Wishlist.findAll({
        attributes: [
          "product_id",
          [fn("COUNT", col("Wishlist.product_id")), "total_wishlist"],
        ],
        include: [{ model: Product, attributes: ["id", "name", "thumbnail"] }],
        group: ["Wishlist.product_id", "Product.id"],
        order: [[literal("total_wishlist"), "DESC"]],
        limit: 5,
      }),

      // ===== TOP SELLING (Sản phẩm lẻ) =====
      OrderItem.findAll({
        attributes: [
          "variant_id",
          [fn("SUM", col("OrderItem.quantity")), "total_sold"],
        ],
        where: { bundle_id: null }, // Chỉ lấy sản phẩm không thuộc combo
        include: [
          {
            model: Variant,
            include: [{ model: Product, attributes: ["id", "name", "thumbnail"] }],
          },
        ],
        group: ["OrderItem.variant_id", "Variant.id", "Variant->Product.id"],
        order: [[literal("total_sold"), "DESC"]],
        limit: 5,
      }),

      // ===== RECENT ORDERS (Bao gồm cả Bundle info) =====
      Order.findAll({
        where: {
          created_at: { [Op.gte]: startOfWeek },
        },
        order: [["created_at", "DESC"]],
        limit: 10,
        include: [
          {
            model: OrderItem,
            include: [
              { model: ProductBundle, as: "bundle" }, // Alias từ file association của bạn
              {
                model: Variant,
                include: [{ model: Product, attributes: ["id", "name", "thumbnail"] }],
              },
            ],
          },
        ],
      }),

      // ===== CHART DATA =====
      Order.findAll({
        attributes: [
          [fn("DATE", col("created_at")), "date"],
          [fn("SUM", col("total")), "revenue"],
        ],
        where: { created_at: { [Op.gte]: startOfWeek }, status: "delivered" },
        group: [fn("DATE", col("created_at"))],
        order: [[fn("DATE", col("created_at")), "ASC"]],
      }),

      Order.findAll({
        attributes: [
          [fn("DATE", col("created_at")), "date"],
          [fn("COUNT", col("id")), "orders"],
        ],
        where: { created_at: { [Op.gte]: startOfWeek } },
        group: [fn("DATE", col("created_at"))],
        order: [[fn("DATE", col("created_at")), "ASC"]],
      }),

      User.findAll({
        attributes: [
          [fn("DATE", col("created_at")), "date"],
          [fn("COUNT", col("id")), "users"],
        ],
        where: { created_at: { [Op.gte]: startOfWeek } },
        group: [fn("DATE", col("created_at"))],
        order: [[fn("DATE", col("created_at")), "ASC"]],
      }),

      // ===== TOP SELLING BUNDLES (NEW) =====
      OrderItem.findAll({
        attributes: [
          "bundle_id",
          [fn("SUM", col("OrderItem.quantity")), "total_sold"],
        ],
        where: { bundle_id: { [Op.ne]: null } },
        include: [{ model: ProductBundle, as: "bundle" }],
        group: ["OrderItem.bundle_id", "bundle.id"],
        order: [[literal("total_sold"), "DESC"]],
        limit: 5,
      }),
    ]);

    // ===== TÍNH TOÁN =====
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const lastWeekRevenue = lastWeekOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    // ===== RESPONSE =====
    return {
      success: true,
      message: "Lấy dữ liệu dashboard thành công",

      meta: {
        start_date: startOfWeek,
        generated_at: new Date(),
        last_week: {
          revenue: Number(lastWeekRevenue),
          orders: lastWeekOrders.length,
          users: Number(lastWeekUsers),
        },
      },

      summary: {
        revenue: Number(revenue),
        total_orders: orders.length,
        new_users: Number(users),
      },

      chart: {
        revenue: revenueByDay.map((r) => ({
          date: r.get("date"),
          revenue: Number(r.get("revenue") || 0),
        })),
        orders: ordersByDay.map((o) => ({
          date: o.get("date"),
          orders: Number(o.get("orders") || 0),
        })),
        users: usersByDay.map((u) => ({
          date: u.get("date"),
          users: Number(u.get("users") || 0),
        })),
      },

      top_rated_products: topRated.map((item) => ({
        product: {
          id: item.product_id,
          name: item.Product?.name || "Không có tên",
          thumbnail: item.Product?.thumbnail || "",
        },
        average_rating: Number(parseFloat(item.get("avg_rating") || 0).toFixed(2)),
        total_reviews: Number(item.get("total_reviews") || 0),
      })),

      top_wishlist_products: topWishlist.map((item) => ({
        product: {
          id: item.product_id,
          name: item.Product?.name || "Không có tên",
          thumbnail: item.Product?.thumbnail || "",
        },
        total_wishlist: Number(item.get("total_wishlist") || 0),
      })),

      top_selling_products: topSelling.map((item) => ({
        variant_id: item.variant_id,
        product: {
          name: item.Variant?.Product?.name || "Không có tên",
          thumbnail: item.Variant?.Product?.thumbnail || "",
        },
        total_sold: Number(item.get("total_sold") || 0),
      })),

      // ===== TRẢ VỀ DỮ LIỆU BUNDLE =====
      top_selling_bundles: topBundles.map((item) => ({
        bundle_id: item.bundle_id,
        name: item.bundle?.name || "Gói không tên",
        total_sold: Number(item.get("total_sold") || 0),
      })),

      // ===== RECENT ORDERS (Đã sửa để hiển thị bundle info) =====
      recent_orders: recentOrders.map((order) => ({
        id: order.id,
        total: Number(order.total || 0),
        status: order.status,
        created_at: order.created_at,

        items: order.OrderItems?.map((item) => ({
          quantity: item.quantity,
          is_bundle: !!item.bundle_id,
          bundle_info: item.bundle ? {
            id: item.bundle.id,
            name: item.bundle.name
          } : null,
          product: {
            id: item.Variant?.Product?.id,
            name: item.Variant?.Product?.name,
            thumbnail: item.Variant?.Product?.thumbnail,
          },
        })) || [],
      })),
    };
  } catch (error) {
    console.error("[Dashboard Error]", error);
    return {
      success: false,
      message: "Không thể lấy dữ liệu dashboard",
      meta: { start_date: startOfWeek, generated_at: new Date() },
      summary: { revenue: 0, total_orders: 0, new_users: 0 },
      chart: { revenue: [], orders: [], users: [] },
      top_selling_bundles: [],
      recent_orders: [],
    };
  }
};