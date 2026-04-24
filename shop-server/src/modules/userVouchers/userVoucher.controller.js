import UserVoucherService from "./userVoucher.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class UserVoucherController {

  getUserVouchers = asyncHandler(async (req, res) => {

    const data = await UserVoucherService.getUserVouchers(req.query);

    return response.success(res, data);
  });

  getUserVoucherById = asyncHandler(async (req, res) => {

    const item = await UserVoucherService.getUserVoucherById(req.params.id);

    return response.success(res, item);
  });

  createUserVoucher = asyncHandler(async (req, res) => {

    const item = await UserVoucherService.createUserVoucher(req.body);

    return response.success(res, item, "User voucher created");
  });

  updateUserVoucher = asyncHandler(async (req, res) => {

    const item = await UserVoucherService.updateUserVoucher(
      req.params.id,
      req.body
    );

    return response.success(res, item, "User voucher updated");
  });

  deleteUserVoucher = asyncHandler(async (req, res) => {

    await UserVoucherService.deleteUserVoucher(req.params.id);

    return response.success(res, null, "User voucher deleted");
  });
}

export default new UserVoucherController();
