import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import {
  Table,
  Button,
  Space,
  Card,
  Popconfirm,
  Tag,
  Tooltip,
  Input,
  Select
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined
} from "@ant-design/icons";

import BundleService from "../../../services/bundle.service";
import BundleItemService from "../../../services/bundleItem.service";
import VariantService from "../../../services/variant.service";

import { useToast } from "../../../context/ToastProvider";

const { Option } = Select;

const List = () => {
  const toast = useToast();

  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // filter
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchBundles = useCallback(async (pageParam, searchParam, statusParam) => {
    try {
      setLoading(true);

      const [bundleRes, itemRes, variantRes] = await Promise.all([
        BundleService.getBundles({
          page: pageParam,
          limit,
          search: searchParam,
          status: statusParam
        }),
        BundleItemService.getItems(),
        VariantService.getAll()
      ]);

      const bundleData = bundleRes?.data?.data?.items || [];
      const totalItems = bundleRes?.data?.data?.totalItems || 0;

      setTotal(totalItems);

      const bundleItems = itemRes?.data?.data || [];
      const variants = variantRes?.data?.data || [];

      const bundleMap = bundleData.map((bundle) => {
        const items = bundleItems.filter(
          (item) => item.bundle_id === bundle.id
        );

        const variantList = items
          .map((item) => {
            const v = variants.find((v) => v.id === item.variant_id);
            if (!v) return null;

            const attrs = v.AttributeValues?.map(
              (av) => `${av.Attribute?.name}: ${av.value}`
            ).join(", ");

            return {
              ...v,
              displayName: `${v.Product?.name}${
                attrs ? ` (${attrs})` : ""
              } - ${v.sku}`
            };
          })
          .filter(Boolean);

        const totalPrice = variantList.reduce(
          (sum, v) => sum + Number(v.price || 0),
          0
        );

        return {
          ...bundle,
          variants: variantList,
          item_count: variantList.length,
          total_price: totalPrice
        };
      });

      setBundles(bundleMap);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được danh sách bundle");
    } finally {
      setLoading(false);
    }
  }, [limit, toast]);

  // load data
  useEffect(() => {
    fetchBundles(page, search, status);
  }, [page, search, status, fetchBundles]);

  // search submit
  const handleSearch = (value) => {
    setPage(1);
    setSearch(value);
  };

  // status filter
  const handleStatusChange = (value) => {
    setPage(1);
    setStatus(value);
  };

  const handleDelete = async (id) => {
    try {
      await BundleService.deleteBundle(id);
      toast.success("Xóa bundle thành công");
      fetchBundles(page, search, status);
    } catch (error) {
      console.error(error);
      toast.error("Xóa bundle thất bại");
    }
  };

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      render: (_, __, index) => (page - 1) * limit + index + 1
    },
    { title: "Tên Bundle", dataIndex: "name" },
    {
      title: "Số sản phẩm",
      dataIndex: "item_count",
      render: (value) => <Tag color="blue">{value}</Tag>
    },
    {
      title: "Variants",
      render: (_, record) => (
        <Space wrap>
          {record.variants?.slice(0, 3).map((v) => (
            <Tooltip key={v.id} title={v.displayName}>
              <Tag>{v.sku}</Tag>
            </Tooltip>
          ))}
          {record.variants?.length > 3 && (
            <Tag>+{record.variants.length - 3}</Tag>
          )}
        </Space>
      )
    },
    {
      title: "Tổng giá",
      dataIndex: "total_price",
      render: (value) => Number(value).toLocaleString() + " ₫"
    },
    {
      title: "Loại giảm",
      dataIndex: "discount_type",
      render: (value) =>
        value === "percent" ? (
          <Tag color="blue">%</Tag>
        ) : (
          <Tag color="purple">VNĐ</Tag>
        )
    },
    {
      title: "Giá trị giảm",
      dataIndex: "discount_value",
      render: (value) => Number(value).toLocaleString()
    },
    {
      title: "Bắt đầu",
      dataIndex: "start_date",
      render: (value) =>
        value ? new Date(value).toLocaleDateString() : "-"
    },
    {
      title: "Kết thúc",
      dataIndex: "end_date",
      render: (value) =>
        value ? new Date(value).toLocaleDateString() : "-"
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) =>
        status ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Tắt</Tag>
        )
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/bundles/detail/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/admin/bundles/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn có chắc muốn xóa bundle này?"
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
    <Card
      title="Danh sách Bundle"
      extra={
        <Link to="/admin/bundles/add">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm Bundle
          </Button>
        </Link>
      }
    >
      {/* FILTER BAR */}
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm theo tên bundle..."
          allowClear
          onSearch={handleSearch}
          style={{ width: 250 }}
        />

        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 150 }}
          onChange={handleStatusChange}
        >
          <Option value="1">Hoạt động</Option>
          <Option value="0">Tắt</Option>
        </Select>
      </Space>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={bundles}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: false
        }}
      />
    </Card>
  );
};

export default List;
