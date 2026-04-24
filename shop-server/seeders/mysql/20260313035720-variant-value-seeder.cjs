module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("product_variant_values", [

      // ======================================================
      // 🧠 MACBOOK AIR M2 (variant 1–4)
      // ======================================================

      // Variant 1: 16GB / 256GB / M2
      { variant_id: 1, attribute_value_id: 2 }, // RAM 16GB
      { variant_id: 1, attribute_value_id: 4 }, // SSD 256GB
      { variant_id: 1, attribute_value_id: 15 }, // CPU M2

      // Variant 2: 16GB / 512GB / M2
      { variant_id: 2, attribute_value_id: 2 },
      { variant_id: 2, attribute_value_id: 5 },
      { variant_id: 2, attribute_value_id: 15 },

      // Variant 3: 32GB / 512GB / M2
      { variant_id: 3, attribute_value_id: 3 },
      { variant_id: 3, attribute_value_id: 5 },
      { variant_id: 3, attribute_value_id: 15 },

      // Variant 4: 32GB / 1TB / M2
      { variant_id: 4, attribute_value_id: 3 },
      { variant_id: 4, attribute_value_id: 6 },
      { variant_id: 4, attribute_value_id: 15 },


      // ======================================================
      // 🧠 MACBOOK AIR M1 (variant 5–6)
      // ⚠️ FIX: cần CPU M1 (chưa có trong DB)
      // ======================================================

      // Variant 5: 8GB / 256GB / M1
      { variant_id: 5, attribute_value_id: 1 }, // RAM 8GB
      { variant_id: 5, attribute_value_id: 4 }, // SSD 256GB
      { variant_id: 5, attribute_value_id: 14 }, // CPU M1 (FIX)

      // Variant 6: 16GB / 512GB / M1
      { variant_id: 6, attribute_value_id: 2 },
      { variant_id: 6, attribute_value_id: 5 },
      { variant_id: 6, attribute_value_id: 14 },


      // ======================================================
      // 🍎 MACBOOK PRO M3 (variant 7–9)
      // ======================================================

      // Variant 7
      { variant_id: 7, attribute_value_id: 2 },
      { variant_id: 7, attribute_value_id: 5 },
      { variant_id: 7, attribute_value_id: 16 },

      // Variant 8
      { variant_id: 8, attribute_value_id: 3 },
      { variant_id: 8, attribute_value_id: 6 },
      { variant_id: 8, attribute_value_id: 16 },

      // Variant 9
      { variant_id: 9, attribute_value_id: 3 },
      { variant_id: 9, attribute_value_id: 6 },
      { variant_id: 9, attribute_value_id: 16 },


      // ======================================================
      // 🍎 MACBOOK PRO 14 M2 (variant 10–11)
      // ======================================================

      { variant_id: 10, attribute_value_id: 2 },
      { variant_id: 10, attribute_value_id: 6 },
      { variant_id: 10, attribute_value_id: 15 },

      { variant_id: 11, attribute_value_id: 3 },
      { variant_id: 11, attribute_value_id: 6 },
      { variant_id: 11, attribute_value_id: 15 },


      // ======================================================
      // 🎮 ASUS ROG (variant 12–14)
      // ======================================================

      { variant_id: 12, attribute_value_id: 2 }, // RAM 16GB
      { variant_id: 12, attribute_value_id: 18 }, // RTX 3060

      { variant_id: 13, attribute_value_id: 3 }, // RAM 32GB
      { variant_id: 13, attribute_value_id: 19 }, // RTX 4060

      { variant_id: 14, attribute_value_id: 3 },
      { variant_id: 14, attribute_value_id: 20 },


      // ======================================================
      // 🎮 MSI (variant 15–16)
      // ======================================================

      { variant_id: 15, attribute_value_id: 2 },
      { variant_id: 15, attribute_value_id: 18 },

      { variant_id: 16, attribute_value_id: 3 },
      { variant_id: 16, attribute_value_id: 19 },


      // ======================================================
      // 🎮 ACER / GIGABYTE / DELL gaming (17–22)
      // ======================================================

      { variant_id: 17, attribute_value_id: 2 },
      { variant_id: 17, attribute_value_id: 18 },

      { variant_id: 18, attribute_value_id: 3 },
      { variant_id: 18, attribute_value_id: 19 },

      { variant_id: 19, attribute_value_id: 2 },
      { variant_id: 19, attribute_value_id: 17 },

      { variant_id: 20, attribute_value_id: 2 },
      { variant_id: 20, attribute_value_id: 18 },

      { variant_id: 21, attribute_value_id: 3 },
      { variant_id: 21, attribute_value_id: 19 },

      { variant_id: 22, attribute_value_id: 3 },
      { variant_id: 22, attribute_value_id: 18 },


      // ======================================================
      // 🖱️ MOUSE (23–25)
      // ======================================================

      { variant_id: 23, attribute_value_id: 8 },
      { variant_id: 24, attribute_value_id: 7 },
      { variant_id: 25, attribute_value_id: 8 },


      // ======================================================
      // ⌨️ KEYBOARD (26–27)
      // ======================================================

      { variant_id: 26, attribute_value_id: 8 },
      { variant_id: 27, attribute_value_id: 8 },


      // ======================================================
      // 🎧 HEADSET (28–29)
      // ======================================================

      { variant_id: 28, attribute_value_id: 8 },
      { variant_id: 29, attribute_value_id: 8 },


      // ======================================================
      // 🖥️ MONITOR (30–31)
      // ======================================================

      { variant_id: 30, attribute_value_id: 24 },
      { variant_id: 31, attribute_value_id: 25 },


      // ======================================================
      // 💾 SSD (32–33)
      // ======================================================

      { variant_id: 32, attribute_value_id: 6 },
      { variant_id: 33, attribute_value_id: 5 },


      // ======================================================
      // 🧠 RAM (34–35)
      // ======================================================

      { variant_id: 34, attribute_value_id: 2 },
      { variant_id: 35, attribute_value_id: 3 }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("product_variant_values", null, {});
  }
};
