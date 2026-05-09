import {
  exportOrdersExcel,
  exportTopSellingExcel,
} from "./admin.export.service.js";

// ================= EXPORT ORDERS =================
export const exportOrders = async (req, res) => {
  try {
    const workbook = await exportOrdersExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=orders.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("[EXPORT ORDERS ERROR]", err);
    res.status(500).json({
      success: false,
      message: "Export orders failed",
    });
  }
};

// ================= EXPORT TOP SELLING =================
export const exportTopSelling = async (req, res) => {
  try {
    const workbook = await exportTopSellingExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=top-selling.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("[EXPORT TOP SELLING ERROR]", err);
    res.status(500).json({
      success: false,
      message: "Export top selling failed",
    });
  }
};