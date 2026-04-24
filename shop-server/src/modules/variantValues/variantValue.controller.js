import VariantValueService from "./variantValue.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class VariantValueController {

  getByVariantId = asyncHandler(async (req, res) => {

    const values = await VariantValueService.getByVariantId(req.params.variant_id);

    return response.success(res, values);
  });

  create = asyncHandler(async (req, res) => {

    const value = await VariantValueService.createVariantValue(req.body);

    return response.success(res, value, "Variant value created");
  });

  deleteByVariantId = asyncHandler(async (req, res) => {

    await VariantValueService.deleteByVariantId(req.params.variant_id);

    return response.success(res, null, "Variant values deleted");
  });

}

export default new VariantValueController();
