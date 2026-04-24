import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Tag } from "antd";
import { Link } from "react-router-dom";

import postService from "../../../services/post.service";

const { Title } = Typography;

function Post() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await postService.getPosts({
        page: 1,
        limit: 6,
        status: 1,
      });

      const items = res?.data?.data?.items || [];
      setPosts(items);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section style={{ padding: "20px 0" }}>
      <div className="container">
        {/* TIÊU ĐỀ */}
        <Title
          level={5}
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Bài viết mới
        </Title>

        <Row gutter={[12, 12]}>
          {posts?.map((post) => (
            <Col xs={24} sm={12} md={8} key={post.id}>
              <Card
                hoverable
                size="small"
                // THAY ĐỔI TẠI ĐÂY: bodyStyle -> styles={{ body: ... }}
                styles={{
                  body: { padding: 10 },
                }}
                cover={
                  <img
                    alt={post.title}
                    src={`http://tbtshoplt.xyz${post.thumbnail}`}
                    style={{
                      height: 140,
                      objectFit: "cover",
                    }}
                  />
                }
              >
                {post.Topic && (
                  <Tag color="blue" style={{ fontSize: 11 }}>
                    {post.Topic.name}
                  </Tag>
                )}

                <Title level={5} style={{ margin: "6px 0", fontSize: 14 }}>
                  {post.title}
                </Title>

                <p style={{ color: "#888", fontSize: 12, marginBottom: 6 }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </p>

                <Link style={{ fontSize: 12 }} to={`/post/${post.slug}`}>
                  Xem chi tiết
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}

export default Post;
