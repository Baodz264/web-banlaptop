import axiosClient from "./axios.config";

// ================= AI CHAT =================
export const adminChat = async (message) => {
  const res = await axiosClient.post("/ai-admin/chat", {
    message,
  });

  return res.data;
};

// ================= DASHBOARD DATA (nếu cần gọi riêng) =================
export const getDashboard = async () => {
  const res = await axiosClient.get("/ai-admin/dashboard");
  return res.data;
};

// ================= EXPORT ORDERS EXCEL =================
export const exportOrdersExcel = async () => {
  const res = await axiosClient.get("/ai-admin/export/orders", {
    responseType: "blob",
  });

  downloadFile(res.data, "orders.xlsx");
};

// ================= EXPORT TOP SELLING EXCEL =================
export const exportTopSellingExcel = async () => {
  const res = await axiosClient.get("/ai-admin/export/top-selling", {
    responseType: "blob",
  });

  downloadFile(res.data, "top-selling.xlsx");
};

// ================= DOWNLOAD HELPER =================
const downloadFile = (blob, fileName) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};
