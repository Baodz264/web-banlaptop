  import VoucherService from "./voucher.service.js";
  import asyncHandler from "../../utils/asyncHandler.js";
  import response from "../../utils/response.js";

  class VoucherController {

    getVouchers = asyncHandler(async (req, res) => {

      const vouchers = await VoucherService.getVouchers(req.query);

      return response.success(res, vouchers);
    });

    getVoucherById = asyncHandler(async (req, res) => {

      const voucher = await VoucherService.getVoucherById(req.params.id);

      return response.success(res, voucher);
    });

    createVoucher = asyncHandler(async (req, res) => {

      const voucher = await VoucherService.createVoucher(req.body);

      return response.success(res, voucher, "Voucher created");
    });

    updateVoucher = asyncHandler(async (req, res) => {

      const voucher = await VoucherService.updateVoucher(
        req.params.id,
        req.body
      );

      return response.success(res, voucher, "Voucher updated");
    });

    deleteVoucher = asyncHandler(async (req, res) => {

      await VoucherService.deleteVoucher(req.params.id);

      return response.success(res, null, "Voucher deleted");
    });
  }

  export default new VoucherController();
