import UserAddressRepository from "./address.repository.js";
import GoongService from "../../utils/goong.js";

class UserAddressService {
  // ✅ Admin xem tất cả
  static async getAllAddresses() {
    return await UserAddressRepository.findAll();
  }

  // ✅ User xem địa chỉ của mình
  static async getUserAddresses(userId) {
    return await UserAddressRepository.findAllByUser(userId);
  }

  // ✅ Chi tiết
  static async getAddressById(id) {
    const address = await UserAddressRepository.findById(id);

    if (!address) {
      throw new Error("Không tìm thấy địa chỉ");
    }

    return address;
  }

  // ✅ CREATE (🔥 tích hợp Goong)
  static async createAddress(userId, data) {
    if (data.is_default === 1) {
      await UserAddressRepository.resetDefault(userId);
    }

    data.user_id = userId;

    // 🔥 ghép địa chỉ đầy đủ
    const fullAddress = `${data.address_detail}, ${data.ward}, ${data.district}, ${data.province}`;

    // 🔥 gọi Goong lấy tọa độ
    const geo = await GoongService.geocode(fullAddress);

    if (geo) {
      data.lat = geo.lat;
      data.lng = geo.lng;
    }

    return await UserAddressRepository.create(data);
  }

  // ✅ UPDATE (🔥 update lại lat/lng nếu đổi địa chỉ)
  static async updateAddress(id, userId, data) {
    const address = await UserAddressRepository.findById(id);

    if (!address) {
      throw new Error("Không tìm thấy địa chỉ");
    }

    if (data.is_default === 1) {
      await UserAddressRepository.resetDefault(userId);
    }

    // 🔥 nếu có thay đổi địa chỉ → gọi lại Goong
    if (data.address_detail || data.ward || data.district || data.province) {
      const fullAddress = `${data.address_detail || address.address_detail}, 
${data.ward || address.ward}, 
${data.district || address.district}, 
${data.province || address.province}`;

      const geo = await GoongService.geocode(fullAddress);

      if (geo) {
        data.lat = geo.lat;
        data.lng = geo.lng;
      }
    }

    return await UserAddressRepository.update(id, data);
  }

  // ✅ DELETE
  static async deleteAddress(id) {
    const address = await UserAddressRepository.findById(id);

    if (!address) {
      throw new Error("Không tìm thấy địa chỉ");
    }

    return await UserAddressRepository.delete(id);
  }
}

export default UserAddressService;
