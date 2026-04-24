import React from "react";
import { Typography, Image, Tag, Space, Divider } from "antd";
import { CalendarOutlined, ClockCircleOutlined, PictureOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

// Nên chuyển BASE_URL vào file config hoặc .env
const BASE_URL = "http://tbtshoplt.xyz";

// Dịch vụ thay thế ổn định hơn via.placeholder để tránh lỗi ERR_CONNECTION_CLOSED
const FALLBACK_IMAGE = "https://placehold.jp/24/cccccc/ffffff/800x400.png?text=Hinh+anh+khong+ton+tai";

const PostHeader = ({ post }) => {
  if (!post) return null;

  // Xử lý URL ảnh thông minh hơn
  const getImageUrl = () => {
    if (!post?.thumbnail) return "";
    let thumb = post.thumbnail.trim();
    if (thumb.startsWith("http")) return thumb;
    
    // Đảm bảo có dấu / giữa BASE_URL và path
    const path = thumb.startsWith("/") ? thumb : `/${thumb}`;
    return `${BASE_URL}${path}`;
  };

  return (
    <div
      style={{
        marginBottom: 40,
        background: "#ffffff",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* 1. CATEGORY / TAG */}
      {post.category && (
        <Tag color="blue" style={{ marginBottom: 12, borderRadius: 4 }}>
          {post.category}
        </Tag>
      )}

      {/* 2. TITLE */}
      <Title 
        level={1} 
        style={{ 
          fontSize: "clamp(24px, 5vw, 36px)",
          fontWeight: 700,
          marginBottom: 16,
          lineHeight: 1.3,
          color: "#1a1a1a"
        }}
      >
        {post.title}
      </Title>

      {/* 3. METADATA */}
      {/* Sửa 'split' thành 'separator' để hết Warning */}
      <Space 
        separator={<Divider vertical />} 
        style={{ marginBottom: 24, flexWrap: "wrap" }}
      >
        <Space size={4}>
          <CalendarOutlined style={{ color: "#8c8c8c" }} />
          <Text type="secondary">
            {post.created_at ? dayjs(post.created_at).format("DD [tháng] MM, YYYY") : "N/A"}
          </Text>
        </Space>
        
        <Space size={4}>
          <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
          <Text type="secondary">5 phút đọc</Text>
        </Space>
      </Space>

      {/* 4. HERO IMAGE */}
      <div 
        style={{ 
          position: "relative",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#f5f5f5"
        }}
      >
        <Image
          src={getImageUrl()}
          alt={post.title}
          preview={true}
          fallback={FALLBACK_IMAGE}
          placeholder={
            <div style={{ 
              height: 400, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              background: "#f0f2f5" 
            }}>
              <PictureOutlined style={{ fontSize: 32, color: "#bfbfbf" }} />
            </div>
          }
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "500px",
            objectFit: "cover",
            display: "block",
          }}
          styles={{
            root: { width: '100%' }
          }}
        />
      </div>

      {/* 5. DESCRIPTION/EXCERPT */}
      {post.excerpt && (
        <div style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 18, color: "#595959", fontStyle: "italic" }}>
            {post.excerpt}
          </Text>
        </div>
      )}
    </div>
  );
};

export default PostHeader;