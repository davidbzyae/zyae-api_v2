import "module-alias/register";

import express from "express";
import http from "http";

import config from "@/config";

import { loaders, Logger } from "./loaders";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  loaders({
    app,
    httpServer,
  });

  httpServer
    .listen(config.port, () => {
      Logger.info(
        `zyae-api_v2 started in ${process.env.NODE_ENV} mode on port: ${config.port}`
      );
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });
}
startServer();
