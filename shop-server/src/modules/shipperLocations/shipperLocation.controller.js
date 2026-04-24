import ShipperLocationService from "./shipperLocation.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ShipperLocationController {

  updateLocation = asyncHandler(async (req, res) => {

    const data = {
      ...req.body,
      shipper_id: req.user.id
    };

    const location = await ShipperLocationService.updateLocation(data);

    return response.success(res, location, "Cập nhật vị trí thành công");

  });

  getShipmentLocation = asyncHandler(async (req, res) => {

    const location = await ShipperLocationService.getShipmentLocation(req.params.shipment_id);

    return response.success(res, location);

  });

}

export default new ShipperLocationController();
