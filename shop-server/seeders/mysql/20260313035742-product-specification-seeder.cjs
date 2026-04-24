module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("product_specifications", [

      // ================= MACBOOK =================
      { product_id: 1, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Apple M2", sort_order: 1 },
      { product_id: 1, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "8GB", sort_order: 2 },
      { product_id: 1, spec_group: "Storage", spec_name: "Ổ cứng", spec_value: "256GB SSD", sort_order: 3 },
      { product_id: 1, spec_group: "Display", spec_name: "Màn hình", spec_value: "13.6 inch Retina", sort_order: 4 },
      { product_id: 1, spec_group: "Battery", spec_name: "Pin", spec_value: "18 giờ", sort_order: 5 },
      { product_id: 1, spec_group: "OS", spec_name: "Hệ điều hành", spec_value: "macOS", sort_order: 6 },

      { product_id: 2, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Apple M3", sort_order: 1 },
      { product_id: 2, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "16GB", sort_order: 2 },
      { product_id: 2, spec_group: "Storage", spec_name: "Ổ cứng", spec_value: "512GB SSD", sort_order: 3 },
      { product_id: 2, spec_group: "Display", spec_name: "Màn hình", spec_value: "14 inch Liquid Retina", sort_order: 4 },
      { product_id: 2, spec_group: "Battery", spec_name: "Pin", spec_value: "20 giờ", sort_order: 5 },
      { product_id: 2, spec_group: "OS", spec_name: "Hệ điều hành", spec_value: "macOS", sort_order: 6 },

      { product_id: 3, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Apple M2 Pro", sort_order: 1 },
      { product_id: 3, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "16GB", sort_order: 2 },
      { product_id: 3, spec_group: "Storage", spec_name: "Ổ cứng", spec_value: "1TB SSD", sort_order: 3 },
      { product_id: 3, spec_group: "Display", spec_name: "Màn hình", spec_value: "14 inch Liquid Retina XDR", sort_order: 4 },
      { product_id: 3, spec_group: "OS", spec_name: "Hệ điều hành", spec_value: "macOS", sort_order: 5 },

      { product_id: 4, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Apple M1", sort_order: 1 },
      { product_id: 4, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "8GB", sort_order: 2 },
      { product_id: 4, spec_group: "Storage", spec_name: "Ổ cứng", spec_value: "256GB SSD", sort_order: 3 },
      { product_id: 4, spec_group: "Display", spec_name: "Màn hình", spec_value: "13.3 inch Retina", sort_order: 4 },
      { product_id: 4, spec_group: "OS", spec_name: "Hệ điều hành", spec_value: "macOS", sort_order: 5 },

      // ================= GAMING LAPTOP =================
      { product_id: 5, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Intel i7-13650HX", sort_order: 1 },
      { product_id: 5, spec_group: "GPU", spec_name: "Card đồ họa", spec_value: "RTX 4060", sort_order: 2 },
      { product_id: 5, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "16GB", sort_order: 3 },
      { product_id: 5, spec_group: "Storage", spec_name: "Ổ cứng", spec_value: "1TB SSD", sort_order: 4 },
      { product_id: 5, spec_group: "Display", spec_name: "Màn hình", spec_value: "16 inch 165Hz", sort_order: 5 },
      { product_id: 5, spec_group: "OS", spec_name: "Hệ điều hành", spec_value: "Windows 11", sort_order: 6 },

      { product_id: 6, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Intel i7-12700H", sort_order: 1 },
      { product_id: 6, spec_group: "GPU", spec_name: "Card đồ họa", spec_value: "RTX 4050", sort_order: 2 },
      { product_id: 6, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "16GB", sort_order: 3 },
      { product_id: 6, spec_group: "Storage", spec_name: "Ổ cứng", spec_value: "512GB SSD", sort_order: 4 },
      { product_id: 6, spec_group: "Display", spec_name: "Màn hình", spec_value: "15.6 inch 144Hz", sort_order: 5 },
      { product_id: 6, spec_group: "OS", spec_name: "Hệ điều hành", spec_value: "Windows 11", sort_order: 6 },

      { product_id: 7, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Intel i5-12450H", sort_order: 1 },
      { product_id: 7, spec_group: "GPU", spec_name: "Card đồ họa", spec_value: "RTX 3050", sort_order: 2 },
      { product_id: 7, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "8GB", sort_order: 3 },
      { product_id: 7, spec_group: "Storage", spec_name: "Ổ cứng", spec_value: "512GB SSD", sort_order: 4 },

      { product_id: 8, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Intel i5-12500H", sort_order: 1 },
      { product_id: 8, spec_group: "GPU", spec_name: "Card đồ họa", spec_value: "RTX 3060", sort_order: 2 },
      { product_id: 8, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "16GB", sort_order: 3 },

      { product_id: 9, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Intel i5-13420H", sort_order: 1 },
      { product_id: 9, spec_group: "GPU", spec_name: "Card đồ họa", spec_value: "RTX 4050", sort_order: 2 },

      // ================= OFFICE LAPTOP =================
      { product_id: 10, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Intel i5-1235U", sort_order: 1 },
      { product_id: 10, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "8GB", sort_order: 2 },
      { product_id: 10, spec_group: "Storage", spec_name: "Ổ cứng", spec_value: "512GB SSD", sort_order: 3 },
      { product_id: 10, spec_group: "Display", spec_name: "Màn hình", spec_value: "15.6 inch FHD", sort_order: 4 },
      { product_id: 10, spec_group: "OS", spec_name: "Hệ điều hành", spec_value: "Windows 11", sort_order: 5 },

      { product_id: 11, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Intel i7-1355U", sort_order: 1 },
      { product_id: 11, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "16GB", sort_order: 2 },
      { product_id: 11, spec_group: "Storage", spec_name: "Ổ cứng", spec_value: "512GB SSD", sort_order: 3 },

      { product_id: 12, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Intel i5-1135G7", sort_order: 1 },

      { product_id: 13, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Intel i5-1240P", sort_order: 1 },

      // ================= PC =================
      { product_id: 14, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "AMD Ryzen 5 5600X", sort_order: 1 },
      { product_id: 14, spec_group: "GPU", spec_name: "Card đồ họa", spec_value: "RTX 3060", sort_order: 2 },
      { product_id: 14, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "16GB", sort_order: 3 },

      { product_id: 15, spec_group: "CPU", spec_name: "Vi xử lý", spec_value: "Intel i7-13700K", sort_order: 1 },
      { product_id: 15, spec_group: "GPU", spec_name: "Card đồ họa", spec_value: "RTX 4060", sort_order: 2 },
      { product_id: 15, spec_group: "RAM", spec_name: "Bộ nhớ", spec_value: "32GB", sort_order: 3 },

      // ================= ACCESSORIES (giữ đơn giản) =================
      { product_id: 16, spec_group: "Sensor", spec_name: "Cảm biến", spec_value: "HERO 25K", sort_order: 1 },
      { product_id: 16, spec_group: "DPI", spec_name: "Độ nhạy", spec_value: "8000 DPI", sort_order: 2 },

      { product_id: 17, spec_group: "Sensor", spec_name: "Cảm biến", spec_value: "Focus+", sort_order: 1 },

      { product_id: 18, spec_group: "Sensor", spec_name: "Cảm biến", spec_value: "Darkfield", sort_order: 1 },

      { product_id: 19, spec_group: "Switch", spec_name: "Switch", spec_value: "Cherry MX Red", sort_order: 1 },
      { product_id: 20, spec_group: "Switch", spec_name: "Switch", spec_value: "Razer Green", sort_order: 1 },

      { product_id: 21, spec_group: "Audio", spec_name: "Driver", spec_value: "50mm", sort_order: 1 },
      { product_id: 22, spec_group: "Connection", spec_name: "Kết nối", spec_value: "2.4GHz Wireless", sort_order: 1 },

      { product_id: 23, spec_group: "Display", spec_name: "Tần số quét", spec_value: "144Hz", sort_order: 1 },
      { product_id: 24, spec_group: "Display", spec_name: "Độ phân giải", spec_value: "4K UHD", sort_order: 1 },

      { product_id: 25, spec_group: "Storage", spec_name: "Dung lượng", spec_value: "1TB NVMe", sort_order: 1 },
      { product_id: 26, spec_group: "Storage", spec_name: "Dung lượng", spec_value: "1TB SSD", sort_order: 1 },

      { product_id: 27, spec_group: "RAM", spec_name: "Dung lượng", spec_value: "16GB DDR4", sort_order: 1 },
      { product_id: 28, spec_group: "RAM", spec_name: "Dung lượng", spec_value: "32GB DDR5", sort_order: 1 }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("product_specifications", null, {});
  }
};
