import { io } from "socket.io-client";

const socket = io("https://sangolacollage.onrender.com", {
  transports: ["websocket"]
});

export default socket;