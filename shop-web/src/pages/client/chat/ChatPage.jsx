import React, { useState } from "react";
import { Row, Col, Typography } from "antd";
import { EditOutlined, MessageFilled } from "@ant-design/icons";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";

const { Title, Text } = Typography;

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div
      style={{
        height: "calc(100vh - 160px)", // Trừ đi chiều cao Header để fit màn hình
        margin: "20px auto",
        maxWidth: "1200px",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          height: "100%",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          display: "flex",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        <Row style={{ width: "100%", height: "100%", margin: 0 }}>
          {/* --- SIDEBAR: DANH SÁCH CHAT --- */}
          <Col
            xs={selectedChat ? 0 : 24}
            sm={9}
            md={8}
            lg={7}
            style={{
              borderRight: "1px solid #f0f0f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: "#fafafa", // Màu nền sidebar hơi xám để tách biệt
            }}
          >
            <div
              style={{
                padding: "24px",
                background: "#fff",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                Đoạn chat
              </Title>
              <div 
                style={{ 
                  width: 36, height: 36, borderRadius: '50%', background: '#f0f2f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <EditOutlined style={{ fontSize: 18 }} />
              </div>
            </div>

            <div className="chat-list-container" style={{ flex: 1, overflowY: "auto" }}>
              <ChatList
                onSelectChat={setSelectedChat}
                selectedId={selectedChat?.id}
              />
            </div>
          </Col>

          {/* --- MAIN: NỘI DUNG CHAT --- */}
          <Col
            xs={selectedChat ? 24 : 0}
            sm={15}
            md={16}
            lg={17}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: "#fff",
            }}
          >
            {selectedChat ? (
              <ChatBox
                chat={selectedChat}
                onBack={() => setSelectedChat(null)}
              />
            ) : (
              /* Màn hình trống (Empty State) */
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  background: "#fff",
                  textAlign: "center",
                  padding: "0 20px"
                }}
              >
                <div style={{ 
                  width: 120, height: 120, background: '#f6ffed', 
                  borderRadius: '50%', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', marginBottom: 20 
                }}>
                  <MessageFilled style={{ fontSize: 60, color: "#52c41a" }} />
                </div>
                <Title level={3} style={{ marginBottom: 8 }}>Chọn một cuộc trò chuyện</Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  Kết nối với người bán để được hỗ trợ về sản phẩm
                </Text>
              </div>
            )}
          </Col>
        </Row>
      </div>

      <style>{`
        .chat-list-container::-webkit-scrollbar {
          width: 5px;
        }
        .chat-list-container::-webkit-scrollbar-thumb {
          background: #e8e8e8;
          border-radius: 10px;
        }
        .ant-list-item-meta-title { font-weight: 600; }
      `}</style>
    </div>
  );
};

export default ChatPage;