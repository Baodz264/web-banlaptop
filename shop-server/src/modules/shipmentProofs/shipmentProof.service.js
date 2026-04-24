import ShipmentProofRepository from "./shipmentProof.repository.js";

class ShipmentProofService {

  static async getShipmentProofs(query) {
    return await ShipmentProofRepository.findAll(query);
  }

  static async getShipmentProofById(id) {
    const proof = await ShipmentProofRepository.findById(id);

    if (!proof) {
      throw new Error("Không tìm thấy bằng chứng giao hàng");
    }

    return proof;
  }

  // ✅ VALIDATE
  static validate(data) {

    if (!data.shipment_id) {
      throw new Error("Thiếu shipment_id");
    }

    if (data.type) {
      const validTypes = ["pickup", "delivery"];
      if (!validTypes.includes(data.type)) {
        throw new Error("Loại bằng chứng không hợp lệ");
      }
    }
  }

  // ✅ CREATE
  static async createShipmentProof(data) {

    this.validate(data);

    data.type = data.type ?? "delivery";

    return await ShipmentProofRepository.create(data);
  }

  // ✅ UPDATE
  static async updateShipmentProof(id, data) {

    const proof = await ShipmentProofRepository.findById(id);

    if (!proof) {
      throw new Error("Không tìm thấy bằng chứng giao hàng");
    }

    const merged = {
      ...proof.toJSON(),
      ...data,
    };

    this.validate(merged);

    return await ShipmentProofRepository.update(id, data);
  }

  // ✅ DELETE
  static async deleteShipmentProof(id) {

    const proof = await ShipmentProofRepository.findById(id);

    if (!proof) {
      throw new Error("Không tìm thấy bằng chứng giao hàng");
    }

    return await ShipmentProofRepository.delete(id);
  }
}

export default ShipmentProofService;
