import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Shipper gửi vị trí
    socket.on("shipperLocation", (data) => {
      /*
      data = {
        shipment_id: 1,
        latitude: 10.776,
        longitude: 106.700
      }
      */

      io.emit("updateShipperLocation", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export const getIO = () => io;
