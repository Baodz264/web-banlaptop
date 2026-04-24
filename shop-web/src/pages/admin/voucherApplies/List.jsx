import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import { useToast } from "../../../context/ToastProvider";

import VoucherApplyService from "../../../services/voucherApply.service";
import VoucherService from "../../../services/voucher.service";
import productService from "../../../services/product.service";
import categoryService from "../../../services/category.service";

function VoucherApplyList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [vouchers, setVouchers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const toast = useToast();

  /* ================= TẢI DỮ LIỆU ================= */

  // Sử dụng useCallback để bao bọc hàm tránh việc tạo lại hàm mỗi khi component render
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [applyRes, voucherRes, productRes, categoryRes] =
        await Promise.all([
          VoucherApplyService.getVoucherApplies(),
          VoucherService.getVouchers({ limit: 1000 }),
          productService.getProducts({ limit: 1000 }),
          categoryService.getCategories({ limit: 1000 }),
        ]);

      setData(applyRes?.data?.data || []);
      setVouchers(voucherRes?.data?.data?.items || []);
      setProducts(productRes?.data?.data?.items || []);
      setCategories(categoryRes?.data?.data?.items || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu cấu hình voucher");
    } finally {
      setLoading(false);
    }
  }, [toast]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  

  const handleDelete = async (id) => {
    try {
      await VoucherApplyService.deleteVoucherApply(id);

      toast.success("Xóa cấu hình voucher thành công");

      fetchData();
    } catch (error) {
      toast.error("Xóa cấu hình voucher thất bại");
    }
  };

  /* ================= TÌM TÊN ================= */

  const getVoucherName = (id) => {
    const voucher = vouchers.find((v) => v.id === id);
    return voucher ? `${voucher.code} - ${voucher.name}` : id;
  };

  const getProductName = (id) => {
    const product = products.find((p) => p.id === id);
    return product ? product.name : "-";
  };

  const getCategoryName = (id) => {
    const category = categories.find((c) => c.id === id);
    return category ? category.name : "-";
  };

  /* ================= BẢNG ================= */

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Voucher",
      dataIndex: "voucher_id",
      render: (value) => getVoucherName(value),
    },
    {
      title: "Loại áp dụng",
      dataIndex: "apply_type",
      render: (value) => {
        if (value === "all") return <Tag color="green">Tất cả</Tag>;
        if (value === "category") return <Tag color="blue">Danh mục</Tag>;
        if (value === "product") return <Tag color="orange">Sản phẩm</Tag>;
      },
    },
    {
      title: "Danh mục",
      dataIndex: "category_id",
      render: (value) => getCategoryName(value),
    },
    {
      title: "Sản phẩm",
      dataIndex: "product_id",
      render: (value) => getProductName(value),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/admin/voucher-applies/edit/${record.id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                shape="circle"
              />
            </Link>
          </Tooltip>

          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa cấu hình này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                shape="circle"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý cấu hình áp dụng Voucher</h2>

      <Link to="/admin/voucher-applies/add">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginBottom: 20 }}
        >
          Thêm cấu hình
        </Button>
      </Link>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
      />
    </div>
  );
}

export default VoucherApplyList;