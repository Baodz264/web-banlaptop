import { io } from "socket.io-client";

const socket = io("https://tbtshoplt.xyz", {
  path: "/socket.io",
  transports: ["polling", "websocket"],
});

export default socket;
