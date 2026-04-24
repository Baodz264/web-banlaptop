import OrderVoucherService from "./orderVoucher.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class OrderVoucherController {

  getOrderVouchers = asyncHandler(async (req, res) => {

    const vouchers = await OrderVoucherService.getOrderVouchers();

    return response.success(res, vouchers);
  });

  getOrderVoucherById = asyncHandler(async (req, res) => {

    const voucher = await OrderVoucherService.getOrderVoucherById(req.params.id);

    return response.success(res, voucher);
  });

  createOrderVoucher = asyncHandler(async (req, res) => {

    const voucher = await OrderVoucherService.createOrderVoucher(req.body);

    return response.success(res, voucher, "Order voucher created");
  });

  updateOrderVoucher = asyncHandler(async (req, res) => {

    const voucher = await OrderVoucherService.updateOrderVoucher(
      req.params.id,
      req.body
    );

    return response.success(res, voucher, "Order voucher updated");
  });

  deleteOrderVoucher = asyncHandler(async (req, res) => {

    await OrderVoucherService.deleteOrderVoucher(req.params.id);

    return response.success(res, null, "Order voucher deleted");
  });

}

export default new OrderVoucherController();
