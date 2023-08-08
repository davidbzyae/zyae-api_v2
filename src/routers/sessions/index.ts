import { Router } from "express";
import controllers from "./controllers";
import middleware from "@/shared/middleware";

const route = Router();

route.post("/", controllers.createSession);
route.post("/clients", middleware.attachSession(), controllers.appendClient);
route.delete("/", middleware.attachSession(), controllers.deleteSession);

export { route as sessionsRouter };
