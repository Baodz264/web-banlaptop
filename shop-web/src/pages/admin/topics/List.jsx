import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Popconfirm,
  Input,
  Card,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import topicService from "../../../services/topic.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;

const List = () => {
  const toast = useToast();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchText, setSearchText] = useState("");

  // ================= FETCH DATA =================
  const fetchTopics = useCallback(
    async (page = 1, limit = 10) => {
      setLoading(true);

      try {
        const res = await topicService.getTopics({
          page: page,
          limit: limit,
          search: searchText,
        });

        const data = res.data.data;

        setTopics(data.items || []);

        setPagination({
          current: data.currentPage || page,
          pageSize: limit,
          total: data.totalItems || 0,
        });
      } catch (error) {
        console.error(error);
        toast.error("Không tải được danh sách topic");
      } finally {
        setLoading(false);
      }
    },
    [searchText, toast]
  );

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchTopics(1, pagination.pageSize);
  }, [fetchTopics, pagination.pageSize]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await topicService.deleteTopic(id);
      toast.success("Xóa topic thành công");
      fetchTopics(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error("Xóa topic thất bại");
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "STT",
      width: 80,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) =>
        status === 1 ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Ẩn</Tag>
        ),
    },
    {
      title: "Số bài viết",
      render: (_, record) => record.Posts?.length || 0,
    },
    {
      title: "Thao tác",
      width: 200,
      render: (_, record) => (
        <Space>
          <Link to={`/admin/topics/detail/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>

          <Link to={`/admin/topics/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ================= PAGINATION CHANGE =================
  const handleTableChange = (pagi) => {
    fetchTopics(pagi.current, pagi.pageSize);
  };

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-5">
          <Title level={3}>Quản lý chủ đề</Title>

          <Link to="/admin/topics/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm chủ đề
            </Button>
          </Link>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Tìm kiếm chủ đề..."
          prefix={<SearchOutlined />}
          allowClear
          className="mb-4 max-w-md"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={() => fetchTopics(1, pagination.pageSize)}
        />

        {/* TABLE */}
        <Table
          columns={columns}
          dataSource={topics}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default List;
