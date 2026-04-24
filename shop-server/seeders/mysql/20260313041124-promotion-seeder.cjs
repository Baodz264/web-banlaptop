module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("promotions", [

      {
        id: 1,
        name: "Giảm giá Laptop 10%",
        type: "percent",
        value: 10,
        usage_limit: 100,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        id: 2,
        name: "Sale Laptop Gaming 15%",
        type: "percent",
        value: 15,
        usage_limit: 50,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        id: 3,
        name: "Sale Phụ kiện 20%",
        type: "percent",
        value: 20,
        usage_limit: 200,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        id: 4,
        name: "Voucher 300K",
        type: "fixed",
        value: 300000,
        usage_limit: 100,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        id: 5,
        name: "Voucher 500K",
        type: "fixed",
        value: 500000,
        usage_limit: 50,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        id: 6,
        name: "Flash Sale Macbook Air M2",
        type: "percent",
        value: 12,
        usage_limit: 30,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        id: 7,
        name: "Giảm giá Dell 10%",
        type: "percent",
        value: 10,
        usage_limit: 100,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        id: 8,
        name: "Sale Chuột Gaming 18%",
        type: "percent",
        value: 18,
        usage_limit: 200,
        start_date: new Date(),
        end_date: null,
        status: 1
      }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("promotions", null, {});
  }
};
