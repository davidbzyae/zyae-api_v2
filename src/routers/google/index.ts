import { Router } from "express";
import controllers from "./controllers";

const route = Router();

route.get("/url", controllers.getUrl);
route.get("/cb", controllers.cb);

export { route as googleRouter };
