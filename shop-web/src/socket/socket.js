import { io } from "socket.io-client";

const socket = io("http://tbtshoplt.xyz", {
  transports: ["websocket"],
});

export default socket;
