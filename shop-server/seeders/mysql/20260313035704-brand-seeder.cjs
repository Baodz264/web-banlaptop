module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("brands", [
      { id: 1, name: "Apple", slug: "apple", logo: "apple.png" },
      { id: 2, name: "Dell", slug: "dell", logo: "dell.png" },
      { id: 3, name: "HP", slug: "hp", logo: "hp.png" },
      { id: 4, name: "Asus", slug: "asus", logo: "asus.png" },
      { id: 5, name: "Lenovo", slug: "lenovo", logo: "lenovo.png" },
      { id: 6, name: "Acer", slug: "acer", logo: "acer.png" },
      { id: 7, name: "MSI", slug: "msi", logo: "msi.png" },
      { id: 8, name: "Gigabyte", slug: "gigabyte", logo: "gigabyte.png" },
      { id: 9, name: "Logitech", slug: "logitech", logo: "logitech.png" },
      { id: 10, name: "Razer", slug: "razer", logo: "razer.png" },
      { id: 11, name: "Corsair", slug: "corsair", logo: "corsair.png" },
      { id: 12, name: "Samsung", slug: "samsung", logo: "samsung.png" },
      { id: 13, name: "Kingston", slug: "kingston", logo: "kingston.png" },
      { id: 14, name: "Intel", slug: "intel", logo: "intel.png" },
      { id: 15, name: "AMD", slug: "amd", logo: "amd.png" }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("brands", null, {});
  }
};
