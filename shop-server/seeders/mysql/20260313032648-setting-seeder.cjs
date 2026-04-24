module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("settings", [
      { key: "site_name", value: "Bao Shop" },
      { key: "site_slogan", value: "Mua sắm công nghệ giá tốt" },
      { key: "site_email", value: "admin@baoshop.com" },
      { key: "site_phone", value: "0909123456" },
      { key: "site_address", value: "TP Hồ Chí Minh, Việt Nam" },
      { key: "site_facebook", value: "https://facebook.com/baoshop" },
      { key: "site_youtube", value: "https://youtube.com/baoshop" },
      { key: "site_instagram", value: "https://instagram.com/baoshop" },
      { key: "site_logo", value: "/uploads/logo.png" },
      { key: "site_favicon", value: "/uploads/favicon.ico" },
      { key: "seo_title", value: "Bao Shop - Cửa hàng công nghệ" },
      { key: "seo_description", value: "Chuyên bán điện thoại, laptop, phụ kiện chính hãng giá tốt" },
      { key: "seo_keywords", value: "điện thoại, laptop, phụ kiện, công nghệ" },
      { key: "shipping_fee", value: "30000" },
      { key: "free_shipping_limit", value: "500000" },
      { key: "currency", value: "VND" },
      { key: "timezone", value: "Asia/Ho_Chi_Minh" },
      { key: "maintenance_mode", value: "0" },
      { key: "contact_email", value: "support@baoshop.com" },
      { key: "contact_phone", value: "02812345678" }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("settings", null, {});
  }
};
