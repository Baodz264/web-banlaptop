import SettingService from "./setting.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class SettingController {

  getSettings = asyncHandler(async (req, res) => {

    const settings = await SettingService.getSettings(req.query);

    return response.success(res, settings);
  });

  getSettingById = asyncHandler(async (req, res) => {

    const setting = await SettingService.getSettingById(req.params.id);

    return response.success(res, setting);
  });

  createSetting = asyncHandler(async (req, res) => {

    const setting = await SettingService.createSetting(req.body);

    return response.success(res, setting, "Setting created");
  });

  updateSetting = asyncHandler(async (req, res) => {

    const setting = await SettingService.updateSetting(
      req.params.id,
      req.body
    );

    return response.success(res, setting, "Setting updated");
  });

  deleteSetting = asyncHandler(async (req, res) => {

    await SettingService.deleteSetting(req.params.id);

    return response.success(res, null, "Setting deleted");
  });
}

export default new SettingController();
