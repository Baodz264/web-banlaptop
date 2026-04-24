import React from "react";
import { Image, Row, Col, Typography } from "antd";

const { Title } = Typography;

// Nên để API_URL ở file cấu hình riêng, nhưng tạm thời giữ đây theo code của bạn
const API_URL = "http://tbtshoplt.xyz";

// Link ảnh thay thế khi ảnh chính bị lỗi (Dùng domain khác ổn định hơn via.placeholder)
const FALLBACK_IMAGE = "https://placehold.jp/24/cccccc/ffffff/400x300.png?text=Hinh+anh+bi+loi";

const PostGallery = ({ images = [] }) => {
  // ✅ Nếu không có ảnh, không hiển thị bất cứ thứ gì
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  // ✅ Xử lý URL thông minh
  const getImageUrl = (img) => {
    if (!img || !img.image) return "";
    let path = String(img.image).trim();
    
    // Nếu là link tuyệt đối (http...) thì giữ nguyên
    if (path.startsWith("http")) return path;
    
    // Đảm bảo path bắt đầu bằng /
    if (!path.startsWith("/")) path = `/${path}`;
    
    return `${API_URL}${path}`;
  };

  return (
    <div className="post-gallery-container" style={{ marginBottom: 32 }}>
      {/* Tiêu đề gọn gàng */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ 
          width: 4, 
          height: 20, 
          backgroundColor: '#1890ff', 
          marginRight: 10, 
          borderRadius: 2 
        }} />
        <Title level={4} style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
          Bộ sưu tập ảnh ({images.length})
        </Title>
      </div>

      <Image.PreviewGroup>
        <Row gutter={[12, 12]}>
          {images.map((img, index) => {
            const url = getImageUrl(img);

            return (
              <Col xs={12} sm={8} md={6} key={img.id ?? index}>
                <div className="image-wrapper">
                  <Image
                    src={url}
                    alt={`post-img-${index}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    // Hiệu ứng xem trước
                    preview={{
                      mask: <div style={{ fontSize: 14 }}>Xem ảnh</div>,
                    }}
                    // ✅ Đã sửa: Thay thế fallback bằng link ổn định hơn
                    fallback={FALLBACK_IMAGE}
                  />
                </div>
              </Col>
            );
          })}
        </Row>
      </Image.PreviewGroup>

      {/* Style CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .image-wrapper {
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: #f0f2f5;
        }
        .image-wrapper:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        .ant-image-mask {
          border-radius: 12px !important;
        }
      `}} />
    </div>
  );
};

export default PostGallery;