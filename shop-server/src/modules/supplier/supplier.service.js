import SupplierRepository from "./supplier.repository.js";

class SupplierService {

  static async getSuppliers(query) {
    return await SupplierRepository.findAll(query);
  }

  static async getSupplierById(id) {

    const supplier = await SupplierRepository.findById(id);

    if (!supplier) {
      throw new Error("Không tìm thấy nhà cung cấp");
    }

    return supplier;
  }

  static async createSupplier(data) {

    return await SupplierRepository.create(data);
  }

  static async updateSupplier(id, data) {

    const supplier = await SupplierRepository.findById(id);

    if (!supplier) {
      throw new Error("Không tìm thấy nhà cung cấp");
    }

    return await SupplierRepository.update(id, data);
  }

  static async deleteSupplier(id) {

    const supplier = await SupplierRepository.findById(id);

    if (!supplier) {
      throw new Error("Không tìm thấy nhà cung cấp");
    }

    return await SupplierRepository.delete(id);
  }
}

export default SupplierService;
