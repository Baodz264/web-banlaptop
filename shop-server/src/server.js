import http from "http";
import { Server } from "socket.io";
import cron from "node-cron";

import app from "./app.js";
import env from "./config/env.config.js";

import sequelize, { connectMySQL } from "./config/mysql.config.js";
import { connectMongo } from "./config/mongo.config.js";

import "./database/mysql/index.js";

import OrderService from "../src/modules/orders/order.service.js";

// Sockets
import chatSocket from "./sockets/chat.socket.js";
import notificationSocket from "./sockets/notification.socket.js";

const startServer = async () => {
  try {
    // ================= DB CONNECT =================
    await connectMySQL();

    if (env.NODE_ENV === "development") {
      await sequelize.sync();
      console.log("✅ MySQL Tables Synced (DEV MODE)");
    }

    await connectMongo();

    // ================= HTTP SERVER =================
    const server = http.createServer(app);

    // ================= SOCKET.IO (FIX CHUẨN VPS) =================
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },

      // ⚠️ QUAN TRỌNG: KHÔNG có dấu / cuối
      path: "/socket.io",

      // VPS ổn định
      transports: ["polling", "websocket"],
      allowEIO3: true
    });

    io.on("connection", (socket) => {
      console.log("🔌 User connected:", socket.id);

      chatSocket(io, socket);
      notificationSocket(io, socket);

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    // ================= CRON JOB =================
    cron.schedule("*/5 * * * *", async () => {
      console.log("⏲️ Checking expired orders...");
      try {
        await OrderService.handleExpiredOrders();
      } catch (err) {
        console.error("❌ Cron Error:", err.message);
      }
    });

    // ================= START SERVER =================
    const PORT = env.PORT || 5001;

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 Socket.IO ready at /socket.io`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
