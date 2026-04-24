import { Avatar } from "antd";
import { useAuth } from "../../../context/AuthContext";

const API_URL = "http://tbtshoplt.xyz";

const MessageItem = ({ message }) => {
  const { user } = useAuth();

  /* ================= FIX isMe ================= */
  const isMe = String(message.sender_id) === String(user?.id);

  /* ================= ROLE ================= */
  const role = message.sender_role || message.role;

  const isAdmin = role === "admin";
  const isStaff = role === "staff";

  const attachments = message?.attachments || [];

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        marginBottom: 14,
        alignItems: "flex-end",
      }}
    >
      {/* AVATAR */}
      {!isMe && (
        <Avatar size={32} style={{ marginRight: 8 }}>
          {isAdmin ? "A" : isStaff ? "S" : "?"}
        </Avatar>
      )}

      {/* MESSAGE */}
      <div
        style={{
          maxWidth: "65%",

          background: isMe
            ? "#1677ff" // mình
            : isAdmin
            ? "#52c41a" // admin
            : isStaff
            ? "#faad14" // staff
            : "#ffffff",

          color: isMe ? "#fff" : "#000",

          padding: "10px 14px",
          borderRadius: 18,
          boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
          wordBreak: "break-word",
        }}
      >
        {/* TEXT */}
        {message?.message && (
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            {message.message}
          </div>
        )}

        {/* IMAGE */}
        {attachments.map((att) => {
          if (!att.file_url) return null;

          return (
            <img
              key={att._id}
              src={getImageUrl(att.file_url)}
              alt="chat"
              style={{
                maxWidth: 220,
                borderRadius: 12,
                marginTop: 8,
                display: "block",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MessageItem;
