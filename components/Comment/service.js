import Q from "./queries.js";
import POST from "../Post/queries.js";
import { runPoolQuery } from "../../config/db.js";
import CommonUtils from "../../utils/common.js";
import { NotFoundError, ForbiddenError } from "../../utils/errors.js";

class CommentService {
  static async getComments(postId) {
    const comments = await runPoolQuery(Q.GET_COMMENTS, [postId], false);

    if (!comments) {
      throw new NotFoundError("Пост не найден.");
    }

    return comments;
  }

  static async createComment(data) {
    const { postId, comment, nick } = data;

    const post = await runPoolQuery(POST.GET_POST_BY_ID, [postId]);

    if (!post) {
      throw new NotFoundError("Пост не найден.");
    }

    const createdOn = CommonUtils.getCurrentTime();

    const commentId = await runPoolQuery(Q.CREATE_COMMENT, [
      postId,
      comment,
      createdOn,
      nick,
    ]);

    return commentId;
  }

  static async deleteComment(data) {
    const { commentId, nick } = data;
    const comment = await runPoolQuery(Q.GET_COMMENT_BY_ID, [commentId]);

    if (!comment) {
      throw new NotFoundError("Комментарий не найден.");
    }

    if (comment.author_nick !== nick) {
      throw new ForbiddenError("Вам запрещено удалять данный комментарий!");
    }

    await runPoolQuery(Q.DELETE_COMMENT_BY_ID, [commentId]);
  }
}

export default CommentService;
