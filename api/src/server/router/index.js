import { Router } from "express";
import siteRoute from "./siteRoute";
import apiRoutes from "./apiRoutes";

const router = new Router();

router.use("/api", apiRoutes);
// router.use(siteRoute)

export default router;
