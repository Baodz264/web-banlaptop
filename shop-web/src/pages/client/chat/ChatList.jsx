import { useEffect, useState } from "react";
import { Avatar, Typography, Skeleton, message, Badge } from "antd";

import userService from "../../../services/user.service";
import chatService from "../../../services/chat.service";

import socket from "../../../socket/socket";
import { useAuth } from "../../../context/AuthContext";

const { Text } = Typography;

const API_URL = "http://tbtshoplt.xyz";

const ChatList = ({ onSelectChat, currentChat }) => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState({});

  // =================================
  // LOAD ADMIN + STAFF
  // =================================
  useEffect(() => {
    loadSupportUsers();
  }, []);

  const loadSupportUsers = async () => {
    try {
      setLoading(true);

      const res = await userService.getUsers();

      const raw = res?.data?.data || res?.data || [];

      const allUsers = Array.isArray(raw)
        ? raw
        : raw?.items || raw?.users || [];

      const supportUsers = allUsers.filter((u) =>
        ["admin", "staff"].includes(u?.role)
      );

      setUsers(supportUsers);
    } catch (error) {
      console.error(error);
      message.error("Load users failed");
    } finally {
      setLoading(false);
    }
  };

  // =================================
  // SOCKET NEW MESSAGE (🔥 FIX CHÍNH)
  // =================================
  useEffect(() => {
    const handleNewMessage = (data) => {
      if (!data) return;

      const { chat_id, sender_id, admin_id } = data;

      // 👉 bỏ qua tin của chính mình
      if (sender_id === currentUser?.id) return;

      // 👉 nếu đang mở chat thì không tăng unread
      if (currentChat && chat_id === currentChat._id) return;

      // 🔥 LUÔN dùng admin_id (KHÔNG dùng sender_id)
      const supportId = admin_id;

      if (!supportId) return;

      // =========================
      // UPDATE UNREAD
      // =========================
      setUnread((prev) => ({
        ...prev,
        [supportId]: (prev[supportId] || 0) + 1,
      }));

      // =========================
      // MOVE USER TO TOP
      // =========================
      setUsers((prevUsers) => {
        const index = prevUsers.findIndex((u) => u.id === supportId);
        if (index === -1) return prevUsers;

        const updated = [...prevUsers];
        const user = updated[index];

        updated.splice(index, 1);
        updated.unshift(user);

        return updated;
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [currentChat, currentUser]);

  // =================================
  // OPEN CHAT
  // =================================
  const handleSelectUser = async (user) => {
    if (!currentUser) {
      message.error("User not logged in");
      return;
    }

    try {
      const res = await chatService.getChats({
        customer_id: currentUser.id,
        admin_id: user.id,
      });

      const chats =
        res?.data?.data?.items ||
        res?.data?.data ||
        [];

      let chat = Array.isArray(chats) ? chats[0] : null;

      if (!chat) {
        const createRes = await chatService.createChat({
          customer_id: currentUser.id,
          admin_id: user.id,
        });

        chat = createRes?.data?.data;
      }

      // reset unread
      setUnread((prev) => ({
        ...prev,
        [user.id]: 0,
      }));

      onSelectChat(chat);
    } catch (error) {
      console.error(error);
      message.error("Cannot open chat");
    }
  };

  // =================================
  // LOADING
  // =================================
  if (loading) {
    return <Skeleton active />;
  }

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
              currentChat?.admin_id === user.id
                ? "#f5f5f5"
                : "transparent",
            transition: "0.2s",
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

          <div style={{ lineHeight: 1.3 }}>
            <Text strong>{user.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user.email}
            </Text>
          </div>
        </div>
      ))}

      {users.length === 0 && (
        <div
          style={{
            padding: 20,
            textAlign: "center",
            color: "#999",
          }}
        >
          Không có admin hoặc staff
        </div>
      )}
    </div>
  );
};

export default ChatList;
