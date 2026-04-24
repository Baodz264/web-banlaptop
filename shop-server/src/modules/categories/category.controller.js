import CategoryService from "./category.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class CategoryController {

  getCategories = asyncHandler(async (req, res) => {

    const categories = await CategoryService.getCategories(req.query);

    return response.success(res, categories);
  });

  getCategoryById = asyncHandler(async (req, res) => {

    const category = await CategoryService.getCategoryById(req.params.id);

    return response.success(res, category);
  });

  createCategory = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/categories/${req.file.filename}`;
    }

    const category = await CategoryService.createCategory(data);

    return response.success(res, category, "Category created");
  });

  updateCategory = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/categories/${req.file.filename}`;
    }

    const category = await CategoryService.updateCategory(req.params.id, data);

    return response.success(res, category, "Category updated");
  });

  deleteCategory = asyncHandler(async (req, res) => {

    await CategoryService.deleteCategory(req.params.id);

    return response.success(res, null, "Category deleted");
  });
}

export default new CategoryController();
