import VariantService from "./variant.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class VariantController {

  // ✅ GET ALL + FILTER
  getAllVariants = asyncHandler(async (req, res) => {
    const variants = await VariantService.getAllVariants(req.query);
    return response.success(res, variants);
  });

  // ✅ GET BY PRODUCT
  getVariantsByProduct = asyncHandler(async (req, res) => {
    const variants = await VariantService.getVariantsByProduct(
      req.params.product_id
    );
    return response.success(res, variants);
  });

  // ✅ GET DETAIL
  getVariantById = asyncHandler(async (req, res) => {
    const variant = await VariantService.getVariantById(req.params.id);
    return response.success(res, variant);
  });

  // ✅ CREATE
  createVariant = asyncHandler(async (req, res) => {
    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/variants/${req.file.filename}`;
    }

    const variant = await VariantService.createVariant(data);

    return response.success(res, variant, "Variant created");
  });

  // ✅ UPDATE
  updateVariant = asyncHandler(async (req, res) => {
    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/variants/${req.file.filename}`;
    }

    const variant = await VariantService.updateVariant(
      req.params.id,
      data
    );

    return response.success(res, variant, "Variant updated");
  });

  // ✅ DELETE
  deleteVariant = asyncHandler(async (req, res) => {
    await VariantService.deleteVariant(req.params.id);
    return response.success(res, null, "Variant deleted");
  });
}

export default new VariantController();
