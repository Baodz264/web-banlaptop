import { lazy } from "react";

// Core layout
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminRoute = lazy(() => import("../components/AdminRoute"));

// Dashboard
const Dashboard = lazy(() => import("../pages/admin/dashboard/Dashboard"));

// Banner
const BannerList = lazy(() => import("../pages/admin/banner/List"));
const BannerCreate = lazy(() => import("../pages/admin/banner/Add"));
const BannerEdit = lazy(() => import("../pages/admin/banner/Edit"));

// User
const UserList = lazy(() => import("../pages/admin/users/List"));
const UserAdd = lazy(() => import("../pages/admin/users/Add"));
const UserEdit = lazy(() => import("../pages/admin/users/Edit"));
const UserDetail = lazy(() => import("../pages/admin/users/Detail"));

// Brand
const BrandList = lazy(() => import("../pages/admin/catalog/brands/List"));
const BrandAdd = lazy(() => import("../pages/admin/catalog/brands/Add"));
const BrandEdit = lazy(() => import("../pages/admin/catalog/brands/Edit"));

// Category
const CateList = lazy(() => import("../pages/admin/catalog/categories/List"));
const CateAdd = lazy(() => import("../pages/admin/catalog/categories/Add"));
const CateEdit = lazy(() => import("../pages/admin/catalog/categories/Edit"));

// Menu
const MenuList = lazy(() => import("../pages/admin/menus/List"));
const MenuAdd = lazy(() => import("../pages/admin/menus/Add"));
const MenuEdit = lazy(() => import("../pages/admin/menus/Edit"));
const MenuDetail = lazy(() => import("../pages/admin/menus/Detail"));

// Setting
const SettingList = lazy(() => import("../pages/admin/settings/List"));
const SettingAdd = lazy(() => import("../pages/admin/settings/Add"));
const SettingEdit = lazy(() => import("../pages/admin/settings/Edit"));

// Topic
const TopicList = lazy(() => import("../pages/admin/topics/List"));
const TopicAdd = lazy(() => import("../pages/admin/topics/Add"));
const TopicEdit = lazy(() => import("../pages/admin/topics/Edit"));
const TopicDetail = lazy(() => import("../pages/admin/topics/Detail"));

// Post
const PostList = lazy(() => import("../pages/admin/posts/List"));
const PostAdd = lazy(() => import("../pages/admin/posts/Add"));
const PostEdit = lazy(() => import("../pages/admin/posts/Edit"));
const PostDetail = lazy(() => import("../pages/admin/posts/Detail"));

// Product
const ProList = lazy(() => import("../pages/admin/products/List"));
const ProAdd = lazy(() => import("../pages/admin/products/Add"));
const ProEdit = lazy(() => import("../pages/admin/products/Edit"));
const ProDetail = lazy(() => import("../pages/admin/products/Detail"));

// Chat
const ChatPage = lazy(() => import("../pages/admin/chat/ChatPage"));

// Promotion
const SaleList = lazy(() => import("../pages/admin/promotions/List"));
const SaleAdd = lazy(() => import("../pages/admin/promotions/Add"));
const SaleEdit = lazy(() => import("../pages/admin/promotions/Edit"));
const SaleDetail = lazy(() => import("../pages/admin/promotions/Detail"));

// Voucher
const VoucherList = lazy(() => import("../pages/admin/vouchers/List"));
const VoucherAdd = lazy(() => import("../pages/admin/vouchers/Add"));
const VoucherEdit = lazy(() => import("../pages/admin/vouchers/Edit"));

// Supplier
const SuppList = lazy(() => import("../pages/admin/suppliers/List"));
const SuppAdd = lazy(() => import("../pages/admin/suppliers/Add"));
const SuppEdit = lazy(() => import("../pages/admin/suppliers/Edit"));
const SuppDetail = lazy(() => import("../pages/admin/suppliers/Detail"));

// Inventory
const InvenList = lazy(() => import("../pages/admin/inventories/List"));
const InvenAdd = lazy(() => import("../pages/admin/inventories/Add"));
const InvenEdit = lazy(() => import("../pages/admin/inventories/Edit"));
const InvenDetail = lazy(() => import("../pages/admin/inventories/Detail"));

// Inventory Logs
const InvenLogList = lazy(() => import("../pages/admin/inventoryLogs/List"));
const InvenLogDetail = lazy(() => import("../pages/admin/inventoryLogs/Detail"));

// Reviews
const ReviewList = lazy(() => import("../pages/admin/reviews/List"));
const ReviewDetail = lazy(() => import("../pages/admin/reviews/Detail"));

// Bundle
const BundleList = lazy(() => import("../pages/admin/bundle/List"));
const BundleAdd = lazy(() => import("../pages/admin/bundle/Add"));
const BundleEdit = lazy(() => import("../pages/admin/bundle/Edit"));
const BundleDetail = lazy(() => import("../pages/admin/bundle/Detail"));

// Notifications
const NotificationList = lazy(() => import("../pages/admin/notifications/List"));
const NotificationAdd = lazy(() => import("../pages/admin/notifications/Add"));
const NotificationDetail = lazy(() => import("../pages/admin/notifications/Detail"));

// Contracts
const ContraList = lazy(() => import("../pages/admin/contracts/List"));
const ContraAdd = lazy(() => import("../pages/admin/contracts/Add"));
const ContraEdit = lazy(() => import("../pages/admin/contracts/Edit"));

// Orders
const OrderList = lazy(() => import("../pages/admin/orders/List"));
const OrderDetail = lazy(() => import("../pages/admin/orders/Detail"));
const OrderShipment = lazy(() => import("../pages/admin/orders/Shipment"));

// Warranties
const WarrList = lazy(() => import("../pages/admin/warranties/List"));
const WarrAdd = lazy(() => import("../pages/admin/warranties/Add"));
const WarrEdit = lazy(() => import("../pages/admin/warranties/Edit"));

// Voucher Apply
const VoucherApplyList = lazy(() => import("../pages/admin/voucherApplies/List"));
const VoucherApplyAdd = lazy(() => import("../pages/admin/voucherApplies/Add"));
const VoucherApplyEdit = lazy(() => import("../pages/admin/voucherApplies/Edit"));

// Attribute
const AttributeList = lazy(() => import("../pages/admin/attribute/List"));
const AttributeAdd = lazy(() => import("../pages/admin/attribute/Add"));
const AttributeEdit = lazy(() => import("../pages/admin/attribute/Edit"));

// Customer
const CusTomer = lazy(() => import("../pages/admin/customers/List"));
const CusTomerDetail = lazy(() => import("../pages/admin/customers/Detail"));

// Profile
const ProFile = lazy(() => import("../pages/admin/profile/Profile"));



const AdminRoutes = [
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: "", element: <Dashboard /> },

      { path: "banners", element: <BannerList /> },
      { path: "banners/add", element: <BannerCreate /> },
      { path: "banners/edit/:id", element: <BannerEdit /> },

      { path: "users", element: <UserList /> },
      { path: "users/add", element: <UserAdd /> },
      { path: "users/edit/:id", element: <UserEdit /> },
      { path: "users/detail/:id", element: <UserDetail /> },

      { path: "brands", element: <BrandList /> },
      { path: "brands/add", element: <BrandAdd /> },
      { path: "brands/edit/:id", element: <BrandEdit /> },

      { path: "categories", element: <CateList /> },
      { path: "categories/add", element: <CateAdd /> },
      { path: "categories/edit/:id", element: <CateEdit /> },

      { path: "menus", element: <MenuList /> },
      { path: "menus/add", element: <MenuAdd /> },
      { path: "menus/edit/:id", element: <MenuEdit /> },
      { path: "menus/detail/:id", element: <MenuDetail /> },

      { path: "settings", element: <SettingList /> },
      { path: "settings/add", element: <SettingAdd /> },
      { path: "settings/edit/:id", element: <SettingEdit /> },

      { path: "topics", element: <TopicList /> },
      { path: "topics/add", element: <TopicAdd /> },
      { path: "topics/edit/:id", element: <TopicEdit /> },
      { path: "topics/detail/:id", element: <TopicDetail /> },

      { path: "posts", element: <PostList /> },
      { path: "posts/add", element: <PostAdd /> },
      { path: "posts/edit/:id", element: <PostEdit /> },
      { path: "posts/detail/:id", element: <PostDetail /> },

      { path: "products", element: <ProList /> },
      { path: "products/add", element: <ProAdd /> },
      { path: "products/edit/:id", element: <ProEdit /> },
      { path: "products/detail/:id", element: <ProDetail /> },

      { path: "chat", element: <ChatPage /> },

      { path: "promotions", element: <SaleList /> },
      { path: "promotions/add", element: <SaleAdd /> },
      { path: "promotions/edit/:id", element: <SaleEdit /> },
      { path: "promotions/detail/:id", element: <SaleDetail /> },

      { path: "vouchers", element: <VoucherList /> },
      { path: "vouchers/add", element: <VoucherAdd /> },
      { path: "vouchers/edit/:id", element: <VoucherEdit /> },

      { path: "suppliers", element: <SuppList /> },
      { path: "suppliers/add", element: <SuppAdd /> },
      { path: "suppliers/edit/:id", element: <SuppEdit /> },
      { path: "suppliers/detail/:id", element: <SuppDetail /> },

      { path: "inventories", element: <InvenList /> },
      { path: "inventories/add", element: <InvenAdd /> },
      { path: "inventories/edit/:id", element: <InvenEdit /> },
      { path: "inventories/detail/:id", element: <InvenDetail /> },

      { path: "inventoryLogs", element: <InvenLogList /> },
      { path: "inventoryLogs/detail/:id", element: <InvenLogDetail /> },

      { path: "reviews", element: <ReviewList /> },
      { path: "reviews/detail/:id", element: <ReviewDetail /> },

      { path: "bundles", element: <BundleList /> },
      { path: "bundles/add", element: <BundleAdd /> },
      { path: "bundles/edit/:id", element: <BundleEdit /> },
      { path: "bundles/detail/:id", element: <BundleDetail /> },

      { path: "notifications", element: <NotificationList /> },
      { path: "notifications/add", element: <NotificationAdd /> },
      { path: "notifications/detail/:id", element: <NotificationDetail /> },

      { path: "contracts", element: <ContraList /> },
      { path: "contracts/add", element: <ContraAdd /> },
      { path: "contracts/edit/:id", element: <ContraEdit /> },

      { path: "orders", element: <OrderList /> },
      { path: "orders/detail/:id", element: <OrderDetail /> },
      { path: "orders/shipment/:id", element: <OrderShipment /> },

      { path: "warranties", element: <WarrList /> },
      { path: "warranties/add", element: <WarrAdd /> },
      { path: "warranties/edit/:id", element: <WarrEdit /> },

      { path: "voucher-applies", element: <VoucherApplyList /> },
      { path: "voucher-applies/add", element: <VoucherApplyAdd /> },
      { path: "voucher-applies/edit/:id", element: <VoucherApplyEdit /> },

      { path: "attributes", element: <AttributeList /> },
      { path: "attributes/add", element: <AttributeAdd /> },
      { path: "attributes/edit/:id", element: <AttributeEdit /> },

      { path: "customers", element: <CusTomer /> },
      { path: "customers/detail/:id", element: <CusTomerDetail /> },

      { path: "profile", element: <ProFile /> },
    ],
  },
];

export default AdminRoutes;
