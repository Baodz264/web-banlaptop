import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  InputNumber,
  Row,
  Col
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DownloadOutlined
} from "@ant-design/icons";

import VoucherService from "../../../services/voucher.service";
import exportService from "../../../services/export.service";
import { useToast } from "../../../context/ToastProvider";

const List = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // ================= FETCH =================
  const fetchData = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const res = await VoucherService.getVouchers({
        page,
        limit,
        search,
        minQty,
        maxQty
      });

      const { items, totalItems, currentPage } = res.data.data;

      setData(items);

      setPagination({
        current: currentPage,
        pageSize: limit,
        total: totalItems
      });
    } catch (error) {
      toast.error("Không tải được danh sách voucher");
    } finally {
      setLoading(false);
    }
  }, [search, minQty, maxQty, toast]);

  useEffect(() => {
    fetchData(1, pagination.pageSize);
  }, [fetchData, pagination.pageSize]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await VoucherService.deleteVoucher(id);
      toast.success("Xóa voucher thành công");
      fetchData(pagination.current, pagination.pageSize);
    } catch {
      toast.error("Xóa voucher thất bại");
    }
  };

  // ================= EXPORT =================
  const handleExport = async (format) => {
    try {
      await exportService.exportData("vouchers", format);
      toast.success(`Export ${format.toUpperCase()} thành công`);
    } catch {
      toast.error(`Export ${format.toUpperCase()} thất bại`);
    }
  };

  // ================= FORMAT =================
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  // ================= COLUMNS =================
  const columns = [
    {
      title: "STT",
      width: 70,
      render: (_, __, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      }
    },
    {
      title: "Mã",
      dataIndex: "code"
    },
    {
      title: "Tên",
      dataIndex: "name"
    },
    {
      title: "Loại",
      dataIndex: "type",
      render: (type) => (
        <Tag color={type === "order" ? "blue" : "purple"}>
          {type === "order" ? "Đơn hàng" : "Ship"}
        </Tag>
      )
    },
    {
      title: "Giảm",
      render: (_, record) =>
        record.discount_type === "percent"
          ? `${record.discount_value}%`
          : `${Number(record.discount_value).toLocaleString()} ₫`
    },
    {
      title: "Số lượng",
      dataIndex: "quantity"
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      render: (date) => formatDate(date)
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      render: (date) => formatDate(date)
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) =>
        status === 1
          ? <Tag color="green">Hoạt động</Tag>
          : <Tag color="red">Tạm khóa</Tag>
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              navigate(`/admin/vouchers/edit/${record.id}`)
            }
          />
          <Popconfirm
            title="Xóa voucher?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
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
        title="Quản lý Voucher"
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/vouchers/add")}
            >
              Thêm voucher
            </Button>
          </Space>
        }
      >
        {/* SEARCH + FILTER */}
        <Row gutter={16} className="mb-4">
          <Col>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200 }}
            />
          </Col>
          <Col>
            <InputNumber
              placeholder="Min SL"
              value={minQty}
              onChange={(v) => setMinQty(v)}
            />
          </Col>
          <Col>
            <InputNumber
              placeholder="Max SL"
              value={maxQty}
              onChange={(v) => setMaxQty(v)}
            />
          </Col>
        </Row>

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
            },
            onShowSizeChange: (_, size) => {
              fetchData(1, size);
            }
          }}
        />
      </Card>
    </div>
  );
};

export default List;
