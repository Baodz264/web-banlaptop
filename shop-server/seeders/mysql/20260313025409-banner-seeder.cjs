'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("banners", [
      {
        title: "MacBook Sale 2026",
        image: "macbook-banner.jpg",
        link: "/products/macbook",
        position: "home_top",
        status: 1,
      },
      {
        title: "Dell XPS Siêu Mỏng",
        image: "dell-xps-banner.jpg",
        link: "/products/dell-xps",
        position: "home_top",
        status: 1,
      },
      {
        title: "Laptop Gaming ASUS ROG",
        image: "asus-rog-banner.jpg",
        link: "/products/asus-rog",
        position: "home_middle",
        status: 1,
      },
      {
        title: "Lenovo ThinkPad Doanh Nhân",
        image: "lenovo-thinkpad-banner.jpg",
        link: "/products/lenovo-thinkpad",
        position: "home_middle",
        status: 1,
      },
      {
        title: "Khuyến mãi Laptop Sinh Viên",
        image: "student-laptop-sale.jpg",
        link: "/promotion/student",
        position: "home_bottom",
        status: 1,
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("banners", null, {});
  }
};
