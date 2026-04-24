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

const ChatBox = ({ chat }) => {
  const { user: currentUser } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [customer, setCustomer] = useState(null);

  const bottomRef = useRef(null);

  // ================= FIX ID (QUAN TRỌNG) =================
  const getId = (u) => u?.id; // ❗ MYSQL ONLY, KHÔNG MIX _id

  const currentUserId = getId(currentUser);
  const currentRole = currentUser?.role;

  // ================= SCROLL =================
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  // ================= RECEIVE MESSAGE =================
  const handleReceiveMessage = useCallback(
    (msg) => {
      if (!chat?._id) return;
      if (msg.chat_id?.toString() !== chat._id?.toString()) return;

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;

        return [...prev, msg].sort(
          (a, b) =>
            new Date(a.created_at || a.createdAt) -
            new Date(b.created_at || b.createdAt)
        );
      });
    },
    [chat]
  );

  // ================= LOAD CUSTOMER =================
  const loadCustomer = useCallback(async () => {
    if (!chat?.customer_id) return;

    try {
      const res = await userService.getUserById(chat.customer_id);
      setCustomer(res?.data?.data);
    } catch (err) {
      console.error("Error loading user:", err);
    }
  }, [chat?.customer_id]);

  // ================= LOAD MESSAGES =================
  const loadMessages = useCallback(async () => {
    if (!chat?._id) return;

    try {
      setLoading(true);

      const res = await MessageService.getMessages({
        chat_id: chat._id,
      });

      const data = res?.data?.data?.data || [];

      setMessages(
        data.sort(
          (a, b) =>
            new Date(a.created_at || a.createdAt) -
            new Date(b.created_at || b.createdAt)
        )
      );
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  }, [chat?._id]);

  // ================= SOCKET INIT =================
  useEffect(() => {
    if (!chat?._id) return;

    setMessages([]);
    loadMessages();
    loadCustomer();

    socket.emit("join_chat", chat._id);

    socket.off("receive_message");
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.emit("leave_chat", chat._id);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [chat?._id, loadMessages, loadCustomer, handleReceiveMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ================= SEND TEXT =================
  const sendMessage = () => {
    if (!text.trim() || !chat?._id) return;

    socket.emit("send_message", {
      chat_id: chat._id,
      sender_id: currentUserId,        // ✅ FIX
      sender_role: currentRole,        // ✅ FIX
      message: text,
      message_type: "text",
      attachments: [],
    });

    setText("");
  };

  // ================= UPLOAD IMAGE =================
  const uploadProps = {
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        if (!chat?._id) return;

        // 1. create message
        const msgRes = await MessageService.createMessage({
          chat_id: chat._id,
          sender_id: currentUserId,
          sender_role: currentRole,
          message: "",
          message_type: "image",
        });

        const messageData = msgRes?.data?.data;

        // 2. upload attachment
        const formData = new FormData();
        formData.append("message_id", messageData._id);
        formData.append("file_type", "image");
        formData.append("file_name", file.name);
        formData.append("file", file);

        const res = await AttachmentService.createAttachment(formData);
        const attachment = res?.data?.data;

        // 3. emit realtime
        socket.emit("send_message", {
          ...messageData,
          sender_id: currentUserId,
          sender_role: currentRole,
          message_type: "image",
          attachments: [attachment],
        });

        onSuccess("ok");
      } catch (err) {
        console.error(err);
        message.error("Upload image failed");
        onError(err);
      }
    },
  };

  // ================= EMPTY =================
  if (!chat) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Text type="secondary">Select a chat to start messaging</Text>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "#f0f2f5",
    }}>
      
      {/* HEADER */}
      <div style={{
        padding: "12px 16px",
        background: "#fff",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <Avatar
          size={40}
          src={
            customer?.avatar
              ? customer.avatar.startsWith("http")
                ? customer.avatar
                : `${API_URL}${customer.avatar}`
              : undefined
          }
        >
          {customer?.name?.charAt(0)?.toUpperCase()}
        </Avatar>

        <Text strong style={{ fontSize: 16 }}>
          {customer?.name || "Customer"}
        </Text>
      </div>

      {/* MESSAGE LIST */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px 16px",
      }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg._id}
              message={msg}
              currentUserId={currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={{
        padding: 12,
        background: "#fff",
        borderTop: "1px solid #eee",
      }}>
        <Space.Compact style={{ width: "100%" }}>
          <Upload {...uploadProps}>
            <Button
              type="text"
              icon={<PictureOutlined style={{ fontSize: 20 }} />}
            />
          </Upload>

          <Input
            placeholder="Aa"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPressEnter={sendMessage}
          />

          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={sendMessage}
            disabled={!text.trim()}
          />
        </Space.Compact>
      </div>
    </div>
  );
};

export default ChatBox;
