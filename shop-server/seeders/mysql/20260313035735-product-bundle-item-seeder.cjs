module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("product_bundle_items", [

      // ======================================================
      // 🧩 COMBO 1: Macbook + Chuột
      // ======================================================
      {
        bundle_id: 1,
        variant_id: 1 // Macbook Air M2 (default variant)
      },
      {
        bundle_id: 1,
        variant_id: 15 // Logitech G102
      },

      // ======================================================
      // 🧩 COMBO 2: Laptop Gaming
      // ======================================================
      {
        bundle_id: 2,
        variant_id: 8 // ROG variant
      },
      {
        bundle_id: 2,
        variant_id: 15 // mouse
      },
      {
        bundle_id: 2,
        variant_id: 18 // headset
      },

      // ======================================================
      // 🧩 COMBO 3: Full Gaming Setup
      // ======================================================
      {
        bundle_id: 3,
        variant_id: 8 // ROG laptop
      },
      {
        bundle_id: 3,
        variant_id: 15 // mouse
      },
      {
        bundle_id: 3,
        variant_id: 17 // keyboard
      },
      {
        bundle_id: 3,
        variant_id: 18 // headset
      },

      // ======================================================
      // 🧩 COMBO 4: Văn phòng
      // ======================================================
      {
        bundle_id: 4,
        variant_id: 13 // Dell G15 (office laptop)
      },
      {
        bundle_id: 4,
        variant_id: 15 // mouse
      },
      {
        bundle_id: 4,
        variant_id: 17 // keyboard
      }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("product_bundle_items", null, {});
  }
};
