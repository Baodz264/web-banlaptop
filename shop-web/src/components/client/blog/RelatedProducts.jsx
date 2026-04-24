import { useEffect, useState, useCallback } from "react";
import { Card, Row, Col, Typography, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import postService from "../../../services/post.service";

const { Title, Text } = Typography;

// 🔥 DÙNG GIỐNG PostHeader
const BASE_URL = "http://tbtshoplt.xyz";

const RelatedPosts = ({ topicId, currentPostId }) => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return "https://via.placeholder.com/300x160";
    if (thumbnail.startsWith("http")) return thumbnail;
    return `${BASE_URL}${thumbnail}`;
  };

  // Sử dụng useCallback để memoize hàm fetch, tránh cảnh báo dependency
  const fetchRelatedPosts = useCallback(async () => {
    if (!topicId) return;

    try {
      setLoading(true);
      const res = await postService.getPosts();

      let list =
        res?.data?.data?.posts ||
        res?.data?.data?.items ||
        res?.data?.data?.rows ||
        res?.data?.data ||
        res?.data ||
        [];

      if (!Array.isArray(list)) list = [];

      // Filter logic
      const filtered = list.filter(
        (item) =>
          Number(item.topic_id) === Number(topicId) &&
          Number(item.id) !== Number(currentPostId)
      );

      setPosts(filtered.slice(0, 4));
    } catch (error) {
      console.error("Related posts error:", error);
    } finally {
      setLoading(false);
    }
  }, [topicId, currentPostId]); // Hàm này sẽ thay đổi khi 1 trong 2 id thay đổi

  useEffect(() => {
    fetchRelatedPosts();
  }, [fetchRelatedPosts]); // Giờ đây fetchRelatedPosts là một dependency hợp lệ

  if (!topicId) return null;

  return (
    <div style={{ marginTop: 40 }}>
      <Title level={4}>Bài viết liên quan</Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : posts.length === 0 ? (
        <Empty description="Không có bài viết liên quan" />
      ) : (
        <Row gutter={[16, 16]}>
          {posts.map((item) => (
            <Col xs={24} sm={12} key={item.id}>
              <Card
                hoverable
                onClick={() => navigate(`/post/${item.slug}`)}
                cover={
                  <img
                    src={getImageUrl(item.thumbnail)}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x160";
                    }}
                    style={{
                      height: 160,
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Card.Meta
                  title={
                    <div style={{ height: 40, overflow: "hidden", textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.title}
                    </div>
                  }
                  description={
                    <Text type="secondary">
                      {item.created_at
                        ? dayjs(item.created_at).format("DD/MM/YYYY")
                        : ""}
                    </Text>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default RelatedPosts;