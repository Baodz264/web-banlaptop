import React from "react";
import { Card, List, Image, Space, Tag } from "antd";
import { Link } from "react-router-dom";

const API_URL = "http://tbtshoplt.xyz";

function PostSidebar({ latestPosts = [] }) {
  return (
    <>
      <Card title="Bài viết mới" style={{ marginBottom: 20 }}>
        <List
          dataSource={Array.isArray(latestPosts) ? latestPosts : []}
          rowKey={(item) => item.id}
          renderItem={(item) => (
            <List.Item>
              <Space>
                <Image
                  src={`${API_URL}${item.thumbnail}`}
                  width={60}
                  height={60}
                  preview={false}
                  style={{
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />

                <Link to={`/post/${item.slug}`}>
                  {item.title}
                </Link>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      <Card title="Danh mục blog">
        <Space direction="vertical">
          <Tag color="blue">Khuyến mãi</Tag>
          <Tag color="green">Mẹo mua sắm</Tag>
          <Tag color="purple">Công nghệ</Tag>
          <Tag color="orange">Review</Tag>
        </Space>
      </Card>
    </>
  );
}

export default PostSidebar;
