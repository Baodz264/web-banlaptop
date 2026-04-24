import WarrantyRepository from "./warranty.repository.js";
import generateCode from "../../utils/generateCode.js";

class WarrantyService {

  static async getWarranties(query) {
    return await WarrantyRepository.findAll(query);
  }

  static async getWarrantyById(id) {

    const warranty = await WarrantyRepository.findById(id);

    if (!warranty) {
      throw new Error("Không tìm thấy bảo hành");
    }

    return warranty;
  }

  static async createWarranty(data) {

    // tạo mã bảo hành tự động
    let code;
    let exist;

    do {
      code = generateCode("WAR");
      exist = await WarrantyRepository.findByCode(code);
    } while (exist);

    const newData = {
      ...data,
      warranty_code: code
    };

    return await WarrantyRepository.create(newData);
  }

  static async updateWarranty(id, data) {

    const warranty = await WarrantyRepository.findById(id);

    if (!warranty) {
      throw new Error("Không tìm thấy bảo hành");
    }

    return await WarrantyRepository.update(id, data);
  }

  static async deleteWarranty(id) {

    const warranty = await WarrantyRepository.findById(id);

    if (!warranty) {
      throw new Error("Không tìm thấy bảo hành");
    }

    return await WarrantyRepository.delete(id);
  }
}

export default WarrantyService;
