import { useEffect, useState } from "react";
import { Avatar, Typography, Skeleton, message, Badge } from "antd";

import userService from "../../../services/user.service";
import chatService from "../../../services/chat.service";
import socket from "../../../socket/socket";
import { useAuth } from "../../../context/AuthContext";

const { Text } = Typography;

const API_URL = "http://tbtshoplt.xyz";

const ChatList = ({ onSelectChat, currentChat }) => {
  const { user: currentUser } = useAuth(); // 🔥 lấy user login

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState({});

  // ===============================
  // LOAD CUSTOMERS
  // ===============================
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await userService.getUsers();

        const raw = res?.data?.data || res?.data || [];
        const allUsers = Array.isArray(raw)
          ? raw
          : raw?.items || [];

        const customers = allUsers.filter(
          (u) => u.role === "customer"
        );

        setUsers(customers);
      } catch (error) {
        message.error("Tải danh sách khách hàng thất bại");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // ===============================
  // SOCKET NEW MESSAGE
  // ===============================
  useEffect(() => {
    const handleNewMessage = (data) => {
      if (!data) return;

      const senderId = data.sender_id;

      // 👉 bỏ qua tin của chính mình
      if (senderId === currentUser?.id) return;

      // 👉 đang mở chat thì không unread
      if (currentChat && data.chat_id === currentChat.id) return;

      const existUser = users.find((u) => u.id === senderId);
      if (!existUser) return;

      setUnread((prev) => ({
        ...prev,
        [senderId]: (prev[senderId] || 0) + 1,
      }));

      setUsers((prevUsers) => {
        const index = prevUsers.findIndex((u) => u.id === senderId);
        if (index === -1) return prevUsers;

        const updated = [...prevUsers];
        const [user] = updated.splice(index, 1);
        updated.unshift(user);
        return updated;
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [currentChat, users, currentUser]);

  // ===============================
  // OPEN CHAT (🔥 FIX CHÍNH)
  // ===============================
  const handleSelectUser = async (user) => {
    try {
      const res = await chatService.getChats({
        customer_id: user.id,
        admin_id: currentUser.id, // 🔥 FIX
      });

      const chats =
        res?.data?.data?.items ||
        res?.data?.data ||
        [];

      let chat = Array.isArray(chats) ? chats[0] : null;

      if (!chat) {
        const createRes = await chatService.createChat({
          customer_id: user.id,
          admin_id: currentUser.id, // 🔥 FIX
        });

        chat = createRes?.data?.data;
      }

      setUnread((prev) => ({
        ...prev,
        [user.id]: 0,
      }));

      onSelectChat(chat);
    } catch (error) {
      message.error("Không thể mở cuộc hội thoại");
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => handleSelectUser(user)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 14,
            cursor: "pointer",
            borderBottom: "1px solid #f0f0f0",
            background:
              currentChat?.customer_id === user.id
                ? "#f5f5f5"
                : "transparent",
          }}
        >
          <Badge count={unread[user.id]} overflowCount={99}>
            <Avatar
              size={40}
              src={
                user.avatar
                  ? user.avatar.startsWith("http")
                    ? user.avatar
                    : `${API_URL}${user.avatar}`
                  : undefined
              }
            >
              {user.name?.charAt(0)}
            </Avatar>
          </Badge>

          <div style={{ lineHeight: 1.3, flex: 1 }}>
            <Text strong>{user.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user.email}
            </Text>
          </div>
        </div>
      ))}

      {users.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "#999" }}>
          Chưa có khách hàng nào
        </div>
      )}
    </div>
  );
};

export default ChatList;
