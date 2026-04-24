import { useState } from "react";
import { Avatar, Rate, Row, Col, Image, Typography, Button, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;
const API_URL = "http://tbtshoplt.xyz";

const ProductReviewList = ({ reviews = [], reviewImages = {}, loading }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar;
    return `${API_URL}${avatar}`;
  };

  // Lấy danh sách review theo số lượng hiển thị
  const displayedReviews = reviews.slice(0, visibleCount);

  return (
    <div style={{ maxHeight: 500, overflowY: "auto", paddingRight: 8 }}>
      {displayedReviews.map((reviewItem, index) => {
        const user = reviewItem.user || {};
        const imgs = reviewImages[reviewItem.id] || [];
        const avatarUrl = getAvatarUrl(user.avatar);

        return (
          <div key={reviewItem.id || index}>
            <Row gutter={16} wrap style={{ padding: "16px 0" }}>
              {/* Cột Avatar */}
              <Col flex="80px">
                <Avatar
                  size={64}
                  src={avatarUrl || undefined}
                  icon={!avatarUrl ? <UserOutlined /> : null}
                >
                  {!avatarUrl && user.name && user.name.charAt(0).toUpperCase()}
                </Avatar>
              </Col>

              {/* Cột Nội dung */}
              <Col flex="1 1 300px">
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Text strong>{user.name || "Người dùng"}</Text>
                  
                  <div style={{ margin: "4px 0" }}>
                    <Rate disabled value={reviewItem.rating} style={{ fontSize: 14 }} />
                  </div>

                  <Text
                    style={{
                      whiteSpace: "pre-wrap",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {reviewItem.comment || ""}
                  </Text>

                  {/* Ảnh review */}
                  {imgs.length > 0 && (
                    <Row gutter={[8, 8]} wrap>
                      {imgs.map((img) => {
                        if (!img?.image) return null;

                        const src = img.image.startsWith("http")
                          ? img.image
                          : `${API_URL}${img.image}`;

                        return (
                          <Col key={img.id}>
                            <Image
                              width={100}
                              height={100}
                              src={src}
                              style={{
                                borderRadius: 8,
                                objectFit: "cover",
                                border: "1px solid #f0f0f0",
                              }}
                              fallback="https://via.placeholder.com/100?text=Error"
                            />
                          </Col>
                        );
                      })}
                    </Row>
                  )}
                </div>
              </Col>
            </Row>
            {index < displayedReviews.length - 1 && <Divider style={{ margin: 0 }} />}
          </div>
        );
      })}

      {/* Hiển thị khi không có dữ liệu */}
      {!loading && reviews.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text type="secondary">Chưa có đánh giá nào.</Text>
        </div>
      )}

      {/* Nút xem thêm */}
      {visibleCount < reviews.length && (
        <div style={{ textAlign: "center", marginTop: 16, marginBottom: 16 }}>
          <Button 
            type="dashed"
            onClick={() => setVisibleCount(prev => prev + 5)}
            loading={loading}
          >
            Xem thêm đánh giá ({reviews.length - visibleCount})
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductReviewList;