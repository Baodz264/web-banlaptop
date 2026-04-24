import BannerService from "./banner.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class BannerController {

  getBanners = asyncHandler(async (req, res) => {

    const banners = await BannerService.getBanners(req.query);

    return response.success(res, banners);
  });

  getBannerById = asyncHandler(async (req, res) => {

    const banner = await BannerService.getBannerById(req.params.id);

    return response.success(res, banner);
  });

  createBanner = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/banners/${req.file.filename}`;
    }

    const banner = await BannerService.createBanner(data);

    return response.success(res, banner, "Banner created");
  });

  updateBanner = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/banners/${req.file.filename}`;
    }

    const banner = await BannerService.updateBanner(req.params.id, data);

    return response.success(res, banner, "Banner updated");
  });

  deleteBanner = asyncHandler(async (req, res) => {

    await BannerService.deleteBanner(req.params.id);

    return response.success(res, null, "Banner deleted");
  });
}

export default new BannerController();
