import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Card, Tag, Descriptions, Table, Button, Space } from "antd";

import { ArrowLeftOutlined } from "@ant-design/icons";

import topicService from "../../../services/topic.service";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);

  useEffect(() => {
    const fetchTopic = async () => {
      const res = await topicService.getTopicById(id);

      setTopic(res.data.data);
    };

    fetchTopic();
  }, [id]);

  if (!topic) return <Card loading />;

  const columns = [
    {
      title: "Mã bài viết",
      dataIndex: "id",
    },

    {
      title: "Tiêu đề",
      dataIndex: "title",
    },

    {
      title: "Đường dẫn (Slug)",
      dataIndex: "slug",
    },

    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (d) => new Date(d).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Space>

      <Card title="Thông tin chủ đề">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">{topic.id}</Descriptions.Item>

          <Descriptions.Item label="Tên chủ đề">{topic.name}</Descriptions.Item>

          <Descriptions.Item label="Slug">{topic.slug}</Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            {topic.status === 1 ? (
              <Tag color="green">Hoạt động</Tag>
            ) : (
              <Tag color="red">Không hoạt động</Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả" span={2}>
            {topic.description || "Không có mô tả"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Danh sách bài viết" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={topic.Posts || []}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Detail;
