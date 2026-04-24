module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("products", [

      // ===== MACBOOK =====
      {
        id: 1, category_id: 2, brand_id: 1,
        name: "Macbook Air M2",
        slug: "macbook-air-m2",
        description: "Laptop mỏng nhẹ của Apple",
        thumbnail: "macbook-air-m2.jpg",
        product_type: "main", status: 1
      },
      {
        id: 2, category_id: 2, brand_id: 1,
        name: "Macbook Pro M3",
        slug: "macbook-pro-m3",
        description: "Laptop mạnh mẽ",
        thumbnail: "macbook-pro-m3.jpg",
        product_type: "main", status: 1
      },
      {
        id: 3, category_id: 2, brand_id: 1,
        name: "Macbook Pro 14 M2",
        slug: "macbook-pro-14-m2",
        description: "Hiệu năng cao cho dev",
        thumbnail: "mbp14.jpg",
        product_type: "main", status: 1
      },
      {
        id: 4, category_id: 2, brand_id: 1,
        name: "Macbook Air M1",
        slug: "macbook-air-m1",
        description: "Giá tốt",
        thumbnail: "mba-m1.jpg",
        product_type: "main", status: 1
      },

      // ===== GAMING =====
      {
        id: 5, category_id: 3, brand_id: 4,
        name: "Asus ROG Strix G16",
        slug: "rog-strix-g16",
        description: "RTX mạnh mẽ",
        thumbnail: "rog.jpg",
        product_type: "main", status: 1
      },
      {
        id: 6, category_id: 3, brand_id: 7,
        name: "MSI Katana 15",
        slug: "msi-katana-15",
        description: "Gaming phổ biến",
        thumbnail: "katana.jpg",
        product_type: "main", status: 1
      },
      {
        id: 7, category_id: 3, brand_id: 6,
        name: "Acer Nitro 5",
        slug: "nitro-5",
        description: "Gaming giá rẻ",
        thumbnail: "nitro.jpg",
        product_type: "main", status: 1
      },
      {
        id: 8, category_id: 3, brand_id: 8,
        name: "Gigabyte G5",
        slug: "gigabyte-g5",
        description: "Tầm trung",
        thumbnail: "g5.jpg",
        product_type: "main", status: 1
      },
      {
        id: 9, category_id: 3, brand_id: 2,
        name: "Dell G15",
        slug: "dell-g15",
        description: "Gaming giá tốt",
        thumbnail: "g15.jpg",
        product_type: "main", status: 1
      },

      // ===== OFFICE =====
      {
        id: 10, category_id: 4, brand_id: 3,
        name: "HP Pavilion 15",
        slug: "hp-pavilion-15",
        description: "Văn phòng",
        thumbnail: "hp15.jpg",
        product_type: "main", status: 1
      },
      {
        id: 11, category_id: 4, brand_id: 5,
        name: "ThinkPad X1 Carbon",
        slug: "thinkpad-x1",
        description: "Doanh nhân",
        thumbnail: "x1.jpg",
        product_type: "main", status: 1
      },
      {
        id: 12, category_id: 4, brand_id: 2,
        name: "Dell Inspiron 14",
        slug: "inspiron-14",
        description: "Sinh viên",
        thumbnail: "insp.jpg",
        product_type: "main", status: 1
      },
      {
        id: 13, category_id: 4, brand_id: 4,
        name: "Asus VivoBook",
        slug: "vivobook",
        description: "Mỏng nhẹ",
        thumbnail: "vivo.jpg",
        product_type: "main", status: 1
      },

      // ===== PC GAMING =====
      {
        id: 14, category_id: 6, brand_id: 15,
        name: "PC Gaming Ryzen 5 RTX 3060",
        slug: "pc-ryzen5-3060",
        description: "PC gaming mạnh",
        thumbnail: "pc1.jpg",
        product_type: "main", status: 1
      },
      {
        id: 15, category_id: 6, brand_id: 14,
        name: "PC Intel i7 RTX 4060",
        slug: "pc-i7-4060",
        description: "PC cao cấp",
        thumbnail: "pc2.jpg",
        product_type: "main", status: 1
      },

      // ===== CHUỘT =====
      {
        id: 16, category_id: 9, brand_id: 9,
        name: "Logitech G102",
        slug: "g102",
        description: "Chuột gaming",
        thumbnail: "g102.jpg",
        product_type: "accessory", status: 1
      },
      {
        id: 17, category_id: 9, brand_id: 10,
        name: "Razer DeathAdder",
        slug: "deathadder",
        description: "Chuột nổi tiếng",
        thumbnail: "death.jpg",
        product_type: "accessory", status: 1
      },
      {
        id: 18, category_id: 9, brand_id: 9,
        name: "Logitech MX Master 3",
        slug: "mx-master-3",
        description: "Chuột cao cấp",
        thumbnail: "mx3.jpg",
        product_type: "accessory", status: 1
      },

      // ===== BÀN PHÍM =====
      {
        id: 19, category_id: 10, brand_id: 11,
        name: "Corsair K70",
        slug: "corsair-k70",
        description: "Phím cơ",
        thumbnail: "k70.jpg",
        product_type: "accessory", status: 1
      },
      {
        id: 20, category_id: 10, brand_id: 10,
        name: "Razer BlackWidow",
        slug: "blackwidow",
        description: "Gaming",
        thumbnail: "bw.jpg",
        product_type: "accessory", status: 1
      },

      // ===== TAI NGHE =====
      {
        id: 21, category_id: 11, brand_id: 10,
        name: "Razer Kraken",
        slug: "kraken",
        description: "Tai nghe gaming",
        thumbnail: "kraken.jpg",
        product_type: "accessory", status: 1
      },
      {
        id: 22, category_id: 11, brand_id: 9,
        name: "Logitech G733",
        slug: "g733",
        description: "Wireless",
        thumbnail: "g733.jpg",
        product_type: "accessory", status: 1
      },

      // ===== MÀN HÌNH =====
      {
        id: 23, category_id: 12, brand_id: 12,
        name: "Samsung Odyssey G5",
        slug: "odyssey-g5",
        description: "144Hz",
        thumbnail: "g5.jpg",
        product_type: "accessory", status: 1
      },
      {
        id: 24, category_id: 12, brand_id: 2,
        name: "Dell U2720Q",
        slug: "u2720q",
        description: "4K",
        thumbnail: "u2720q.jpg",
        product_type: "accessory", status: 1
      },

      // ===== SSD =====
      {
        id: 25, category_id: 13, brand_id: 13,
        name: "Kingston NV2 1TB",
        slug: "nv2-1tb",
        description: "SSD nhanh",
        thumbnail: "nv2.jpg",
        product_type: "accessory", status: 1
      },
      {
        id: 26, category_id: 13, brand_id: 12,
        name: "Samsung 980 Pro",
        slug: "980-pro",
        description: "SSD cao cấp",
        thumbnail: "980.jpg",
        product_type: "accessory", status: 1
      },

      // ===== RAM =====
      {
        id: 27, category_id: 14, brand_id: 13,
        name: "Kingston Fury 16GB",
        slug: "fury-16gb",
        description: "DDR4",
        thumbnail: "fury.jpg",
        product_type: "accessory", status: 1
      },
      {
        id: 28, category_id: 14, brand_id: 11,
        name: "Corsair Vengeance 32GB",
        slug: "vengeance-32gb",
        description: "Hiệu năng cao",
        thumbnail: "ven.jpg",
        product_type: "accessory", status: 1
      }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("products", null, {});
  }
};
