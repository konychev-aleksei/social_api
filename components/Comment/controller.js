import CommentService from "./service.js";
import ErrorsUtils from "../../utils/errors.js";
import CommonUtils from "../../utils/common.js";

class CommentController {
  static async getByPostId(req, res) {
    const postId = req.query.postId;
    try {
      const post = await CommentService.getComments(postId);

      return res.status(200).json(post);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async create(req, res) {
    const postId = req.query.id;
    const comment = req.body.comment;
    const nick = CommonUtils.getNick(req.headers.token);
    try {
      const data = { postId, comment, nick };
      const commentId = await CommentService.createComment(data);

      return res.status(200).json(commentId);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async deleteById(req, res) {
    const commentId = req.query.id;
    const nick = CommonUtils.getNick(req.headers.token);
    try {
      const data = { commentId, nick };
      await CommentService.deleteComment(data);

      return res.sendStatus(200);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }
}

export default CommentController;
