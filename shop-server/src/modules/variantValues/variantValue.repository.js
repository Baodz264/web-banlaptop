import {
  VariantValue,
  AttributeValue,
  Attribute
} from "../../database/mysql/index.js";

class VariantValueRepository {

  static async findAllByVariantId(variant_id) {
    return await VariantValue.findAll({
      where: { variant_id },

      include: [
        {
          model: AttributeValue,
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          },

          include: [
            {
              model: Attribute,
              attributes: {
                exclude: ["createdAt", "updatedAt"]
              }
            }
          ]
        }
      ]
    });
  }

  static async create(data) {
    return await VariantValue.create(data);
  }

  static async bulkCreate(data) {
    return await VariantValue.bulkCreate(data);
  }

  static async deleteByVariantId(variant_id) {
    return await VariantValue.destroy({
      where: { variant_id }
    });
  }

}

export default VariantValueRepository;
