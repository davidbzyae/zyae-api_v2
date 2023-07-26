import { Server } from "http";
import { Server as SocketServer } from "socket.io";

export let io: SocketServer;

export const socketLoader = ({
  httpServer,
}: {
  httpServer: Server;
}): SocketServer => {
  const ioOptions = {
    cors: {
      origin: ["https://zyae.net", "https://zyae.net:3000", "127.0.0.1"],
    },
    path: "/ws",
  };

  io = new SocketServer(httpServer, ioOptions);

  io.on("connection", (socket) => {});

  return io;
};
