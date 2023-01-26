import COMMENT_QUERIES from "./queries.js";
import POST_QUERIES from "../Post/queries.js";
import { runPoolQuery } from "../../config/db.js";
import getCurrentTime from "../../utils/getCurrentTime.js";
import { NotFoundError, ForbiddenError } from "../../utils.js";

class CommentService {
  static async getComments(postId) {
    const comments = await runPoolQuery(COMMENT_QUERIES.GET_COMMENTS, [postId], false);

    if (!comments) {
      throw new NotFoundError("Пост не найден.");
    }

    return comments;
  }

  static async createComment(data) {
    const { postId, comment, nick } = data;

    const post = await runPoolQuery(POST_QUERIES.GET_POST_BY_ID, [postId]);

    if (!post) {
      throw new NotFoundError("Пост не найден.");
    }

    const createdOn = getCurrentTime();

    const commentId = await runPoolQuery(COMMENT_QUERIES.CREATE_COMMENT, [
      postId,
      comment,
      createdOn,
      nick,
    ]);

    return commentId;
  }

  static async deleteComment(data) {
    const { commentId, nick } = data;
    const comment = await runPoolQuery(COMMENT_QUERIES.GET_COMMENT_BY_ID, [commentId]);

    if (!comment) {
      throw new NotFoundError("Комментарий не найден.");
    }

    if (comment.author_nick !== nick) {
      throw new ForbiddenError("Вам запрещено удалять данный комментарий!");
    }

    await runPoolQuery(COMMENT_QUERIES.DELETE_COMMENT_BY_ID, [commentId]);
  }
}

export default CommentService;
