module.exports = {
  async up(queryInterface) {

    await queryInterface.bulkInsert("categories", [

      { id: 1, name: "Laptop", slug: "laptop", parent_id: null, status: 1 },
      { id: 2, name: "Macbook", slug: "macbook", parent_id: 1, status: 1 },
      { id: 3, name: "Laptop Gaming", slug: "laptop-gaming", parent_id: 1, status: 1 },
      { id: 4, name: "Laptop Văn phòng", slug: "laptop-office", parent_id: 1, status: 1 },

      { id: 5, name: "PC", slug: "pc", parent_id: null, status: 1 },
      { id: 6, name: "PC Gaming", slug: "pc-gaming", parent_id: 5, status: 1 },
      { id: 7, name: "PC Văn phòng", slug: "pc-office", parent_id: 5, status: 1 },

      { id: 8, name: "Phụ kiện", slug: "phu-kien", parent_id: null, status: 1 },
      { id: 9, name: "Chuột", slug: "chuot", parent_id: 8, status: 1 },
      { id: 10, name: "Bàn phím", slug: "ban-phim", parent_id: 8, status: 1 },
      { id: 11, name: "Tai nghe", slug: "tai-nghe", parent_id: 8, status: 1 },
      { id: 12, name: "Màn hình", slug: "man-hinh", parent_id: 8, status: 1 },
      { id: 13, name: "Ổ cứng", slug: "o-cung", parent_id: 8, status: 1 },
      { id: 14, name: "RAM", slug: "ram", parent_id: 8, status: 1 },
      { id: 15, name: "Webcam", slug: "webcam", parent_id: 8, status: 1 }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("categories", null, {});
  }
};
