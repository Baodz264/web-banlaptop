import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import {
  Table,
  Button,
  Space,
  Typography,
  Popconfirm,
  Input,
  Card,
  Image,
  Tag
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileAddOutlined,
  SearchOutlined
} from "@ant-design/icons";

import postService from "../../../services/post.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;

const List = () => {
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const [searchText, setSearchText] = useState("");

  const fetchPosts = useCallback(async (params = {}) => {
    setLoading(true);

    const page = params.page || 1;
    const limit = params.limit || pagination.pageSize;
    const search =
      params.search !== undefined ? params.search : searchText;

    try {
      const res = await postService.getPosts({
        page,
        limit,
        search
      });

      const { items, totalItems, currentPage } = res.data.data;

      setPosts(items || []);

      setPagination(prev => ({
        ...prev,
        total: totalItems,
        current: currentPage,
        pageSize: limit
      }));
    } catch (error) {
      console.error(error);
      toast.error("Không tải được bài viết");
    } finally {
      setLoading(false);
    }
  }, [searchText, toast, pagination.pageSize]);

  useEffect(() => {
    fetchPosts({ page: 1, search: searchText });
  }, [fetchPosts, searchText]);

  const handleDelete = async (id) => {
    try {
      await postService.deletePost(id);
      toast.success("Xóa bài viết thành công");

      fetchPosts({
        page: pagination.current,
        limit: pagination.pageSize
      });
    } catch {
      toast.error("Xóa bài viết thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      width: 70,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (thumbnail) =>
        thumbnail ? (
          <Image width={60} src={`http://tbtshoplt.xyz${thumbnail}`} />
        ) : (
          "N/A"
        )
    },
    {
      title: "Tiêu đề",
      dataIndex: "title"
    },
    {
      title: "Topic",
      render: (_, record) =>
        record.Topic ? (
          <Tag color="blue">{record.Topic.name}</Tag>
        ) : (
          <Tag>None</Tag>
        )
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "N/A"
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/posts/detail/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/admin/posts/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xóa bài viết?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between mb-5">
          <Title level={2}>Quản lý Posts</Title>
          <Link to="/admin/posts/add">
            <Button type="primary" icon={<FileAddOutlined />}>
              Thêm Post
            </Button>
          </Link>
        </div>

        <Input
          placeholder="Tìm bài viết..."
          prefix={<SearchOutlined />}
          className="mb-4 max-w-md"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Table
          columns={columns}
          dataSource={posts}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, pageSize) =>
              fetchPosts({ page, limit: pageSize })
          }}
        />
      </Card>
    </div>
  );
};

export default List;
