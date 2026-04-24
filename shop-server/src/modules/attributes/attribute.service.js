import AttributeRepository from "./attribute.repository.js";

class AttributeService {

  static async getAttributes() {
    return await AttributeRepository.findAll();
  }

  static async getAttributeById(id) {

    const attribute = await AttributeRepository.findById(id);

    if (!attribute) {
      throw new Error("Không tìm thấy thuộc tính");
    }

    return attribute;
  }

  static async createAttribute(data) {
    return await AttributeRepository.create(data);
  }

  static async updateAttribute(id, data) {

    const attribute = await AttributeRepository.findById(id);

    if (!attribute) {
      throw new Error("Không tìm thấy thuộc tính");
    }

    return await AttributeRepository.update(id, data);
  }

  static async deleteAttribute(id) {

    const attribute = await AttributeRepository.findById(id);

    if (!attribute) {
      throw new Error("Attribute not found");
    }

    return await AttributeRepository.delete(id);
  }
}

export default AttributeService;
