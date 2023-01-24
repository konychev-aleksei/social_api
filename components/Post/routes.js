import { Router } from "express";
import PostController from "./controller.js";
import PostValidator from "./validator.js";

const router = Router();

router.get("/search", PostValidator.search, PostController.search);
router.get("/index", PostValidator.getByNick, PostController.getByNick);

router.get("/get", PostValidator.getById, PostController.getById);
router.post("/create", PostValidator.create, PostController.create);
router.put("/update", PostValidator.updateById, PostController.updateById);
router.delete("/delete", PostValidator.deleteById, PostController.deleteById);

router.patch(
  "/toggle-like",
  PostValidator.toggleLikeById,
  PostController.toggleLikeById
);

export default router;
