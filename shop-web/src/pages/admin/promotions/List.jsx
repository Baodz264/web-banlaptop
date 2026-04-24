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
  Card
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined
} from "@ant-design/icons";

import dayjs from "dayjs";

import promotionService from "../../../services/promotion.service";
import exportService from "../../../services/export.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;

const List = () => {
  const toast = useToast();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // ================= FETCH =================
  const fetchData = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await promotionService.getPromotions({
        search,
        page,
        limit
      });

      const { items, totalItems, currentPage } = res.data.data;

      setData(items);
      setPagination((prev) => ({
        ...prev,
        current: currentPage,
        pageSize: limit,
        total: totalItems
      }));
    } catch (error) {
      toast.error("Không tải được danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    fetchData(1, pagination.pageSize);
  }, [fetchData, pagination.pageSize]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await promotionService.deletePromotion(id);
      toast.success("Xóa khuyến mãi thành công");
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error("Xóa khuyến mãi thất bại");
    }
  };

  // ================= EXPORT =================
  const handleExport = async (format) => {
    try {
      await exportService.exportData("promotions", format);
      toast.success(`Export ${format.toUpperCase()} thành công`);
    } catch (error) {
      toast.error(`Export ${format.toUpperCase()} thất bại`);
    }
  };

  // ================= COLUMNS =================
  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      render: (_, __, index) => 
        (index + 1) + (pagination.current - 1) * pagination.pageSize
    },
    {
      title: "Tên chương trình",
      dataIndex: "name"
    },
    {
      title: "Loại giảm",
      dataIndex: "type",
      render: (v) => (
        <Tag color={v === "percent" ? "blue" : "green"}>
          {v === "percent" ? "Phần trăm (%)" : "Giảm tiền"}
        </Tag>
      )
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      render: (v, record) => {
        if (record.type === "percent") return `${v}%`;
        return `${Number(v).toLocaleString()} đ`;
      }
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      render: (v) =>
        v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      render: (v) =>
        v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) =>
        v === 1
          ? <Tag color="green">Đang hoạt động</Tag>
          : <Tag color="red">Ngưng</Tag>
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/promotions/detail/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/admin/promotions/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            okText="Xóa"
            cancelText="Hủy"
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
      <Card
        title={<Title level={2}>Quản lý khuyến mãi</Title>}
        extra={
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleExport("excel")}
            >
              Excel
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleExport("pdf")}
            >
              PDF
            </Button>
            <Link to="/admin/promotions/add">
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm khuyến mãi
              </Button>
            </Link>
          </Space>
        }
      >
        {/* SEARCH */}
        <Input
          placeholder="Tìm kiếm khuyến mãi..."
          prefix={<SearchOutlined />}
          className="mb-4 max-w-md"
          allowClear
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              fetchData(page, pageSize);
            }
          }}
        />
      </Card>
    </div>
  );
};

export default List;