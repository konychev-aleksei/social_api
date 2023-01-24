import { Router } from "express";
import CommentController from "./controller.js";
import CommentValidator from "./validator.js";

const router = Router();

router.get("/get", CommentValidator.getByPostId, CommentController.getByPostId);
router.post("/create", CommentValidator.create, CommentController.create);
router.delete(
  "/delete",
  CommentValidator.deleteById,
  CommentController.deleteById
);

export default router;
