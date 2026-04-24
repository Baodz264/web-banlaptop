import SupplierService from "./supplier.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class SupplierController {

  getSuppliers = asyncHandler(async (req, res) => {

    const suppliers = await SupplierService.getSuppliers(req.query);

    return response.success(res, suppliers);
  });

  getSupplierById = asyncHandler(async (req, res) => {

    const supplier = await SupplierService.getSupplierById(req.params.id);

    return response.success(res, supplier);
  });

  createSupplier = asyncHandler(async (req, res) => {

    const supplier = await SupplierService.createSupplier(req.body);

    return response.success(res, supplier, "Supplier created");
  });

  updateSupplier = asyncHandler(async (req, res) => {

    const supplier = await SupplierService.updateSupplier(
      req.params.id,
      req.body
    );

    return response.success(res, supplier, "Supplier updated");
  });

  deleteSupplier = asyncHandler(async (req, res) => {

    await SupplierService.deleteSupplier(req.params.id);

    return response.success(res, null, "Supplier deleted");
  });
}

export default new SupplierController();
