import path from "path";
import { Router } from "express";
const router = new Router();
import config from "./../config/config";

export default router.get("/*", function(req, res, next) {
  console.log("enter to index");
  res.sendFile(path.join(config.publicPath, "index.html"));
  // next();
});
