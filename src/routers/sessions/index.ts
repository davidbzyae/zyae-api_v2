import { Router } from "express";

import middleware from "@/shared/middleware";

import controllers from "./controllers";

const route = Router();

route.post("/", controllers.createSession);
route.post("/clients", middleware.attachSession(), controllers.appendClient);
route.delete("/", middleware.attachSession(), controllers.deleteSession);

export { route as sessionsRouter };
