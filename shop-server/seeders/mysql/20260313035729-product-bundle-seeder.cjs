module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("product_bundles", [

      {
        id: 1,
        name: "Combo Macbook + Chuột",
        discount_type: "percent",
        discount_value: 10,
        start_date: new Date(),
        end_date: null,
        status: 1
      },
      {
        id: 2,
        name: "Combo Laptop Gaming",
        discount_type: "percent",
        discount_value: 12,
        start_date: new Date(),
        end_date: null,
        status: 1
      },
      {
        id: 3,
        name: "Combo Gaming Full Set",
        discount_type: "fixed",
        discount_value: 500000,
        start_date: new Date(),
        end_date: null,
        status: 1
      },
      {
        id: 4,
        name: "Combo Văn phòng",
        discount_type: "percent",
        discount_value: 8,
        start_date: new Date(),
        end_date: null,
        status: 1
      }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("product_bundles", null, {});
  }
};
