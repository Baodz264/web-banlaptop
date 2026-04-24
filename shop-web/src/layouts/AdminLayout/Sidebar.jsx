import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ShopOutlined,
  GiftOutlined,
  UserOutlined,
  MessageOutlined,
  FileTextOutlined,
  SettingOutlined,
  CommentOutlined,
  DatabaseOutlined,
  AuditOutlined,
  AppstoreAddOutlined,
  BellOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";

import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Bảng điều khiển",
    },

    // ================= BÁN HÀNG =================
    {
      type: "group",
      label: "Quản lý bán hàng",
      children: [
        {
          key: "/admin/orders",
          icon: <ShoppingCartOutlined />,
          label: "Đơn hàng",
        },
        {
          key: "/admin/products",
          icon: <AppstoreOutlined />,
          label: "Sản phẩm",
        },

        // ⭐ ATTRIBUTE (NEW)
        {
          key: "/admin/attributes",
          icon: <TagsOutlined />,
          label: "Thuộc tính",
        },

        {
          key: "/admin/bundles",
          icon: <AppstoreAddOutlined />,
          label: "Gói sản phẩm",
        },
        {
          key: "/admin/categories",
          icon: <TagsOutlined />,
          label: "Danh mục",
        },
        {
          key: "/admin/brands",
          icon: <ShopOutlined />,
          label: "Thương hiệu",
        },
      ],
    },

    // ================= KHUYẾN MÃI =================
    {
      type: "group",
      label: "Khuyến mãi & Marketing",
      children: [
        {
          key: "/admin/promotions",
          icon: <GiftOutlined />,
          label: "Khuyến mãi",
        },
        {
          key: "/admin/vouchers",
          icon: <GiftOutlined />,
          label: "Voucher",
        },
        {
          key: "/admin/voucher-applies",
          icon: <TagsOutlined />,
          label: "Áp dụng voucher",
        },
        {
          key: "/admin/reviews",
          icon: <CommentOutlined />,
          label: "Đánh giá",
        },
        {
          key: "/admin/notifications",
          icon: <BellOutlined />,
          label: "Thông báo",
        },
      ],
    },

    // ================= KHÁCH HÀNG =================
    {
      type: "group",
      label: "Chăm sóc khách hàng",
      children: [
        {
          key: "/admin/contracts",
          icon: <FileProtectOutlined />,
          label: "Hợp đồng",
        },
        {
          key: "/admin/warranties",
          icon: <AuditOutlined />,
          label: "Bảo hành",
        },
        {
          key: "/admin/chat",
          icon: <MessageOutlined />,
          label: "Hỗ trợ chat",
        },
      ],
    },

    // ================= KHO =================
    {
      type: "group",
      label: "Kho & Nhà cung cấp",
      children: [
        {
          key: "/admin/suppliers",
          icon: <ShopOutlined />,
          label: "Nhà cung cấp",
        },
        {
          key: "/admin/inventories",
          icon: <DatabaseOutlined />,
          label: "Quản lý kho",
        },
        {
          key: "/admin/inventoryLogs",
          icon: <AuditOutlined />,
          label: "Lịch sử kho",
        },
      ],
    },

    // ================= NỘI DUNG =================
    {
      type: "group",
      label: "Quản lý nội dung",
      children: [
        {
          key: "/admin/topics",
          icon: <FileTextOutlined />,
          label: "Chủ đề",
        },
        {
          key: "/admin/posts",
          icon: <FileTextOutlined />,
          label: "Bài viết",
        },
        {
          key: "/admin/banners",
          icon: <AppstoreOutlined />,
          label: "Banner",
        },
      ],
    },

    // ================= HỆ THỐNG =================
    {
      type: "group",
      label: "Hệ thống",
      children: [
        {
          key: "/admin/users",
          icon: <UserOutlined />,
          label: "Người dùng",
        },
        {
          key: "/admin/customers",
          icon: <UserOutlined />,
          label: "Khách hàng",
        },
        {
          key: "/admin/menus",
          icon: <AppstoreOutlined />,
          label: "Menu",
        },
        {
          key: "/admin/settings",
          icon: <SettingOutlined />,
          label: "Cài đặt",
        },
      ],
    },
  ];

  return (
    <Sider
      width={250}
      style={{
        background: "#fff",
        height: "100vh",
        overflowY: "auto",
        borderRight: "1px solid #eee",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          padding: "20px",
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        B&P Management
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;
