import VoucherApplyService from "./voucherApply.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class VoucherApplyController {

  getVoucherApplies = asyncHandler(async (req, res) => {

    const data = await VoucherApplyService.getVoucherApplies(req.query);

    return response.success(res, data);
  });

  getVoucherApplyById = asyncHandler(async (req, res) => {

    const data = await VoucherApplyService.getVoucherApplyById(req.params.id);

    return response.success(res, data);
  });

  createVoucherApply = asyncHandler(async (req, res) => {

    const data = await VoucherApplyService.createVoucherApply(req.body);

    return response.success(res, data, "Voucher apply created");
  });

  updateVoucherApply = asyncHandler(async (req, res) => {

    const data = await VoucherApplyService.updateVoucherApply(
      req.params.id,
      req.body
    );

    return response.success(res, data, "Voucher apply updated");
  });

  deleteVoucherApply = asyncHandler(async (req, res) => {

    await VoucherApplyService.deleteVoucherApply(req.params.id);

    return response.success(res, null, "Voucher apply deleted");
  });
}

export default new VoucherApplyController();
