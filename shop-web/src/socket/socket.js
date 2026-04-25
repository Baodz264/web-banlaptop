import { io } from "socket.io-client";

const socket = io("http://tbtshoplt.xyz", {
  path: "/socket.io",
  transports: ["websocket", "polling"],
  withCredentials: true
});

export default socket;
