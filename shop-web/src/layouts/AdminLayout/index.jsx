import React, { useEffect } from "react";
import { Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const { Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <Sidebar />

      <Layout>

        {/* Header */}
        <Header />

        {/* Main Content */}
        <Content
          style={{
            margin: "20px",
            padding: "20px",
            background: "#fff",
            borderRadius: "8px",
            minHeight: "280px",
          }}
        >
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer />

      </Layout>
    </Layout>
  );
};

export default AdminLayout;
