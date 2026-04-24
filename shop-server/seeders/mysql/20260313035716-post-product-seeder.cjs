module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("post_products", [

      // ===== POST 1: Xu hướng công nghệ =====
      { post_id: 1, product_id: 1 },
      { post_id: 1, product_id: 3 },
      { post_id: 1, product_id: 13 },

      // ===== POST 2: Macbook =====
      { post_id: 2, product_id: 1 },
      { post_id: 2, product_id: 2 },
      { post_id: 2, product_id: 16 },

      // ===== POST 3: PC Gaming =====
      { post_id: 3, product_id: 3 },
      { post_id: 3, product_id: 4 },
      { post_id: 3, product_id: 5 },
      { post_id: 3, product_id: 14 },
      { post_id: 3, product_id: 15 },

      // ===== POST 4: Windows =====
      { post_id: 4, product_id: 6 },
      { post_id: 4, product_id: 7 },
      { post_id: 4, product_id: 19 }

    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("post_products", null, {});
  }
};
