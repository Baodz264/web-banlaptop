import { useEffect, useState, useRef, useCallback } from "react";
import {
  Avatar,
  Typography,
  Input,
  Button,
  Upload,
  Space,
  Skeleton,
  message,
} from "antd";

import { SendOutlined, PictureOutlined } from "@ant-design/icons";

import MessageItem from "./MessageItem";

import MessageService from "../../../services/message.service";
import AttachmentService from "../../../services/attachment.service";
import userService from "../../../services/user.service";

import socket from "../../../socket/socket";
import { useAuth } from "../../../context/AuthContext";

const { Text } = Typography;
const API_URL = "http://tbtshoplt.xyz";

/* ================= SORT ================= */
const sortMessages = (arr) =>
  [...arr].sort(
    (a, b) =>
      new Date(a.created_at || a.createdAt) -
      new Date(b.created_at || b.createdAt)
  );

const ChatBox = ({ chat }) => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [admin, setAdmin] = useState(null);

  const containerRef = useRef(null);

  /* ================= SCROLL ================= */
  const scrollToBottom = useCallback((smooth = true) => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const isNearBottom = () => {
    const el = containerRef.current;
    if (!el) return true;

    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  /* ================= RECEIVE MESSAGE ================= */
  const handleReceiveMessage = useCallback(
    (msg) => {
      if (!chat?._id) return;
      if (msg.chat_id?.toString() !== chat._id?.toString()) return;

      setMessages((prev) => {
        const exists = prev.some(
          (m) => String(m._id) === String(msg._id)
        );
        if (exists) return prev;

        return sortMessages([...prev, msg]);
      });

      if (isNearBottom()) {
        scrollToBottom();
      }
    },
    [chat, scrollToBottom]
  );

  /* ================= LOAD ADMIN (🔥 FIX CHÍNH) ================= */
  const loadAdmin = useCallback(async () => {
    if (!chat?.admin_id) return;

    try {
      // ✅ lấy đúng 1 user theo id
      const res = await userService.getUserById(chat.admin_id);

      const userData = res?.data?.data;

      setAdmin(userData || null);
    } catch (err) {
      console.error("Load Admin Error:", err);
    }
  }, [chat]);

  /* ================= LOAD MESSAGES ================= */
  const loadMessages = useCallback(async () => {
    if (!chat?._id) return;

    try {
      setLoading(true);

      const res = await MessageService.getMessages({
        chat_id: chat._id,
      });

      const data = res?.data?.data?.data || [];

      setMessages(sortMessages(data));

      setTimeout(() => scrollToBottom(false), 100);
    } catch (err) {
      console.error("Load Messages Error:", err);
    } finally {
      setLoading(false);
    }
  }, [chat?._id, scrollToBottom]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!chat?._id) return;

    setMessages([]);

    loadMessages();
    loadAdmin();

    socket.emit("join_chat", chat._id);

    socket.off("receive_message");
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [chat?._id, loadMessages, loadAdmin, handleReceiveMessage]);

  /* ================= SEND TEXT ================= */
  const sendMessage = () => {
    if (!text.trim() || !chat?._id) return;

    socket.emit("send_message", {
      chat_id: chat._id,
      sender_id: user?.id,
      message: text,
      message_type: "text",
      attachments: [],
    });

    setText("");
    scrollToBottom();
  };

  /* ================= UPLOAD IMAGE ================= */
  const uploadProps = {
    showUploadList: false,

    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        if (!chat?._id) return;

        const msgRes = await MessageService.createMessage({
          chat_id: chat._id,
          sender_id: user?.id,
          message: "",
          message_type: "image",
        });

        const messageData = msgRes?.data?.data;

        const formData = new FormData();
        formData.append("message_id", messageData._id);
        formData.append("file_type", "image");
        formData.append("file_name", file.name);
        formData.append("file", file);

        const attachRes = await AttachmentService.createAttachment(formData);
        const attachment = attachRes?.data?.data;

        socket.emit("send_message", {
          chat_id: chat._id,
          sender_id: user?.id,
          message: "",
          message_type: "image",
          attachments: [attachment],
        });

        scrollToBottom();

        onSuccess("ok");
      } catch (err) {
        console.error(err);
        message.error("Upload image failed");
        onError(err);
      }
    },
  };

  /* ================= EMPTY ================= */
  if (!chat) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Text type="secondary">
          Chọn một cuộc trò chuyện để bắt đầu
        </Text>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0f2f5" }}>

      {/* HEADER */}
      <div style={{ padding: 16, background: "#fff", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar
          size={40}
          src={
            admin?.avatar
              ? admin.avatar.startsWith("http")
                ? admin.avatar
                : `${API_URL}${admin.avatar}`
              : null
          }
        />

        <Text strong style={{ fontSize: 16 }}>
          {admin?.name || "User"}
        </Text>
      </div>

      {/* MESSAGE */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflowY: "auto", padding: "20px" }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg._id}
              message={msg}
              currentUserId={user?.id}
              currentRole={user?.role}
            />
          ))
        )}
      </div>

      {/* INPUT */}
      <div style={{ padding: 12, background: "#fff", borderTop: "1px solid #eee" }}>
        <Space style={{ width: "100%" }}>
          <Upload {...uploadProps}>
            <Button shape="circle" icon={<PictureOutlined />} />
          </Upload>

          <Input
            placeholder="Nhắn tin..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPressEnter={sendMessage}
            style={{ borderRadius: 20, flex: 1 }}
          />

          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={sendMessage}
            disabled={!text.trim()}
          />
        </Space>
      </div>
    </div>
  );
};

export default ChatBox;
