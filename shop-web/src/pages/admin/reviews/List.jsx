import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import {
  Table,
  Button,
  Space,
  Typography,
  Popconfirm,
  message,
  Card,
  Rate,
  Avatar,
  Spin,
  Empty,
  Pagination as AntdPagination,
  Input,
  Select,
  Row,
  Col
} from "antd";

import {
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  SearchOutlined
} from "@ant-design/icons";

import ReviewService from "../../../services/review.service";

const { Text } = Typography;
const { Option } = Select;

const API_URL = "tbtshoplt.xyz";

const List = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 🔥 NEW STATE
  const [keyword, setKeyword] = useState("");
  const [rating, setRating] = useState("");

  // debounce
  const [searchTimeout, setSearchTimeout] = useState(null);

  const getImageUrl = (image, folder) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    if (image.startsWith("/")) return `${API_URL}${image}`;
    return `${API_URL}/uploads/${folder}/${image}`;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await ReviewService.getReviews({
        page: current,
        limit: pageSize,
        keyword,
        rating
      });

      const response = res?.data?.data || res?.data || {};
      const reviews = response?.items || [];

      const newData = reviews.map((item) => ({
        ...item,
        key: item.id
      }));

      setData(newData);
      setTotal(response?.totalItems || 0);

    } catch (error) {
      console.error(error);
      message.error("Không tải được review");
    } finally {
      setLoading(false);
    }
  }, [current, pageSize, keyword, rating]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      await ReviewService.deleteReview(id);
      message.success("Xóa review thành công");
      fetchData();
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };

  const handlePageChange = (page) => {
    setCurrent(page);
  };

  // 🔥 SEARCH DEBOUNCE
  const handleSearch = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      setCurrent(1);
      setKeyword(value);
    }, 500);

    setSearchTimeout(timeout);
  };

  // 🔥 FILTER RATING
  const handleFilterRating = (value) => {
    setCurrent(1);
    setRating(value);
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 70 },

    {
      title: "Sản phẩm",
      render: (_, record) => {
        const image = getImageUrl(record.product?.thumbnail, "products");

        return (
          <Space>
            <Avatar shape="square" size={50} src={image} />
            <Text>{record.product?.name || "N/A"}</Text>
          </Space>
        );
      }
    },

    {
      title: "Người dùng",
      render: (_, record) => {
        const avatar = getImageUrl(record.user?.avatar, "users");

        return (
          <Space>
            <Avatar src={avatar} icon={<UserOutlined />} />
            <Text>{record.user?.name || "N/A"}</Text>
          </Space>
        );
      }
    },

    {
      title: "Đánh giá",
      dataIndex: "rating",
      render: (rating) => <Rate disabled value={rating || 0} />
    },

    {
      title: "Bình luận",
      dataIndex: "comment",
      render: (text) => (
        <Text ellipsis style={{ maxWidth: 250 }}>
          {text || "-"}
        </Text>
      )
    },

    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (date) =>
        date ? new Date(date).toLocaleString() : "-"
    },

    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/reviews/detail/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn muốn xóa review này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card title="Quản lý review">
      
      {/* 🔥 SEARCH + FILTER */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input
            placeholder="Tìm kiếm bình luận, user, sản phẩm..."
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </Col>

        <Col span={6}>
          <Select
            placeholder="Lọc theo sao"
            style={{ width: "100%" }}
            allowClear
            onChange={handleFilterRating}
          >
            <Option value="5">5 sao</Option>
            <Option value="4">4 sao</Option>
            <Option value="3">3 sao</Option>
            <Option value="2">2 sao</Option>
            <Option value="1">1 sao</Option>
          </Select>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : data.length === 0 ? (
        <Empty description="Chưa có review nào" />
      ) : (
        <>
          <Table
            rowKey="key"
            columns={columns}
            dataSource={data}
            pagination={false}
          />

          <div style={{ textAlign: "right", marginTop: 16 }}>
            <AntdPagination
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default List;
