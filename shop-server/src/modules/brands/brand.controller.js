import BrandService from "./brand.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class BrandController {

  getBrands = asyncHandler(async (req, res) => {

    const brands = await BrandService.getBrands(req.query);

    return response.success(res, brands);
  });

  getBrandById = asyncHandler(async (req, res) => {

    const brand = await BrandService.getBrandById(req.params.id);

    return response.success(res, brand);
  });

  createBrand = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.logo = `/uploads/brands/${req.file.filename}`;
    }

    const brand = await BrandService.createBrand(data);

    return response.success(res, brand, "Brand created");
  });

  updateBrand = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.logo = `/uploads/brands/${req.file.filename}`;
    }

    const brand = await BrandService.updateBrand(req.params.id, data);

    return response.success(res, brand, "Brand updated");
  });

  deleteBrand = asyncHandler(async (req, res) => {

    await BrandService.deleteBrand(req.params.id);

    return response.success(res, null, "Brand deleted");
  });
}

export default new BrandController();
