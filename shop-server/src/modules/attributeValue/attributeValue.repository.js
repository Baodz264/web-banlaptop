import {
  AttributeValue,
  Attribute,
  Variant
} from "../../database/mysql/index.js";

class AttributeValueRepository {

  static async findAll() {
    return await AttributeValue.findAll({
      include: [
        {
          model: Attribute,
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        },
        {
          model: Variant,
          through: { attributes: [] },
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    });
  }

  static async findById(id) {
    return await AttributeValue.findOne({
      where: { id },
      include: [
        {
          model: Attribute,
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        },
        {
          model: Variant,
          through: { attributes: [] },
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    });
  }

  static async findByAttributeId(attribute_id) {
    return await AttributeValue.findAll({
      where: { attribute_id },
      include: [
        {
          model: Attribute,
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        },
        {
          model: Variant,
          through: { attributes: [] },
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    });
  }

  static async create(data) {
    return await AttributeValue.create(data);
  }

  static async update(id, data) {
    await AttributeValue.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {
    return await AttributeValue.destroy({
      where: { id }
    });
  }
}

export default AttributeValueRepository;
