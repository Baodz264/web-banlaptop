import ProductBundleService from "./bundle.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ProductBundleController {

  getBundles = asyncHandler(async (req, res) => {

    const bundles = await ProductBundleService.getBundles(req.query);

    return response.success(res, bundles);
  });

  getBundleById = asyncHandler(async (req, res) => {

    const bundle = await ProductBundleService.getBundleById(req.params.id);

    return response.success(res, bundle);
  });

  createBundle = asyncHandler(async (req, res) => {

    const bundle = await ProductBundleService.createBundle(req.body);

    return response.success(res, bundle, "Bundle created");
  });

  updateBundle = asyncHandler(async (req, res) => {

    const bundle = await ProductBundleService.updateBundle(
      req.params.id,
      req.body
    );

    return response.success(res, bundle, "Bundle updated");
  });

  deleteBundle = asyncHandler(async (req, res) => {

    await ProductBundleService.deleteBundle(req.params.id);

    return response.success(res, null, "Bundle deleted");
  });
}

export default new ProductBundleController();
