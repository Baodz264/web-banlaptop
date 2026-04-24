import React from "react";
import {
  Layout,
  Input,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Button
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const { Header } = Layout;
const { Text } = Typography;

/* ================= API URL ================= */
const API_URL = "http://tbtshoplt.xyz";

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  /* ================= MENU ================= */
  const items = [
    {
      key: "profile",
      icon: <SettingOutlined />,
      label: "Thông tin cá nhân",
      onClick: () => navigate("/admin/profile"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  /* ================= AVATAR ================= */
  const getAvatarUrl = () => {
    if (!user?.avatar) return null;

    // avatar là link full
    if (user.avatar.startsWith("http")) {
      return user.avatar;
    }

    // avatar có dạng /uploads/...
    if (user.avatar.startsWith("/")) {
      return `${API_URL}${user.avatar}`;
    }

    // avatar chỉ là filename
    return `${API_URL}/uploads/users/${user.avatar}`;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <Header style={styles.header}>
      {/* LEFT */}
      <Input.Search
        placeholder="Tìm kiếm..."
        allowClear
        style={{ width: 300 }}
      />

      {/* RIGHT */}
      <div style={styles.right}>
        {user ? (
          <Dropdown menu={{ items }} placement="bottomRight">
            <Space style={styles.userBox}>
              <Avatar
                size={40}
                src={avatarUrl}
                icon={!avatarUrl && <UserOutlined />}
                onError={() => true} // fallback về icon nếu lỗi ảnh
                style={{
                  backgroundColor: !avatarUrl ? "#1677ff" : undefined,
                  fontWeight: "bold",
                }}
              >
                {!avatarUrl && user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>

              <div style={{ lineHeight: 1.2 }}>
                <Text strong>{user?.name}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {user?.role}
                </Text>
              </div>
            </Space>
          </Dropdown>
        ) : (
          <Button onClick={() => navigate("/admin/login")}>
            Login
          </Button>
        )}
      </div>
    </Header>
  );
};

/* ================= STYLE ================= */
const styles = {
  header: {
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    borderBottom: "1px solid #eee",
    height: 70,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userBox: {
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: 8,
    transition: "0.2s",
  },
};

export default AppHeader;
