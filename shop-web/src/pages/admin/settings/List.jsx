import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import {
  Table,
  Button,
  Space,
  Typography,
  Popconfirm,
  Input,
  Card
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined
} from "@ant-design/icons";

import settingService from "../../../services/setting.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;

const List = () => {
  const toast = useToast();

  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const [searchText, setSearchText] = useState("");

  /**
   * GIẢI PHÁP TRIỆT ĐỂ:
   * 1. Nhận page và limit trực tiếp từ tham số.
   * 2. Nếu không có tham số, mặc định lấy giá trị khởi tạo.
   * 3. Loại bỏ hoàn toàn 'pagination' khỏi dependency array để tránh lỗi lặp.
   */
  const fetchSettings = useCallback(async (pageParam, limitParam) => {
    setLoading(true);
    try {
      // Sử dụng giá trị truyền vào hoặc giá trị mặc định từ state khởi tạo
      const page = pageParam || 1;
      const limit = limitParam || 10;

      const res = await settingService.getSettings({
        page,
        limit,
        search: searchText
      });

      const { items, totalItems, currentPage } = res.data.data;

      setSettings(items);
      setPagination(prev => ({
        ...prev,
        total: totalItems,
        current: currentPage,
        pageSize: limit
      }));
    } catch (error) {
      console.error(error);
      toast.error("Không tải được settings");
    } finally {
      setLoading(false);
    }
    // Chỉ phụ thuộc vào searchText và toast. 
    // Khi searchText thay đổi, hàm này được tạo lại là chính xác.
  }, [searchText, toast]);

  // Gọi lần đầu hoặc khi tìm kiếm
  useEffect(() => {
    fetchSettings(1, pagination.pageSize);
  }, [fetchSettings, pagination.pageSize]);

  const handleDelete = async (id) => {
    try {
      await settingService.deleteSetting(id);
      toast.success("Xóa setting thành công");
      // Gọi lại trang hiện tại sau khi xóa
      fetchSettings(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(error);
      toast.error("Xóa setting thất bại");
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
      title: "Key",
      dataIndex: "key"
    },
    {
      title: "Value",
      dataIndex: "value",
      render: (value) => value || "N/A"
    },
    {
      title: "Action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Link to={`/admin/settings/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có chắc muốn xóa setting này?"
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
      <Card>
        <div className="flex justify-between items-center mb-5">
          <Title level={3}>Settings Management</Title>
          <Link to="/admin/settings/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm Setting
            </Button>
          </Link>
        </div>

        <Input
          placeholder="Tìm theo key..."
          prefix={<SearchOutlined />}
          allowClear
          className="mb-4 max-w-md"
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Table
          columns={columns}
          dataSource={settings}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              fetchSettings(page, pageSize);
            }
          }}
        />
      </Card>
    </div>
  );
};

export default List;