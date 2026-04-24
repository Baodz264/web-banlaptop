import ProductService from "./product.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ProductController {

  getProducts = asyncHandler(async (req, res) => {

    const products = await ProductService.getProducts(req.query);

    return response.success(res, products);
  });

  getProductById = asyncHandler(async (req, res) => {

    const product = await ProductService.getProductById(req.params.id);

    return response.success(res, product);
  });

  createProduct = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.thumbnail = `/uploads/products/${req.file.filename}`;
    }

    const product = await ProductService.createProduct(data);

    return response.success(res, product, "Product created");
  });

  updateProduct = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.thumbnail = `/uploads/products/${req.file.filename}`;
    }

    const product = await ProductService.updateProduct(req.params.id, data);

    return response.success(res, product, "Product updated");
  });

  deleteProduct = asyncHandler(async (req, res) => {

    await ProductService.deleteProduct(req.params.id);

    return response.success(res, null, "Product deleted");
  });

  // nhập bằng excel
  createBulkProducts = asyncHandler(async (req, res) => {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("Dữ liệu import không hợp lệ");
    }

    const result = await ProductService.createBulkProducts(products);

    return response.success(res, result, "Import products success");
  });
}

export default new ProductController();
