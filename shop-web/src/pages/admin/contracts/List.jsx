import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Card,
  Typography,
  Input,
  Select,
  Row,
  Col
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FilePdfOutlined,
  SearchOutlined
} from "@ant-design/icons";

// Services
import ContractService from "../../../services/contract.service";
import supplierService from "../../../services/supplier.service";

// Context
import { useToast } from "../../../context/ToastProvider";

const { Text } = Typography;
const { Option } = Select;

const API_URL = "http://tbtshoplt.xyz";

const List = () => {
  const toast = useToast();

  /* ================= STATE ================= */
  const [data, setData] = useState([]);
  const [suppliers, setSuppliers] = useState({});
  const [supplierList, setSupplierList] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // filter
  const [filters, setFilters] = useState({
    search: "",
    supplier_id: undefined, // Dùng undefined để hiện placeholder của Antd Select
    status: undefined
  });

  /* ================= FETCH SUPPLIER (Run once) ================= */
  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await supplierService.getSuppliers();
      const list = res?.data?.data?.items || [];

      const map = {};
      list.forEach((s) => {
        map[s.id] = s.name;
      });

      setSuppliers(map);
      setSupplierList(list);
    } catch (error) {
      toast.error("Không thể tải danh sách nhà cung cấp");
    }
  }, [toast]);

  /* ================= FETCH CONTRACTS ================= */
  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      };

      const res = await ContractService.getContracts(params);
      const result = res?.data?.data || {};
      
      setData(result.items || []);
      // Chỉ cập nhật total, tránh cập nhật lại current/pageSize gây lặp
      setPagination(prev => ({
        ...prev,
        total: result.total || 0
      }));
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách hợp đồng");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, filters]); 

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  /* ================= HANDLERS ================= */
  const handleDelete = async (id) => {
    try {
      await ContractService.deleteContract(id);
      toast.success("Xóa thành công");
      fetchContracts();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleFilterChange = (value, field) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  /* ================= COLUMNS ================= */
  const columns = [
    {
      title: "Mã",
      dataIndex: "contract_code",
      key: "contract_code",
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier_id",
      key: "supplier_id",
      render: (id) => suppliers[id] || <Text type="secondary">{id}</Text>
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = {
          active: { color: "green", label: "Đang hiệu lực" },
          expired: { color: "orange", label: "Hết hạn" },
          cancelled: { color: "red", label: "Đã hủy" }
        };
        const { color, label } = config[status] || { color: "default", label: status };
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: "File",
      dataIndex: "file",
      key: "file",
      render: (file) => {
        if (!file) return "N/A";
        const url = file.startsWith("http") ? file : `${API_URL}${file.startsWith("/") ? "" : "/"}${file}`;
        return (
          <a href={url} target="_blank" rel="noreferrer">
            <Button type="link" size="small" icon={<FilePdfOutlined />}>Xem</Button>
          </a>
        );
      }
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin/contracts/edit/${record.id}`}>
            <Button type="text" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xác nhận xóa hợp đồng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<Text size="large">Quản lý danh sách hợp đồng</Text>}
        extra={
          <Link to="/admin/contracts/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm mới
            </Button>
          </Link>
        }
      >
        {/* FILTER SECTION */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm theo tên, mã hợp đồng..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={handleSearch}
            />
          </Col>

          <Col xs={12} md={6}>
            <Select
              placeholder="Chọn nhà cung cấp"
              allowClear
              style={{ width: "100%" }}
              onChange={(val) => handleFilterChange(val, "supplier_id")}
            >
              {supplierList.map((s) => (
                <Option key={s.id} value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Col>

          <Col xs={12} md={6}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: "100%" }}
              onChange={(val) => handleFilterChange(val, "status")}
            >
              <Option value="active">Đang hiệu lực</Option>
              <Option value="expired">Hết hạn</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Col>
        </Row>

        {/* TABLE SECTION */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} hợp đồng`
          }}
          onChange={handleTableChange}
          bordered
        />
      </Card>
    </div>
  );
};

export default List;