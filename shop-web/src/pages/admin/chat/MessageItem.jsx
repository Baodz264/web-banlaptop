import { Avatar } from "antd";

const API_URL = "http://tbtshoplt.xyz";

const MessageItem = ({ message, currentUserId }) => {
  const isMine =
    String(message.sender_id) === String(currentUserId);

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
        justifyContent: isMine ? "flex-end" : "flex-start",
        marginBottom: 14,
        alignItems: "flex-end",
      }}
    >
      {/* Avatar bên trái (chỉ người khác) */}
      {!isMine && (
        <Avatar
          size={32}
          style={{
            marginRight: 8,
            flexShrink: 0,
          }}
        />
      )}

      <div
        style={{
          maxWidth: "65%",
          background: isMine ? "#1677ff" : "#ffffff",
          color: isMine ? "#fff" : "#000",
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

        {/* IMAGES */}
        {attachments.length > 0 &&
          attachments.map((att) => {
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
