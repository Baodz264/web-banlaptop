import AttributeService from "./attribute.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class AttributeController {

  getAttributes = asyncHandler(async (req, res) => {

    const attributes = await AttributeService.getAttributes();

    return response.success(res, attributes);
  });

  getAttributeById = asyncHandler(async (req, res) => {

    const attribute = await AttributeService.getAttributeById(req.params.id);

    return response.success(res, attribute);
  });

  createAttribute = asyncHandler(async (req, res) => {

    const attribute = await AttributeService.createAttribute(req.body);

    return response.success(res, attribute, "Attribute created");
  });

  updateAttribute = asyncHandler(async (req, res) => {

    const attribute = await AttributeService.updateAttribute(
      req.params.id,
      req.body
    );

    return response.success(res, attribute, "Attribute updated");
  });

  deleteAttribute = asyncHandler(async (req, res) => {

    await AttributeService.deleteAttribute(req.params.id);

    return response.success(res, null, "Attribute deleted");
  });
}

export default new AttributeController();
