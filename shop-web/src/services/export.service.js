// src/services/export.service.js
import axiosClient from "./axios.config";

/**
 * Service để gọi API export dữ liệu từ backend
 * @param {string} type - Loại dữ liệu: users, products, orders, ...
 * @param {string} format - Định dạng file: excel, pdf
 */
const exportService = {
  exportData: async (type, format = "excel") => {
    try {
      const response = await axiosClient.get(`/export`, {
        params: { type, format },
        responseType: "blob", // quan trọng để nhận file
      });

      // Tạo Blob cho file download
      const blob = new Blob([response.data], {
        type:
          format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf",
      });

      // Tạo URL cho Blob
      const url = window.URL.createObjectURL(blob);

      // Tạo thẻ <a> để download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}.${format === "excel" ? "xlsx" : "pdf"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    }
  },
};

export default exportService;
