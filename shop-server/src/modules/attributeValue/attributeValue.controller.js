  import AttributeValueService from "./attributeValue.service.js";
  import asyncHandler from "../../utils/asyncHandler.js";
  import response from "../../utils/response.js";

  class AttributeValueController {

    getValues = asyncHandler(async (req, res) => {

      const values = await AttributeValueService.getValues();

      return response.success(res, values);
    });

    getValueById = asyncHandler(async (req, res) => {

      const value = await AttributeValueService.getValueById(req.params.id);

      return response.success(res, value);
    });

    getValuesByAttribute = asyncHandler(async (req, res) => {

      const values = await AttributeValueService.getValuesByAttribute(req.params.attribute_id);

      return response.success(res, values);
    });

    createValue = asyncHandler(async (req, res) => {

      const value = await AttributeValueService.createValue(req.body);

      return response.success(res, value, "Attribute value created");
    });

    updateValue = asyncHandler(async (req, res) => {

      const value = await AttributeValueService.updateValue(req.params.id, req.body);

      return response.success(res, value, "Attribute value updated");
    });

    deleteValue = asyncHandler(async (req, res) => {

      await AttributeValueService.deleteValue(req.params.id);

      return response.success(res, null, "Attribute value deleted");
    });
  }

  export default new AttributeValueController();
