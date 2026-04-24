import { Review, Order, OrderItem, Variant } from "../../database/mysql/index.js"; 
import ReviewRepository from "./review.repository.js";
import { Op } from "sequelize";

class ReviewService {

  static async getReviews(query) {
    return await ReviewRepository.findAll(query);
  }

  static async getReviewById(id) {
    const review = await ReviewRepository.findById(id);
    if (!review) throw new Error("Không tìm thấy đánh giá");
    return review;
  }

  /**
   * Tạo đánh giá mới
   * Logic: Kiểm tra Rating -> Check User đã mua sản phẩm (Variant) thành công chưa -> Check trùng lặp
   */
  static async createReview(data) {
    const { user_id, product_id, rating, parent_id } = data;

    // 1. Nếu là phản hồi (reply) -> Cho phép tạo luôn (Dành cho Admin/Shop)
    if (parent_id) {
      return await ReviewRepository.create(data);
    }

    // 2. Kiểm tra rating hợp lệ
    if (rating < 1 || rating > 5) {
      throw new Error("Đánh giá phải từ 1 đến 5 sao");
    }

    // 3. KIỂM TRA ĐIỀU KIỆN MUA HÀNG
    // Bước A: Tìm tất cả variant_id thuộc về product_id này
    const productVariants = await Variant.findAll({
      where: { product_id },
      attributes: ["id"],
      raw: true
    });

    if (!productVariants || productVariants.length === 0) {
      throw new Error("Sản phẩm không tồn tại hoặc chưa có biến thể nào.");
    }

    const variantIds = productVariants.map(v => v.id);

    // Bước B: Kiểm tra xem user có đơn hàng 'delivered' chứa ít nhất 1 trong các variantIds này không
    const purchasedOrder = await Order.findOne({
      where: {
        user_id: user_id,
        status: "delivered", 
      },
      include: [
        {
          model: OrderItem,
          where: {
            variant_id: { [Op.in]: variantIds }
          },
          required: true, // Bắt buộc phải tìm thấy OrderItem thỏa mãn điều kiện where
        },
      ],
    });

    if (!purchasedOrder) {
      throw new Error("Bạn chỉ có thể đánh giá sản phẩm này sau khi đơn hàng được giao thành công.");
    }

    // 4. KIỂM TRA ĐÁNH GIÁ TRÙNG LẶP (Mỗi người dùng chỉ được đánh giá gốc 1 lần/sản phẩm)
    const existingReview = await ReviewRepository.findOne({
      user_id,
      product_id,
      parent_id: null,
    });

    if (existingReview) {
      throw new Error("Bạn đã thực hiện đánh giá cho sản phẩm này rồi.");
    }

    // 5. Tiến hành lưu đánh giá
    return await ReviewRepository.create(data);
  }

  /**
   * Cập nhật đánh giá
   */
  static async updateReview(id, data) {
    const review = await ReviewRepository.findById(id);
    if (!review) throw new Error("Không tìm thấy đánh giá");
    
    // Bảo mật: Không cho phép đổi user_id hoặc product_id khi cập nhật
    delete data.user_id;
    delete data.product_id;

    return await ReviewRepository.update(id, data);
  }

  /**
   * Xóa đánh giá
   */
  static async deleteReview(id) {
    const review = await ReviewRepository.findById(id);
    if (!review) throw new Error("Không tìm thấy đánh giá");
    return await ReviewRepository.delete(id);
  }

  /**
   * Thống kê rating theo product
   */
  static async getRatingSummary(product_id) {
    return await ReviewRepository.getRatingSummary(product_id);
  }
}

export default ReviewService;