module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("topics", [
      {
        name: "Tin công nghệ",
        slug: "tin-cong-nghe",
        description: "Tin tức mới nhất về công nghệ",
        status: 1,
      },
      {
        name: "Laptop",
        slug: "laptop",
        description: "Tin tức và review laptop",
        status: 1,
      },
      {
        name: "PC Gaming",
        slug: "pc-gaming",
        description: "Tin tức build PC gaming",
        status: 1,
      },
      {
        name: "Thủ thuật",
        slug: "thu-thuat",
        description: "Mẹo sử dụng máy tính",
        status: 1,
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("topics", null, {});
  },
};
