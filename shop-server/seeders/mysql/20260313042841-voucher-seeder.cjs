module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("vouchers", [

      {
        code: "WELCOME10",
        name: "Giảm 10% cho khách mới",
        type: "order",
        discount_type: "percent",
        discount_value: 10,
        max_discount: 500000,
        min_order_value: 1000000,
        quantity: 100,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "SALE500K",
        name: "Giảm 500K đơn Laptop",
        type: "order",
        discount_type: "fixed",
        discount_value: 500000,
        max_discount: null,
        min_order_value: 5000000,
        quantity: 50,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "FREESHIP",
        name: "Miễn phí vận chuyển",
        type: "shipping",
        discount_type: "fixed",
        discount_value: 30000,
        max_discount: 30000,
        min_order_value: 200000,
        quantity: 200,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "LAPTOP15",
        name: "Sale laptop 15%",
        type: "order",
        discount_type: "percent",
        discount_value: 15,
        max_discount: 1000000,
        min_order_value: 8000000,
        quantity: 40,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "ACCESS20",
        name: "Sale phụ kiện 20%",
        type: "order",
        discount_type: "percent",
        discount_value: 20,
        max_discount: 200000,
        min_order_value: 500000,
        quantity: 150,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "MOUSE50",
        name: "Giảm 50K chuột gaming",
        type: "order",
        discount_type: "fixed",
        discount_value: 50000,
        max_discount: null,
        min_order_value: 200000,
        quantity: 100,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "KEYBOARD100",
        name: "Giảm 100K bàn phím",
        type: "order",
        discount_type: "fixed",
        discount_value: 100000,
        max_discount: null,
        min_order_value: 500000,
        quantity: 100,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "FLASH10",
        name: "Flash Sale 10%",
        type: "order",
        discount_type: "percent",
        discount_value: 10,
        max_discount: 300000,
        min_order_value: 1000000,
        quantity: 50,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "STUDENT5",
        name: "Ưu đãi sinh viên",
        type: "order",
        discount_type: "percent",
        discount_value: 5,
        max_discount: 200000,
        min_order_value: 1000000,
        quantity: 500,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "SUMMER15",
        name: "Khuyến mãi mùa hè",
        type: "order",
        discount_type: "percent",
        discount_value: 15,
        max_discount: 700000,
        min_order_value: 3000000,
        quantity: 100,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "SSD100",
        name: "Giảm 100K SSD",
        type: "order",
        discount_type: "fixed",
        discount_value: 100000,
        max_discount: null,
        min_order_value: 800000,
        quantity: 80,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "RAM10",
        name: "Sale RAM 10%",
        type: "order",
        discount_type: "percent",
        discount_value: 10,
        max_discount: 200000,
        min_order_value: 500000,
        quantity: 120,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "MONITOR200",
        name: "Giảm 200K màn hình",
        type: "order",
        discount_type: "fixed",
        discount_value: 200000,
        max_discount: null,
        min_order_value: 2000000,
        quantity: 60,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "BIGSALE20",
        name: "Big Sale 20%",
        type: "order",
        discount_type: "percent",
        discount_value: 20,
        max_discount: 1000000,
        min_order_value: 10000000,
        quantity: 30,
        start_date: new Date(),
        end_date: null,
        status: 1
      },

      {
        code: "FREESHIP50",
        name: "Freeship 50K",
        type: "shipping",
        discount_type: "fixed",
        discount_value: 50000,
        max_discount: 50000,
        min_order_value: 500000,
        quantity: 200,
        start_date: new Date(),
        end_date: null,
        status: 1
      }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("vouchers", null, {});
  }
};
