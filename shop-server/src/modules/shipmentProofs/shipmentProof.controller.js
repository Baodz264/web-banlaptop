import ShipmentProofService from "./shipmentProof.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ShipmentProofController {

  getShipmentProofs = asyncHandler(async (req, res) => {
    const proofs = await ShipmentProofService.getShipmentProofs(req.query);
    return response.success(res, proofs);
  });

  getShipmentProofById = asyncHandler(async (req, res) => {
    const proof = await ShipmentProofService.getShipmentProofById(req.params.id);
    return response.success(res, proof);
  });

  createShipmentProof = asyncHandler(async (req, res) => {
    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/shipment-proofs/${req.file.filename}`;
    }

    const proof = await ShipmentProofService.createShipmentProof(data);

    return response.success(res, proof, "Shipment proof created");
  });

  updateShipmentProof = asyncHandler(async (req, res) => {
    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/shipment-proofs/${req.file.filename}`;
    }

    const proof = await ShipmentProofService.updateShipmentProof(
      req.params.id,
      data
    );

    return response.success(res, proof, "Shipment proof updated");
  });

  deleteShipmentProof = asyncHandler(async (req, res) => {
    await ShipmentProofService.deleteShipmentProof(req.params.id);
    return response.success(res, null, "Shipment proof deleted");
  });
}

export default new ShipmentProofController();
