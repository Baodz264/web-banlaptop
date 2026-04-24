import ProductSpecificationService from "./productSpecification.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ProductSpecificationController {

  getSpecifications = asyncHandler(async (req, res) => {

    const specs = await ProductSpecificationService.getSpecifications(
      req.params.product_id
    );

    return response.success(res, specs);
  });

  getSpecificationById = asyncHandler(async (req, res) => {

    const spec = await ProductSpecificationService.getSpecificationById(
      req.params.id
    );

    return response.success(res, spec);
  });

  createSpecification = asyncHandler(async (req, res) => {

    const spec = await ProductSpecificationService.createSpecification(req.body);

    return response.success(res, spec, "Specification created");
  });

  updateSpecification = asyncHandler(async (req, res) => {

    const spec = await ProductSpecificationService.updateSpecification(
      req.params.id,
      req.body
    );

    return response.success(res, spec, "Specification updated");
  });

  deleteSpecification = asyncHandler(async (req, res) => {

    await ProductSpecificationService.deleteSpecification(req.params.id);

    return response.success(res, null, "Specification deleted");
  });

}

export default new ProductSpecificationController();
