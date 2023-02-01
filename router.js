import express, { Router } from "express";
import PostRoutes from "./components/Post/routes.js";

const rootRouter = Router();

rootRouter.use("/post", PostRoutes);
rootRouter.use("/image", express.static("public"));

export default rootRouter;
