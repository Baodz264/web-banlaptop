import MenuService from "./menu.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class MenuController {

  getMenus = asyncHandler(async (req, res) => {

    const menus = await MenuService.getMenus(req.query);

    return response.success(res, menus);
  });

  getMenuById = asyncHandler(async (req, res) => {

    const menu = await MenuService.getMenuById(req.params.id);

    return response.success(res, menu);
  });

  createMenu = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    const menu = await MenuService.createMenu(data);

    return response.success(res, menu, "Menu created");
  });

  updateMenu = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    const menu = await MenuService.updateMenu(req.params.id, data);

    return response.success(res, menu, "Menu updated");
  });

  deleteMenu = asyncHandler(async (req, res) => {

    await MenuService.deleteMenu(req.params.id);

    return response.success(res, null, "Menu deleted");
  });
}

export default new MenuController();
