import React, { useEffect, useState } from "react";
import { Menu, ConfigProvider } from "antd";
import { Link, useLocation } from "react-router-dom";
import menuService from "../../services/menu.service";

function Nav() {
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();

  const fetchMenus = async () => {
    try {
      const res = await menuService.getMenus({ status: 1, page: 1, limit: 50 });
      const menus = res.data.data.items;
      const parents = menus.filter(m => m.parent_id === null);

      const menuTree = parents.map(parent => {
        const children = menus
          .filter(m => m.parent_id === parent.id)
          .map(child => ({
            key: child.link || `child-${child.id}`,
            label: <Link to={child.link || "#"}>{child.name}</Link>
          }));

        return {
          key: parent.link || `parent-${parent.id}`,
          label: <Link to={parent.link || "#"}>{parent.name}</Link>,
          children: children.length ? children : undefined
        };
      });
      setMenuItems(menuTree);
    } catch (error) {
      console.log("Menu API error:", error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00ff85", // Màu xanh lá CyberGreen
        },
        components: {
          Menu: {
            itemBg: "transparent",
            itemHoverColor: "#00ff85",
            itemSelectedColor: "#00ff85",
            activeBarHeight: 0,
          },
        },
      }}
    >
      <div className="nav-container-premium">
        <div className="glass-capsule">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="cybergreen-menu"
          />
        </div>

        <style>{`
          /* Container chính */
          .nav-container-premium {
            display: flex;
            justify-content: center;
            padding: 15px 0;
            background: transparent; /* Để lộ bóng đổ của header phía trên */
            margin-top: -10px; /* Nhích lên chút cho gần Header */
          }

          /* Thanh điều hướng dạng kính mờ tinh tế */
          .glass-capsule {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: 50px;
            padding: 0 30px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
            transition: all 0.3s ease;
          }

          .glass-capsule:hover {
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
          }

          /* Tùy chỉnh Menu */
          .cybergreen-menu {
            border: none !important;
            line-height: 50px !important;
            background: transparent !important;
            min-width: 400px;
            justify-content: center;
            text-transform: capitalize; /* Chữ cái đầu viết hoa cho sang */
          }

          /* Font chữ và khoảng cách */
          .cybergreen-menu .ant-menu-item {
            font-size: 15px !important;
            font-weight: 600 !important;
            color: #333 !important;
            padding: 0 25px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }

          /* Hiệu ứng gạch chân hiện đại */
          .cybergreen-menu .ant-menu-item::after {
            content: "";
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%) scaleX(0);
            width: 20px;
            height: 3px;
            background: #00ff85;
            border-radius: 10px;
            transition: all 0.3s ease !important;
          }

          .cybergreen-menu .ant-menu-item-selected::after,
          .cybergreen-menu .ant-menu-item:hover::after {
            transform: translateX(-50%) scaleX(1);
          }

          /* Màu khi được chọn */
          .cybergreen-menu .ant-menu-item-selected a {
            color: #008f4c !important; /* Xanh đậm hơn chút cho rõ */
          }

          /* Menu con (Submenu) */
          .ant-menu-submenu-popup .ant-menu {
            border-radius: 15px !important;
            padding: 10px !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
            border: none !important;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}

export default Nav;