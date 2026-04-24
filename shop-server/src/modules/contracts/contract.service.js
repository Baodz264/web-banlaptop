import ContractRepository from "./contract.repository.js";
import generateCode from "../../utils/generateCode.js";

class ContractService {

  static async getContracts(query) {
    return await ContractRepository.findAll(query);
  }

  static async getContractById(id) {

    const contract = await ContractRepository.findById(id);

    if (!contract) {
      throw new Error("Không tìm thấy hợp đồng");
    }

    return contract;
  }

  static async createContract(data) {

    // generate contract_code tự động
    let contract_code;
    let exist;

    do {
      contract_code = generateCode("CON");
      exist = await ContractRepository.findByCode(contract_code);
    } while (exist);

    data.contract_code = contract_code;

    return await ContractRepository.create(data);
  }

  static async updateContract(id, data) {

    const contract = await ContractRepository.findById(id);

    if (!contract) {
      throw new Error("Không tìm thấy hợp đồng");
    }

    return await ContractRepository.update(id, data);
  }

  static async deleteContract(id) {

    const contract = await ContractRepository.findById(id);

    if (!contract) {
      throw new Error("Không tìm thấy hợp đồng");
    }

    await ContractRepository.delete(id);

    return true;
  }
}

export default ContractService;
