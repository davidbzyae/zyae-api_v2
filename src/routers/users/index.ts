import { Router } from "express";

import middleware from "@/shared/middleware";

import controllers from "./controllers";

const route = Router();

route.get("/me", middleware.attachSession(), controllers.getMe);
route.get("/:userId", middleware.attachSession(), controllers.getUser);
route.post("/", controllers.createUser);

export { route as usersRouter };
