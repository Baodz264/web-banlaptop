import MenuRepository from "./menu.repository.js";

class MenuService {

  static async getMenus(query) {
    return await MenuRepository.findAll(query);
  }

  static async getMenuById(id) {

    const menu = await MenuRepository.findById(id);

    if (!menu) {
      throw new Error("Không tìm thấy menu");
    }

    return menu;
  }

  static async createMenu(data) {
    return await MenuRepository.create(data);
  }

  static async updateMenu(id, data) {

    const menu = await MenuRepository.findById(id);

    if (!menu) {
      throw new Error("Không tìm thấy menu");
    }

    return await MenuRepository.update(id, data);
  }

  static async deleteMenu(id) {

    const menu = await MenuRepository.findById(id);

    if (!menu) {
      throw new Error("Không tìm thấy menu");
    }

    return await MenuRepository.delete(id);
  }
}

export default MenuService;
