import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";

import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";
import ChatbotComponent from "../../components/chatbot/ChatbotComponent";

const { Content } = Layout;

function MainLayout() {
  const { pathname } = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Nav />
      <Content
        style={{
          padding: "40px",
          minHeight: "80vh",
          background: "#fff"
        }}
      >
        <Outlet />
      </Content>
      <Footer />

      {/* Chatbot tự quản lý logic hiển thị nội bộ */}
      <ChatbotComponent 
        visible={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onOpen={() => setIsChatOpen(true)}
      />
    </Layout>
  );
}

export default MainLayout;