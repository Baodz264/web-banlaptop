module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("product_accessories", [

      // ======================================================
      // 🍎 MACBOOK (1–4)
      // Accessories: chuột + tai nghe + hub + balo
      // ======================================================
      { product_id: 1, accessory_id: 16 }, // Logitech G102
      { product_id: 1, accessory_id: 18 }, // MX Master 3
      { product_id: 1, accessory_id: 22 }, // G733 headset

      { product_id: 2, accessory_id: 16 },
      { product_id: 2, accessory_id: 18 },
      { product_id: 2, accessory_id: 22 },

      { product_id: 3, accessory_id: 16 },
      { product_id: 3, accessory_id: 18 },
      { product_id: 3, accessory_id: 22 },

      { product_id: 4, accessory_id: 16 },
      { product_id: 4, accessory_id: 18 },
      { product_id: 4, accessory_id: 22 },

      // ======================================================
      // 🎮 GAMING LAPTOP (5–9)
      // Accessories: gaming mouse + keyboard + headset + monitor
      // ======================================================
      { product_id: 5, accessory_id: 16 }, // G102 (basic mouse)
      { product_id: 5, accessory_id: 17 }, // Razer DeathAdder
      { product_id: 5, accessory_id: 20 }, // BlackWidow
      { product_id: 5, accessory_id: 21 }, // Kraken
      { product_id: 5, accessory_id: 23 }, // Monitor

      { product_id: 6, accessory_id: 16 },
      { product_id: 6, accessory_id: 17 },
      { product_id: 6, accessory_id: 20 },
      { product_id: 6, accessory_id: 21 },
      { product_id: 6, accessory_id: 23 },

      { product_id: 7, accessory_id: 16 },
      { product_id: 7, accessory_id: 17 },
      { product_id: 7, accessory_id: 20 },
      { product_id: 7, accessory_id: 21 },
      { product_id: 7, accessory_id: 23 },

      { product_id: 8, accessory_id: 16 },
      { product_id: 8, accessory_id: 17 },
      { product_id: 8, accessory_id: 20 },
      { product_id: 8, accessory_id: 21 },
      { product_id: 8, accessory_id: 23 },

      { product_id: 9, accessory_id: 16 },
      { product_id: 9, accessory_id: 17 },
      { product_id: 9, accessory_id: 20 },
      { product_id: 9, accessory_id: 21 },
      { product_id: 9, accessory_id: 23 },

      // ======================================================
      // 💼 OFFICE LAPTOP (10–13)
      // Accessories: chuột văn phòng + màn hình + bàn phím nhẹ
      // ======================================================
      { product_id: 10, accessory_id: 18 }, // MX Master 3
      { product_id: 10, accessory_id: 24 }, // Dell monitor

      { product_id: 11, accessory_id: 18 },
      { product_id: 11, accessory_id: 24 },

      { product_id: 12, accessory_id: 16 },
      { product_id: 12, accessory_id: 24 },

      { product_id: 13, accessory_id: 16 },
      { product_id: 13, accessory_id: 24 },

      // ======================================================
      // 🖥️ PC GAMING (14–15)
      // Accessories: monitor + keyboard + mouse + headset
      // ======================================================
      { product_id: 14, accessory_id: 17 }, // gaming mouse
      { product_id: 14, accessory_id: 20 }, // keyboard
      { product_id: 14, accessory_id: 21 }, // headset
      { product_id: 14, accessory_id: 23 }, // monitor

      { product_id: 15, accessory_id: 17 },
      { product_id: 15, accessory_id: 20 },
      { product_id: 15, accessory_id: 21 },
      { product_id: 15, accessory_id: 23 }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("product_accessories", null, {});
  }
};
