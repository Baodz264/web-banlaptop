import {
  Attribute,
  AttributeValue
} from "../../database/mysql/index.js";

class AttributeRepository {

  static baseInclude = [
    {
      model: AttributeValue,
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  ];

  static async findAll() {
    return await Attribute.findAll({
      include: this.baseInclude,
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    });
  }

  static async findById(id) {
    return await Attribute.findByPk(id, {
      include: this.baseInclude,
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    });
  }

  static async create(data) {
    return await Attribute.create(data);
  }

  static async update(id, data) {
    await Attribute.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {
    return await Attribute.destroy({
      where: { id }
    });
  }
}

export default AttributeRepository;
