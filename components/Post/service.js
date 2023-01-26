import POST_QUERIES from "./queries.js";
import getCurrentTime from "../../utils/getCurrentTime.js";
import { runPoolQuery } from "../../config/db.js";
import { NotFoundError, ForbiddenError } from "../../utils.js";
import moment from "moment";

class PostService {
  static async getPostInfo(data) {
    const { postId, nick } = data;
    const post = await runPoolQuery(POST_QUERIES.GET_POST_BY_ID, [postId]);

    if (!post) {
      throw new NotFoundError("Пост не найден.");
    }

    let isLiked;
    if (nick) {
      isLiked = await runPoolQuery(POST_QUERIES.GET_IS_LIKED, [postId, nick]);
    }
    const is_liked = Boolean(isLiked);

    const likesCount = await runPoolQuery(POST_QUERIES.GET_LIKES_COUNT, [postId]);
    const likes_count = Number(likesCount.count);

    const created_on = moment.unix(post.created_on).format("DD-MM-YYYY");
    const tags = post.tags.split("").map((tag) => Number(tag));

    return { ...post, is_liked, likes_count, tags, created_on };
  }

  static async getPostsByNick(nick) {
    const posts = await runPoolQuery(POST_QUERIES.GET_POSTS_BY_NICK, [nick], false);
    const ids = posts.map((post) => post.id);

    return ids;
  }

  static async createPost(data) {
    const { post, nick } = data;
    const { location, description, tags } = post;

    const tagsFormatted = tags.sort((a, b) => a - b).join("");
    const createdOn = getCurrentTime();

    const id = await runPoolQuery(POST_QUERIES.CREATE_POST, [
      location,
      description,
      tagsFormatted,
      createdOn,
      nick,
    ]);

    return id;
  }

  static async updatePost(data) {
    const { postId, nick, post } = data;
    const { location, description, tags } = post;

    const postInfo = await runPoolQuery(POST_QUERIES.GET_POST_BY_ID, [postId]);

    if (!postInfo) {
      throw new NotFoundError("Пост не найден.");
    }

    if (postInfo.author_nick !== nick) {
      throw new ForbiddenError("Вам запрещено редактировать данный пост!");
    }

    const updatedPost = await runPoolQuery(POST_QUERIES.UPDATE_POST_BY_ID, [
      location,
      description,
      tags,
      postId,
    ]);

    if (!updatedPost) {
      throw new Error("Ошибка редактирования поста.");
    }

    return updatedPost;
  }

  static async deletePost(data) {
    const { postId, nick } = data;
    const postInfo = await runPoolQuery(POST_QUERIES.GET_POST_BY_ID, [postId]);

    if (!postInfo) {
      throw new NotFoundError("Пост не найден.");
    }

    if (postInfo.author_nick !== nick) {
      throw new ForbiddenError("Вам запрещено удалять данный пост!");
    }

    await runPoolQuery(POST_QUERIES.DELETE_POST_BY_ID, [postId]);
  }

  static async toggleLikePost(data) {
    const { postId, nick } = data;
    const postInfo = await runPoolQuery(POST_QUERIES.GET_POST_BY_ID, [postId]);

    if (!postInfo) {
      throw new NotFoundError("Пост не найден.");
    }

    if (postInfo.author_nick !== nick) {
      throw new ForbiddenError("Вам запрещено редактировать данный пост!");
    }

    if (postInfo.liked) {
      await runPoolQuery(POST_QUERIES.UNLIKE_POST, [postId, nick]);
    } else {
      await runPoolQuery(POST_QUERIES.LIKE_POST, [postId, nick]);
    }

    return !postInfo.liked;
  }

  static async search(data) {
    const { query, tag } = data;
    const response = await runPoolQuery(POST_QUERIES.SEARCH, [query, tag], false);

    return response;
  }
}

export default PostService;
