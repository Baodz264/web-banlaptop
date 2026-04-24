module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("product_attribute_values", [

      // ================= RAM =================
      { id: 1, attribute_id: 1, value: "8GB" },
      { id: 2, attribute_id: 1, value: "16GB" },
      { id: 3, attribute_id: 1, value: "32GB" },

      // ================= Ổ CỨNG =================
      { id: 4, attribute_id: 2, value: "256GB SSD" },
      { id: 5, attribute_id: 2, value: "512GB SSD" },
      { id: 6, attribute_id: 2, value: "1TB SSD" },

      // ================= MÀU SẮC =================
      { id: 7, attribute_id: 3, value: "Bạc" },
      { id: 8, attribute_id: 3, value: "Đen" },
      { id: 9, attribute_id: 3, value: "Xám" },

      // ================= CPU =================
      { id: 10, attribute_id: 4, value: "Intel i5" },
      { id: 11, attribute_id: 4, value: "Intel i7" },
      { id: 12, attribute_id: 4, value: "Intel i9" },
      { id: 13, attribute_id: 4, value: "AMD Ryzen 5" },
      { id: 14, attribute_id: 4, value: "AMD Ryzen 7" },
      { id: 15, attribute_id: 4, value: "Apple M2" },
      { id: 16, attribute_id: 4, value: "Apple M3" },

      // ================= GPU =================
      { id: 17, attribute_id: 5, value: "RTX 3050" },
      { id: 18, attribute_id: 5, value: "RTX 3060" },
      { id: 19, attribute_id: 5, value: "RTX 4060" },
      { id: 20, attribute_id: 5, value: "RTX 4070" },
      { id: 21, attribute_id: 5, value: "Intel Iris Xe" },

      // ================= MÀN HÌNH =================
      { id: 22, attribute_id: 6, value: "13 inch" },
      { id: 23, attribute_id: 6, value: "14 inch" },
      { id: 24, attribute_id: 6, value: "15.6 inch" },
      { id: 25, attribute_id: 6, value: "16 inch" }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("product_attribute_values", null, {});
  }
};
