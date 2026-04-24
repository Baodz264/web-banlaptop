module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("product_variants", [

      // ======================================================
      // 🍎 MACBOOK AIR M2 (1)
      // ======================================================
      { product_id: 1, sku: "MBA-M2-8-256", price: 25000000, stock: 10, weight: 1.2, is_default: 1, created_at: now, updated_at: now },
      { product_id: 1, sku: "MBA-M2-16-256", price: 28000000, stock: 6, weight: 1.2, is_default: 0, created_at: now, updated_at: now },
      { product_id: 1, sku: "MBA-M2-16-512", price: 32000000, stock: 5, weight: 1.2, is_default: 0, created_at: now, updated_at: now },
      { product_id: 1, sku: "MBA-M2-24-1TB", price: 38000000, stock: 3, weight: 1.2, is_default: 0, created_at: now, updated_at: now },

      // ======================================================
      // 🍎 MACBOOK PRO M3 (2)
      // ======================================================
      { product_id: 2, sku: "MBP-M3-16-512", price: 36000000, stock: 8, weight: 1.5, is_default: 1, created_at: now, updated_at: now },
      { product_id: 2, sku: "MBP-M3-32-1TB", price: 45000000, stock: 4, weight: 1.5, is_default: 0, created_at: now, updated_at: now },
      { product_id: 2, sku: "MBP-M3-36-1TB", price: 52000000, stock: 2, weight: 1.5, is_default: 0, created_at: now, updated_at: now },

      // ======================================================
      // 🍎 MACBOOK PRO 14 (3)
      // ======================================================
      { product_id: 3, sku: "MBP14-M2-16-512", price: 40000000, stock: 6, weight: 1.6, is_default: 1, created_at: now, updated_at: now },
      { product_id: 3, sku: "MBP14-M2-32-1TB", price: 52000000, stock: 3, weight: 1.6, is_default: 0, created_at: now, updated_at: now },

      // ======================================================
      // 🍎 MACBOOK AIR M1 (4)
      // ======================================================
      { product_id: 4, sku: "MBA-M1-8-256", price: 18000000, stock: 8, weight: 1.2, is_default: 1, created_at: now, updated_at: now },
      { product_id: 4, sku: "MBA-M1-16-512", price: 22000000, stock: 5, weight: 1.2, is_default: 0, created_at: now, updated_at: now },

      // ======================================================
      // 🎮 ASUS ROG STRIX G16 (5)
      // ======================================================
      { product_id: 5, sku: "ROG-3060-16-512", price: 30000000, stock: 7, weight: 2.3, is_default: 1, created_at: now, updated_at: now },
      { product_id: 5, sku: "ROG-4060-16-1TB", price: 36000000, stock: 5, weight: 2.3, is_default: 0, created_at: now, updated_at: now },
      { product_id: 5, sku: "ROG-4070-32-1TB", price: 42000000, stock: 3, weight: 2.3, is_default: 0, created_at: now, updated_at: now },

      // ======================================================
      // 🎮 MSI KATANA 15 (6)
      // ======================================================
      { product_id: 6, sku: "MSI-3060-16-512", price: 29000000, stock: 5, weight: 2.2, is_default: 1, created_at: now, updated_at: now },
      { product_id: 6, sku: "MSI-4060-32-1TB", price: 38000000, stock: 3, weight: 2.2, is_default: 0, created_at: now, updated_at: now },

      // ======================================================
      // 🎮 ACER NITRO 5 (7)
      // ======================================================
      { product_id: 7, sku: "NITRO-3050-16-512", price: 27000000, stock: 6, weight: 2.4, is_default: 1, created_at: now, updated_at: now },
      { product_id: 7, sku: "NITRO-3060-16-1TB", price: 30000000, stock: 4, weight: 2.4, is_default: 0, created_at: now, updated_at: now },

      // ======================================================
      // 🎮 GIGABYTE G5 (8)
      // ======================================================
      { product_id: 8, sku: "G5-3060-16-512", price: 28500000, stock: 6, weight: 2.3, is_default: 1, created_at: now, updated_at: now },
      { product_id: 8, sku: "G5-4060-16-1TB", price: 34000000, stock: 4, weight: 2.3, is_default: 0, created_at: now, updated_at: now },

      // ======================================================
      // 🎮 DELL G15 (9)
      // ======================================================
      { product_id: 9, sku: "G15-3050-16-512", price: 27000000, stock: 6, weight: 2.4, is_default: 1, created_at: now, updated_at: now },
      { product_id: 9, sku: "G15-3060-16-1TB", price: 30000000, stock: 4, weight: 2.4, is_default: 0, created_at: now, updated_at: now },

      // ======================================================
      // 💼 OFFICE LAPTOP (10–13)
      // ======================================================
      { product_id: 10, sku: "HP-15-I5-8-512", price: 18000000, stock: 10, weight: 1.7, is_default: 1, created_at: now, updated_at: now },
      { product_id: 11, sku: "THINKPAD-I7-16-512", price: 32000000, stock: 6, weight: 1.3, is_default: 1, created_at: now, updated_at: now },
      { product_id: 12, sku: "INSPIRON-I5-8-512", price: 19000000, stock: 8, weight: 1.5, is_default: 1, created_at: now, updated_at: now },
      { product_id: 13, sku: "VIVOBOOK-I5-8-256", price: 17000000, stock: 9, weight: 1.4, is_default: 1, created_at: now, updated_at: now },

      // ======================================================
      // 🖥️ PC GAMING (14–15)
      // ======================================================
      { product_id: 14, sku: "RYZEN5-3060-16-512", price: 25000000, stock: 5, weight: 8, is_default: 1, created_at: now, updated_at: now },
      { product_id: 15, sku: "I7-4060-32-1TB", price: 32000000, stock: 4, weight: 8, is_default: 1, created_at: now, updated_at: now },

      // ======================================================
      // 🖱️ MOUSE (16–18)
      // ======================================================
      { product_id: 16, sku: "G102-BLACK", price: 400000, stock: 50, weight: 0.2, is_default: 1, created_at: now, updated_at: now },
      { product_id: 17, sku: "DA-ELITE", price: 800000, stock: 30, weight: 0.25, is_default: 1, created_at: now, updated_at: now },
      { product_id: 18, sku: "MX-MASTER-3", price: 2200000, stock: 20, weight: 0.25, is_default: 1, created_at: now, updated_at: now },

      // ======================================================
      // ⌨️ KEYBOARD (19–20)
      // ======================================================
      { product_id: 19, sku: "K70-RGB", price: 3000000, stock: 10, weight: 1.2, is_default: 1, created_at: now, updated_at: now },
      { product_id: 20, sku: "BLACKWIDOW", price: 2800000, stock: 8, weight: 1.1, is_default: 1, created_at: now, updated_at: now },

      // ======================================================
      // 🎧 HEADSET (21–22)
      // ======================================================
      { product_id: 21, sku: "KRAKEN-BLK", price: 1500000, stock: 15, weight: 0.4, is_default: 1, created_at: now, updated_at: now },
      { product_id: 22, sku: "G733-WL", price: 2500000, stock: 10, weight: 0.35, is_default: 1, created_at: now, updated_at: now },

      // ======================================================
      // 🖥️ MONITOR (23–24)
      // ======================================================
      { product_id: 23, sku: "ODYSSEY-G5", price: 7000000, stock: 6, weight: 4.5, is_default: 1, created_at: now, updated_at: now },
      { product_id: 24, sku: "DELL-U2720Q", price: 9000000, stock: 5, weight: 4.0, is_default: 1, created_at: now, updated_at: now },

      // ======================================================
      // 💾 SSD (25–26)
      // ======================================================
      { product_id: 25, sku: "NV2-1TB", price: 1500000, stock: 20, weight: 0.1, is_default: 1, created_at: now, updated_at: now },
      { product_id: 25, sku: "NV2-2TB", price: 2800000, stock: 10, weight: 0.1, is_default: 0, created_at: now, updated_at: now },
      { product_id: 26, sku: "980PRO-1TB", price: 2500000, stock: 15, weight: 0.1, is_default: 1, created_at: now, updated_at: now },

      // ======================================================
      // 🧠 RAM (27–28)
      // ======================================================
      { product_id: 27, sku: "FURY-16GB", price: 1300000, stock: 18, weight: 0.1, is_default: 1, created_at: now, updated_at: now },
      { product_id: 27, sku: "FURY-32GB", price: 2400000, stock: 12, weight: 0.1, is_default: 0, created_at: now, updated_at: now },
      { product_id: 28, sku: "VENGEANCE-32GB", price: 2600000, stock: 10, weight: 0.1, is_default: 1, created_at: now, updated_at: now },

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("product_variants", null, {});
  }
};
