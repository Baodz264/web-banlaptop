import { Row, Col } from "antd"; // Đã xóa 'Card' vì không dùng đến
import { useState } from "react";

import ChatList from "./ChatList";
import ChatBox from "./ChatBox";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div
      style={{
        height: "calc(100vh - 64px)", // Trừ đi chiều cao Header nếu có
        background: "#f0f2f5",
        display: "flex",
        alignItems: "center", // Căn giữa theo chiều dọc
        justifyContent: "center", // Căn giữa theo chiều ngang
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px", // Giới hạn độ rộng tối đa
          height: "85vh", // Chiều cao cố định cho khung chat
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Đổ bóng nhẹ
          overflow: "hidden",
        }}
      >
        <Row style={{ height: "100%" }}>
          {/* DANH SÁCH CHAT */}
          <Col
            xs={8}
            sm={7}
            md={6}
            style={{
              borderRight: "1px solid #f0f0f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px",
                fontWeight: "bold",
                fontSize: "18px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              Tin nhắn
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              <ChatList onSelectChat={setSelectedChat} />
            </div>
          </Col>

          {/* KHUNG NỘI DUNG CHAT */}
          <Col
            xs={16}
            sm={17}
            md={18}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: "#fafafa",
            }}
          >
            {selectedChat ? (
              <ChatBox chat={selectedChat} />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#8c8c8c",
                  fontSize: "16px",
                }}
              >
                Chọn một cuộc trò chuyện để bắt đầu
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ChatPage;