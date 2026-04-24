import BannerRepository from "./banner.repository.js";

class BannerService {

  static async getBanners(query) {
    return await BannerRepository.findAll(query);
  }

  static async getBannerById(id) {

    const banner = await BannerRepository.findById(id);

    if (!banner) {
      throw new Error(" Không tìm thấy banner");
    }

    return banner;
  }

  static async createBanner(data) {
    return await BannerRepository.create(data);
  }

  static async updateBanner(id, data) {

    const banner = await BannerRepository.findById(id);

    if (!banner) {
      throw new Error(" Không tìm thấy banner");
    }

    return await BannerRepository.update(id, data);
  }

  static async deleteBanner(id) {

    const banner = await BannerRepository.findById(id);

    if (!banner) {
      throw new Error(" Không tìm thấy banner");
    }

    return await BannerRepository.delete(id);
  }
}

export default BannerService;
