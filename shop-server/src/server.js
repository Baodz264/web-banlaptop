import http from "http";
import { Server } from "socket.io";
import cron from "node-cron"; // Thêm thư viện cron

import app from "./app.js";
import env from "./config/env.config.js";

import sequelize, { connectMySQL } from "./config/mysql.config.js";
import { connectMongo } from "./config/mongo.config.js";

// Load mysql models
import "./database/mysql/index.js";

// Import OrderService để thực hiện quét đơn hàng quá hạn
import OrderService from "../src/modules/orders/order.service.js"; 

// Sockets
import chatSocket from "./sockets/chat.socket.js";
import notificationSocket from "./sockets/notification.socket.js";

const startServer = async () => {
  try {
    // 1. Kết nối Cơ sở dữ liệu
    await connectMySQL();

    if (env.NODE_ENV === "development") {
      // Chỉ sync database trong môi trường dev để tránh mất dữ liệu prod
      await sequelize.sync();
      console.log("✅ MySQL Tables Synced (DEV MODE)");
    }

    await connectMongo();

    // 2. Tạo HTTP Server từ Express App
    const server = http.createServer(app);

    // 3. Khởi tạo Socket.io
    const io = new Server(server, {
      cors: {
        origin: "*", // Cấu hình Cors cho Socket
      },
    });

    io.on("connection", (socket) => {
      console.log("🔌 User connected:", socket.id);

      chatSocket(io, socket);
      notificationSocket(io, socket);

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    // 4. Thiết lập CRON JOB (Tác vụ chạy ngầm)
    // Cấu hình: '*/5 * * * *' nghĩa là cứ mỗi 5 phút chạy một lần
    cron.schedule("*/5 * * * *", async () => {
      console.log("⏲️  [Cron Job] Đang kiểm tra các đơn hàng quá hạn thanh toán...");
      try {
        await OrderService.handleExpiredOrders();
      } catch (err) {
        console.error("❌ [Cron Job Error]:", err.message);
      }
    });

    // 5. Khởi động Server
    const PORT = env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🕒 Auto-cancel task scheduled: Every 5 minutes`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();