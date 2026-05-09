import ExcelJS from "exceljs";
import {
  Order,
  OrderItem,
  Variant,
  Product,
} from "../../database/mysql/index.js";

import { fn, col, literal } from "sequelize";

/* =====================================================
   📦 EXPORT ORDERS EXCEL
===================================================== */
export const exportOrdersExcel = async () => {
  const orders = await Order.findAll({
    where: { status: "delivered" },
    include: [
      {
        model: OrderItem,
        include: [
          {
            model: Variant,
            include: [
              {
                model: Product,
                attributes: ["name"],
              },
            ],
          },
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Orders");

  sheet.columns = [
    { header: "Order ID", key: "order_id", width: 12 },
    { header: "Product", key: "product", width: 30 },
    { header: "Type", key: "type", width: 10 },
    { header: "Variant ID", key: "variant", width: 15 },
    { header: "Price", key: "price", width: 15 },
    { header: "Quantity", key: "qty", width: 10 },
    { header: "Total", key: "total", width: 15 },
    { header: "Date", key: "date", width: 25 },
  ];

  const rows = [];

  orders.forEach((order) => {
    const items = order.OrderItems || [];

    items.forEach((item) => {
      const isBundle = !!item.bundle_id;

      rows.push({
        order_id: order.id,

        product:
          item.Variant?.Product?.name ||
          item.product_name ||
          "N/A",

        type: isBundle ? "BUNDLE" : "VARIANT",

        variant: isBundle ? item.bundle_id : item.variant_id || "N/A",

        price: Number(item.price || 0),
        qty: Number(item.quantity || 0),
        total: Number(item.total_price || 0),

        date: new Date(order.created_at).toLocaleString("vi-VN"),
      });
    });
  });

  sheet.addRows(rows);

  return workbook;
};

/* =====================================================
   📊 EXPORT TOP SELLING EXCEL
===================================================== */
export const exportTopSellingExcel = async () => {
  const data = await OrderItem.findAll({
    attributes: [
      "variant_id",
      [fn("SUM", col("quantity")), "total_sold"],
      [fn("SUM", col("total_price")), "revenue"],
    ],
    include: [
      {
        model: Order,
        attributes: [],
        where: { status: "delivered" },
      },
      {
        model: Variant,
        attributes: ["id"],
        include: [
          {
            model: Product,
            attributes: ["name"],
          },
        ],
      },
    ],

    group: [
      "OrderItem.variant_id",
      "Variant.id",
      "Variant->Product.id",
    ],

    order: [[literal("total_sold"), "DESC"]],
    limit: 20,
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Top Selling");

  sheet.columns = [
    { header: "Product", key: "product", width: 30 },
    { header: "Variant ID", key: "variant", width: 15 },
    { header: "Sold", key: "sold", width: 10 },
    { header: "Revenue", key: "revenue", width: 20 },
  ];

  const rows = data.map((item) => ({
    product: item.Variant?.Product?.name || "N/A",
    variant: item.variant_id || "N/A",

    sold: Number(item.get("total_sold") || 0),
    revenue: Number(item.get("revenue") || 0),
  }));

  sheet.addRows(rows);

  return workbook;
};