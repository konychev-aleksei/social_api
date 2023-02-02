import QUERIES from "./queries.js";
import { runPoolQuery } from "../../config/db.js";
import CommonUtils from "../../utils/common.js";
import { NotFoundError, ForbiddenError } from "../../utils/errors.js";

class PostService {
  static async getPostInfo(data) {
    const { postId, nick } = data;
    const post = await runPoolQuery(QUERIES.GET_POST_BY_ID, [postId]);

    if (!post) {
      throw new NotFoundError("Пост не найден.");
    }

    const isLiked = await runPoolQuery(QUERIES.GET_IS_LIKED, [postId, nick]);
    const is_liked = Boolean(isLiked);

    const likesCount = await runPoolQuery(QUERIES.GET_LIKES_COUNT, [postId]);
    const likes_count = Number(likesCount.count);

    const created_on = CommonUtils.formatTime(post.created_on);
    const tags = post.tags.split("").map((tag) => Number(tag));

    return { ...post, is_liked, likes_count, tags, created_on };
  }

  static async getPosts(tag = "") {
    const response = await runPoolQuery(QUERIES.SEARCH, [tag], false);
    return response;
  }

  static async createPost(data) {
    const { post, nick } = data;
    const { image, description } = post;

    const tagsFormatted = post.tags?.sort((a, b) => a - b).join("") || "";
    const createdOn = CommonUtils.getCurrentTime();

    const { id } = await runPoolQuery(QUERIES.CREATE_POST, [
      description,
      tagsFormatted,
      createdOn,
      nick,
    ]);

    await CommonUtils.saveImageById(image, id);

    return id;
  }

  static async updatePost(data) {
    const { postId, nick, post } = data;
    const { image, description } = post;

    const tags = (post.tags ?? []).sort((a, b) => a - b).join("");
    const postInfo = await runPoolQuery(QUERIES.GET_POST_BY_ID, [postId]);

    if (!postInfo) {
      throw new NotFoundError("Пост не найден.");
    }

    if (postInfo.author_nick !== nick) {
      throw new ForbiddenError("Вам запрещено редактировать данный пост!");
    }

    if (image) {
      await CommonUtils.saveImageById(image, postId);
    }

    const updatedPost = await runPoolQuery(QUERIES.UPDATE_POST_BY_ID, [
      description,
      tags,
      postId,
    ]);

    return updatedPost;
  }

  static async deletePost(data) {
    const { postId, nick } = data;
    const postInfo = await runPoolQuery(QUERIES.GET_POST_BY_ID, [postId]);

    if (!postInfo) {
      throw new NotFoundError("Пост не найден.");
    }

    if (postInfo.author_nick !== nick) {
      throw new ForbiddenError("Вам запрещено удалять данный пост!");
    }

    await runPoolQuery(QUERIES.DELETE_POST_BY_ID, [postId]);
    await CommonUtils.deleteImageById(postId);
  }

  static async toggleLikePost(data) {
    const { postId, nick } = data;
    const postInfo = await runPoolQuery(QUERIES.GET_POST_BY_ID, [postId]);

    if (!postInfo) {
      throw new NotFoundError("Пост не найден.");
    }

    if (postInfo.author_nick !== nick) {
      throw new ForbiddenError("Вам запрещено редактировать данный пост!");
    }

    const isLiked = await runPoolQuery(QUERIES.GET_IS_LIKED, [postId, nick]);

    if (isLiked) {
      await runPoolQuery(QUERIES.UNLIKE, [postId, nick]);
    } else {
      await runPoolQuery(QUERIES.LIKE, [postId, nick]);
    }

    return !isLiked;
  }
}

export default PostService;
