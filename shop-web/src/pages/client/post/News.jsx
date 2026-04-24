import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Pagination,
  Spin,
  Divider,
  Space,
} from "antd";
import { Link } from "react-router-dom";

import postService from "../../../services/post.service";
import topicService from "../../../services/topic.service";

const { Title, Text, Paragraph } = Typography;

function News() {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // ===== MAIN POSTS =====
  const fetchPosts = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await postService.getPosts({
        page: currentPage,
        limit: 6,
        status: 1,
      });
      const data = res?.data?.data;
      setPosts(data?.items || []);
      setTotal(data?.pagination?.total || 0);
    } catch (error) {
      console.error(error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== TOPICS =====
  const fetchTopics = async () => {
    try {
      const res = await topicService.getTopics({ status: 1 });
      const data = res?.data?.data;
      setTopics(data?.items || data || []);
    } catch (err) {
      console.error(err);
      setTopics([]);
    }
  };

  // ===== FEATURED =====
  const fetchFeaturedPosts = async () => {
    try {
      const res = await postService.getPosts({
        limit: 5,
        page: 1,
        status: 1,
        sort: "created_at",
        order: "DESC",
      });
      const data = res?.data?.data;
      setFeaturedPosts(data?.items || []);
    } catch (err) {
      console.error(err);
      setFeaturedPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    fetchTopics();
    fetchFeaturedPosts();
  }, []);

  return (
    <div style={{ background: "#f5f6fa", padding: "30px 0", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 15px" }}>
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 30,
            fontWeight: 700,
          }}
        >
          📰 Tin tức & Blog
        </Title>

        <Row gutter={[24, 24]}>
          {/* ===== MAIN CONTENT ===== */}
          <Col xs={24} lg={17}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 100 }}>
                {/* ĐÃ SỬA: tip -> description */}
                <Spin size="large" description="Đang tải bài viết..." />
              </div>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {posts.map((post, index) => (
                    <Col xs={24} sm={12} key={post.id}>
                      <Card
                        hoverable
                        style={{
                          borderRadius: 12,
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                          height: "100%",
                        }}
                        cover={
                          <div style={{ position: "relative", overflow: "hidden" }}>
                            <img
                              src={`http://tbtshoplt.xyz${post.thumbnail}`}
                              alt={post.title}
                              style={{
                                height: 200,
                                width: "100%",
                                objectFit: "cover",
                                transition: "transform 0.3s",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            />
                            {index === 0 && page === 1 && (
                              <Tag
                                color="red"
                                style={{
                                  position: "absolute",
                                  top: 10,
                                  left: 10,
                                  fontWeight: 600,
                                  margin: 0,
                                }}
                              >
                                HOT
                              </Tag>
                            )}
                          </div>
                        }
                      >
                        {post.Topic && (
                          <Tag color="blue" style={{ marginBottom: 8 }}>
                            {post.Topic.name}
                          </Tag>
                        )}

                        <Title level={5} ellipsis={{ rows: 2 }} style={{ marginTop: 0 }}>
                          {post.title}
                        </Title>

                        <Text type="secondary" style={{ fontSize: 12 }}>
                          📅 {new Date(post.created_at).toLocaleDateString("vi-VN")}
                        </Text>

                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          type="secondary"
                          style={{ marginTop: 8, height: 44 }}
                        >
                          {post.description || "Đọc bài viết để xem chi tiết..."}
                        </Paragraph>

                        <Divider style={{ margin: "12px 0" }} />

                        <Link
                          to={`/post/${post.slug}`}
                          style={{ fontWeight: 500, color: "#1677ff" }}
                        >
                          Xem chi tiết →
                        </Link>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* PAGINATION */}
                <div style={{ textAlign: "center", marginTop: 40 }}>
                  <Pagination
                    current={page}
                    pageSize={6}
                    total={total}
                    onChange={(p) => setPage(p)}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </Col>

          {/* ===== SIDEBAR ===== */}
          <Col xs={24} lg={7}>
            {/* ĐÃ SỬA: direction="vertical" -> orientation="vertical" */}
            <Space orientation="vertical" size={20} style={{ width: "100%" }}>
              {/* TOPICS */}
              <Card
                title="📌 Danh mục"
                variant="borderless"
                style={{
                  borderRadius: 12,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                {topics.length > 0 ? (
                  topics.map((t) => (
                    <div key={t.id} style={{ marginBottom: 12 }}>
                      <Link 
                        to={`/topic/${t.slug || t.id}`} 
                        style={{ color: "#434343", display: "block" }}
                      >
                        • {t.name}
                      </Link>
                    </div>
                  ))
                ) : (
                  <Text type="secondary">Không có danh mục</Text>
                )}
              </Card>

              {/* FEATURED */}
              <Card
                title="🔥 Bài nổi bật"
                variant="borderless"
                style={{
                  borderRadius: 12,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                {featuredPosts.length > 0 ? (
                  featuredPosts.map((item, idx) => (
                    <div 
                      key={item.id} 
                      style={{ 
                        padding: "10px 0", 
                        borderBottom: idx !== featuredPosts.length - 1 ? "1px solid #f0f0f0" : "none" 
                      }}
                    >
                      <Link to={`/post/${item.slug}`}>
                        <Text strong style={{ color: "#262626" }} ellipsis>
                          {idx + 1}. {item.title}
                        </Text>
                      </Link>
                    </div>
                  ))
                ) : (
                  <Text type="secondary">Đang cập nhật...</Text>
                )}
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default News;