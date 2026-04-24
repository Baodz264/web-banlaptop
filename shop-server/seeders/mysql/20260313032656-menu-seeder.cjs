module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert("menus", [
      {
        name: "Trang chủ",
        link: "/",
        parent_id: null,
        position: 1,
        status: 1
      },
      {
        name: "Laptop",
        link: "/laptop",
        parent_id: null,
        position: 2,
        status: 1
      },
      {
        name: "Máy tính để bàn",
        link: "/pc",
        parent_id: null,
        position: 3,
        status: 1
      },
      {
        name: "Phụ kiện",
        link: "/phu-kien",
        parent_id: null,
        position: 4,
        status: 1
      },
      {
        name: "Tin tức",
        link: "/tin-tuc",
        parent_id: null,
        position: 5,
        status: 1
      },
      {
        name: "Liên hệ",
        link: "/lien-he",
        parent_id: null,
        position: 6,
        status: 1
      }
    ]);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("menus", null, {});
  }
};
