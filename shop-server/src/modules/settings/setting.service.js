import SettingRepository from "./setting.repository.js";

class SettingService {

  static async getSettings(query) {
    return await SettingRepository.findAll(query);
  }

  static async getSettingById(id) {

    const setting = await SettingRepository.findById(id);

    if (!setting) {
      throw new Error("Không tìm thấy cài đặt");
    }

    return setting;
  }

  static async getSettingByKey(key) {

    const setting = await SettingRepository.findByKey(key);

    if (!setting) {
      throw new Error("Không tìm thấy cài đặt");
    }

    return setting;
  }

  static async createSetting(data) {

    const exist = await SettingRepository.findByKey(data.key);

    if (exist) {
      throw new Error("Key cài đặt đã tồn tại");
    }

    return await SettingRepository.create(data);
  }

  static async updateSetting(id, data) {

    const setting = await SettingRepository.findById(id);

    if (!setting) {
      throw new Error("Setting not found");
    }

    return await SettingRepository.update(id, data);
  }

  static async deleteSetting(id) {

    const setting = await SettingRepository.findById(id);

    if (!setting) {
      throw new Error("Setting not found");
    }

    return await SettingRepository.delete(id);
  }
}

export default SettingService;
