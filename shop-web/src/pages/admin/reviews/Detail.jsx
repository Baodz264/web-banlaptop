import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import {
  Card,
  Descriptions,
  Skeleton,
  message,
  Avatar,
  Rate,
  Space,
  Image,
  Empty
} from "antd";

import ReviewService from "../../../services/review.service";
import productService from "../../../services/product.service";
import userService from "../../../services/user.service";
import ReviewImageService from "../../../services/reviewImage.service";

const API_URL = "tbtshoplt.xyz";

const Detail = () => {
  const { id } = useParams();

  const [review, setReview] = useState(null);
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy URL ảnh đầy đủ - Giữ bên ngoài vì nó là hàm helper thuần túy
  const getImageUrl = (image, folder) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    if (image.startsWith("/")) return `${API_URL}${image}`;
    return `${API_URL}/uploads/${folder}/${image}`;
  };

  // Sử dụng useCallback để memoize hàm fetchData, tránh lỗi dependency
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Lấy review theo ID
      const res = await ReviewService.getReviewById(id);
      const reviewData = res?.data?.data || res?.data || null;

      if (!reviewData) {
        message.warning("Không tìm thấy review");
        setReview(null);
        return;
      }

      setReview(reviewData);

      // Fetch product, user, images song song
      const [productRes, userRes, imagesRes] = await Promise.all([
        reviewData.product_id
          ? productService.getProductById(reviewData.product_id).catch(() => null)
          : Promise.resolve(null),
        reviewData.user_id
          ? userService.getUserById(reviewData.user_id).catch(() => null)
          : Promise.resolve(null),
        ReviewImageService.getImagesByReview(id).catch(() => ({ data: { data: [] } }))
      ]);

      setProduct(productRes?.data?.data || null);
      setUser(userRes?.data?.data || null);
      setImages(imagesRes?.data?.data || []);
    } catch (error) {
      console.error(error);
      message.error("Không tải được review");
    } finally {
      setLoading(false);
    }
  }, [id]); // fetchData chỉ thay đổi khi id thay đổi

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Bây giờ fetchData đã an toàn để đưa vào dependency

  // Loading skeleton
  if (loading) return <Skeleton active />;

  // Nếu review không tồn tại
  if (!review)
    return (
      <Card title="Chi tiết Review">
        <Empty description="Review không tồn tại" />
      </Card>
    );

  return (
    <Card title="Chi tiết Review">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{review.id}</Descriptions.Item>

        <Descriptions.Item label="Sản phẩm">
          <Space>
            <Avatar
              shape="square"
              size={60}
              src={getImageUrl(product?.thumbnail, "products")}
            />
            {product?.name || "N/A"}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Người dùng">
          <Space>
            <Avatar src={getImageUrl(user?.avatar, "users")} />
            {user?.name || "N/A"}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Đánh giá">
          <Rate disabled value={review.rating || 0} />
        </Descriptions.Item>

        <Descriptions.Item label="Bình luận">{review.comment || "-"}</Descriptions.Item>

        <Descriptions.Item label="Ảnh review">
          <Space wrap>
            {images.length > 0
              ? images.map((img) => (
                  <Image
                    key={img.id}
                    width={120}
                    src={getImageUrl(img.image, "reviews")}
                  />
                ))
              : "Không có ảnh"}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Parent ID">{review.parent_id || "Không có"}</Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {review.created_at ? new Date(review.created_at).toLocaleString() : "-"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default Detail;