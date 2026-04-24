import ContractService from "./contract.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ContractController {

  getContracts = asyncHandler(async (req, res) => {

    const contracts = await ContractService.getContracts(req.query);

    return response.success(res, contracts);
  });

  getContractById = asyncHandler(async (req, res) => {

    const contract = await ContractService.getContractById(req.params.id);

    return response.success(res, contract);
  });

  createContract = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.file = `/uploads/contracts/${req.file.filename}`;
    }

    const contract = await ContractService.createContract(data);

    return response.success(res, contract, "Contract created");
  });

  updateContract = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.file = `/uploads/contracts/${req.file.filename}`;
    }

    const contract = await ContractService.updateContract(req.params.id, data);

    return response.success(res, contract, "Contract updated");
  });

  deleteContract = asyncHandler(async (req, res) => {

    await ContractService.deleteContract(req.params.id);

    return response.success(res, null, "Contract deleted");
  });
}

export default new ContractController();
