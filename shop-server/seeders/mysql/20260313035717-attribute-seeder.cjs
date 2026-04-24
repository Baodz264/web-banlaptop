module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("product_attributes", [
      { id: 1, name: "RAM" },
      { id: 2, name: "Ổ cứng" },
      { id: 3, name: "Màu sắc" },
      { id: 4, name: "CPU" },
      { id: 5, name: "GPU" },
      { id: 6, name: "Kích thước màn hình" }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("product_attributes", null, {});
  }
};
