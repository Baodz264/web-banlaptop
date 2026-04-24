import React from "react";
import { Card } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AuthLayout = () => {

  const location = useLocation();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999
      }}
    >

      <Card
        style={{
          width: 420,
          borderRadius: 14,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
        }}
        bodyStyle={{ padding: 32 }}
      >

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>

      </Card>

    </div>
  );
};

export default AuthLayout;
