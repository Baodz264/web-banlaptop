import ReviewImageRepository from "./reviewImage.repository.js";

class ReviewImageService {

  static async getImagesByReview(review_id) {
    return await ReviewImageRepository.findByReviewId(review_id);
  }

  static async createImage(data) {
    return await ReviewImageRepository.create(data);
  }

  static async deleteImage(id) {

    const image = await ReviewImageRepository.findById(id);

    if (!image) {
      throw new Error("Không tìm thấy hình ảnh");
    }

    return await ReviewImageRepository.delete(id);
  }
}

export default ReviewImageService;
