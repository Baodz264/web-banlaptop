module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("promotion_applies", [

      // ===== Laptop =====
      { promotion_id: 1, apply_type: "category", category_id: 1 },

      // ===== Laptop Gaming =====
      { promotion_id: 2, apply_type: "category", category_id: 3 },

      // ===== Phụ kiện =====
      { promotion_id: 3, apply_type: "category", category_id: 8 },

      // ===== Flash sale 1 sản phẩm =====
      { promotion_id: 6, apply_type: "product", product_id: 1 },

      // ===== Sale theo hãng =====
      { promotion_id: 7, apply_type: "brand", brand_id: 2 }, // Dell

      // ===== Sale chuột =====
      { promotion_id: 8, apply_type: "category", category_id: 9 }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("promotion_applies", null, {});
  }
};
