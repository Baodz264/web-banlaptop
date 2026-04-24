import UserAddressService from "./address.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class UserAddressController {

  // Admin xem tất cả địa chỉ
  getAllAddresses = asyncHandler(async (req, res) => {

    const addresses = await UserAddressService.getAllAddresses();

    return response.success(res, addresses);
  });

  // User xem địa chỉ của mình
  getAddresses = asyncHandler(async (req, res) => {

    const addresses = await UserAddressService.getUserAddresses(req.user.id);

    return response.success(res, addresses);
  });

  getAddressById = asyncHandler(async (req, res) => {

    const address = await UserAddressService.getAddressById(req.params.id);

    return response.success(res, address);
  });

  createAddress = asyncHandler(async (req, res) => {

    const address = await UserAddressService.createAddress(
      req.user.id,
      req.body
    );

    return response.success(res, address, "Address created");
  });

  updateAddress = asyncHandler(async (req, res) => {

    const address = await UserAddressService.updateAddress(
      req.params.id,
      req.user.id,
      req.body
    );

    return response.success(res, address, "Address updated");
  });

  deleteAddress = asyncHandler(async (req, res) => {

    await UserAddressService.deleteAddress(req.params.id);

    return response.success(res, null, "Address deleted");
  });
}

export default new UserAddressController();
