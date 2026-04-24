import AttributeValueRepository from "./attributeValue.repository.js";

class AttributeValueService {

  static async getValues() {
    return await AttributeValueRepository.findAll();
  }

  static async getValueById(id) {

    const value = await AttributeValueRepository.findById(id);

    if (!value) {
      throw new Error("Không tìm thấy giá trị thuộc tính");
    }

    return value;
  }

  static async getValuesByAttribute(attribute_id) {
    return await AttributeValueRepository.findByAttributeId(attribute_id);
  }

  static async createValue(data) {
    return await AttributeValueRepository.create(data);
  }

  static async updateValue(id, data) {

    const value = await AttributeValueRepository.findById(id);

    if (!value) {
      throw new Error("Không tìm thấy giá trị thuộc tính");
    }

    return await AttributeValueRepository.update(id, data);
  }

  static async deleteValue(id) {

    const value = await AttributeValueRepository.findById(id);

    if (!value) {
      throw new Error("Không tìm thấy giá trị thuộc tính");
    }

    return await AttributeValueRepository.delete(id);
  }
}

export default AttributeValueService;





