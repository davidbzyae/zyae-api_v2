import { Router } from "express";
import controllers from "./controllers";
import middleware from "@/shared/middleware";

1;
const route = Router();

route.get("/me", middleware.attachSession(), controllers.getMe);
route.get("/:userId", middleware.attachSession(), controllers.getUser);
route.post("/", controllers.createUser);

export { route as usersRouter };
