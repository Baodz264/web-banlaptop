import ProductBundleItemRepository from "./bundleItem.repository.js";

class ProductBundleItemService {

  static async getItems() {
    return await ProductBundleItemRepository.findAll();
  }

  static async getItemsByBundle(bundle_id) {
    return await ProductBundleItemRepository.findByBundle(bundle_id);
  }

  static async createItem(data) {

    const exist = await ProductBundleItemRepository.findOne(
      data.bundle_id,
      data.variant_id
    );

    if (exist) {
      throw new Error("Sản phẩm trong bundle đã tồn tại");
    }

    return await ProductBundleItemRepository.create(data);
  }

  static async deleteItem(bundle_id, variant_id) {

    const exist = await ProductBundleItemRepository.findOne(bundle_id, variant_id);

    if (!exist) {
      throw new Error("Không tìm thấy sản phẩm trong bundle");
    }

    await ProductBundleItemRepository.delete(bundle_id, variant_id);

    return true;
  }
}

export default ProductBundleItemService;
