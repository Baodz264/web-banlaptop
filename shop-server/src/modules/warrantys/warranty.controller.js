import WarrantyService from "./warranty.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class WarrantyController {

  getWarranties = asyncHandler(async (req, res) => {

    const warranties = await WarrantyService.getWarranties(req.query);

    return response.success(res, warranties);
  });

  getWarrantyById = asyncHandler(async (req, res) => {

    const warranty = await WarrantyService.getWarrantyById(req.params.id);

    return response.success(res, warranty);
  });

  createWarranty = asyncHandler(async (req, res) => {

    const warranty = await WarrantyService.createWarranty(req.body);

    return response.success(res, warranty, "Warranty created");
  });

  updateWarranty = asyncHandler(async (req, res) => {

    const warranty = await WarrantyService.updateWarranty(
      req.params.id,
      req.body
    );

    return response.success(res, warranty, "Warranty updated");
  });

  deleteWarranty = asyncHandler(async (req, res) => {

    await WarrantyService.deleteWarranty(req.params.id);

    return response.success(res, null, "Warranty deleted");
  });
}

export default new WarrantyController();
