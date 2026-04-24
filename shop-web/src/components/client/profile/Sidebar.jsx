import { Card, Avatar, Typography, Space, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const API_URL = "http://tbtshoplt.xyz";

// 🔥 Hàm xử lý avatar
const getAvatarUrl = (avatar) => {
  if (!avatar) return null;

  if (avatar.startsWith("http")) {
    return avatar;
  }

  if (avatar.startsWith("/")) {
    return `${API_URL}${avatar}`;
  }

  return `${API_URL}/uploads/users/${avatar}`;
};

export default function Sidebar({ user }) {
  const avatarUrl = getAvatarUrl(user?.avatar);

  return (
    <Card
      style={{
        textAlign: "center",
        borderRadius: 24,
        border: "none",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.04)",
        background: "#ffffff",
        minHeight: "450px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      // ✅ Chuẩn Antd v5: Dùng styles.body thay cho bodyStyle
      styles={{
        body: { padding: "40px 24px" },
      }}
    >
      {/* ✅ Sửa lỗi: Thay direction="vertical" bằng orientation="vertical" 
          theo cảnh báo của console 
      */}
      <Space orientation="vertical" size={32} style={{ width: "100%" }}>
        
        {/* AVATAR SECTION */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <Badge
            dot
            status="success"
            offset={[-12, 95]}
            style={{
              width: 18,
              height: 18,
              border: "3px solid #fff",
              boxShadow: "0 0 0 2px rgba(82, 196, 26, 0.2)",
            }}
          >
            <Avatar
              size={120}
              src={avatarUrl}
              icon={!avatarUrl && <UserOutlined />}
              style={{
                border: "1px solid #f0f0f0",
                padding: "4px",
                background: "#fff",
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              }}
            >
              {!avatarUrl && user?.name?.charAt(0)}
            </Avatar>
          </Badge>
        </div>

        {/* INFO SECTION */}
        <div style={{ marginTop: 4 }}>
          <Title
            level={3}
            style={{ margin: 0, fontWeight: 800, color: "#141414" }}
          >
            {user?.name || "Người dùng"}
          </Title>

          {/* STATUS */}
          <Space align="center" style={{ marginTop: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#52c41a",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#52c41a",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Active Now
            </Text>
          </Space>

          {/* EMAIL */}
          <Text
            type="secondary"
            style={{
              fontSize: 14,
              display: "block",
              marginTop: 16,
              color: "#8c8c8c",
              wordBreak: "break-all"
            }}
          >
            {user?.email || "No email"}
          </Text>
        </div>
      </Space>
    </Card>
  );
}