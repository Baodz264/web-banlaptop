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

import menuService from "../../../services/menu.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;

const List = () => {
  const toast = useToast();

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // Build tree (robust)
  // Hàm này không phụ thuộc vào state nên có thể để ngoài hoặc dùng useCallback
  const buildTree = useCallback((data) => {
    const map = {};
    const roots = [];

    data.forEach((raw) => {
      const id = Number(raw.id);
      const parentId =
        raw.parent_id === null || raw.parent_id === undefined
          ? null
          : Number(raw.parent_id);

      map[id] = {
        ...raw,
        id,
        parent_id: parentId,
        children: [],
      };
    });

    Object.values(map).forEach((item) => {
      if (item.parent_id && map[item.parent_id]) {
        map[item.parent_id].children.push(item);
      } else if (item.parent_id && !map[item.parent_id]) {
        if (!map[item.parent_id]) {
          map[item.parent_id] = {
            id: item.parent_id,
            name: item.parent?.name || `Menu #${item.parent_id}`,
            link: item.parent?.link || "",
            position: 0,
            status: 1,
            parent_id: null,
            children: [],
            __virtual: true,
          };
          roots.push(map[item.parent_id]);
        }
        map[item.parent_id].children.push(item);
      } else {
        roots.push(item);
      }
    });

    return roots;
  }, []);

  // fetchMenus được bọc trong useCallback để tránh thay đổi reference
  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await menuService.getMenus({
        page,
        limit,
        search: searchText,
      });

      const data = res.data?.data || {};
      const items = data.items || [];

      setTotal(data.totalItems || 0);

      const tree = buildTree(items);

      setMenus(tree);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được menu");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText, buildTree, toast]); 

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]); // Bây giờ fetchMenus là dependency hợp lệ

  const handleDelete = async (id) => {
    try {
      await menuService.deleteMenu(id);
      toast.success("Xóa menu thành công");
      fetchMenus();
    } catch (error) {
      console.error(error);
      toast.error("Xóa menu thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên Menu",
      dataIndex: "name",
      render: (name, record) =>
        record.__virtual ? <i>{name}</i> : name,
    },
    {
      title: "Link",
      dataIndex: "link",
      render: (v) => v || "N/A",
    },
    {
      title: "Position",
      dataIndex: "position",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) =>
        s === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Hidden</Tag>,
    },
    {
      title: "Action",
      width: 180,
      render: (_, record) =>
        record.__virtual ? null : (
          <Space>
            <Link to={`/admin/menus/detail/${record.id}`}>
              <Button icon={<EyeOutlined />} />
            </Link>

            <Link to={`/admin/menus/edit/${record.id}`}>
              <Button icon={<EditOutlined />} />
            </Link>

            <Popconfirm
              title="Bạn có chắc muốn xóa menu này?"
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

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-5">
          <Title level={3}>Quản lý Menu</Title>

          <Link to="/admin/menus/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm Menu
            </Button>
          </Link>
        </div>

        <Input
          placeholder="Tìm menu..."
          prefix={<SearchOutlined />}
          allowClear
          className="mb-4 max-w-md"
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
        />

        <Table
          columns={columns}
          dataSource={menus}
          rowKey="id"
          loading={loading}
          expandable={{ defaultExpandAllRows: true }}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default List;