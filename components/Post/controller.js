import PostService from "./service.js";
import ErrorsUtils from "../../utils/errors.js";
import CommonUtils from "../../utils/common.js";

class PostController {
  static async getById(req, res) {
    const postId = req.query.id;
    const nick = CommonUtils.getNick(req.headers.token);
    try {
      const data = { postId, nick };
      const post = await PostService.getPostInfo(data);

      return res.status(200).json(post);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async getPosts(req, res) {
    const tag = req.query.tag;
    try {
      const posts = await PostService.getPosts(tag);

      return res.status(200).json(posts);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async create(req, res) {
    const post = req.body;
    const nick = CommonUtils.getNick(req.headers.token);
    try {
      const data = { post, nick };
      const postId = await PostService.createPost(data);

      return res.status(200).json(postId);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async updateById(req, res) {
    const postId = req.query.id;
    const post = req.body;
    const nick = CommonUtils.getNick(req.headers.token);

    try {
      const data = { postId, nick, post };
      const updatedPost = await PostService.updatePost(data);

      return res.status(200).json(updatedPost);
    } catch (err) {
      console.log(err);
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async deleteById(req, res) {
    const postId = req.query.id;
    const nick = CommonUtils.getNick(req.headers.token);
    try {
      const data = { postId, nick };
      await PostService.deletePost(data);

      return res.sendStatus(200);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async toggleLikeById(req, res) {
    const postId = req.query.id;
    const nick = CommonUtils.getNick(req.headers.token);
    try {
      const data = { postId, nick };
      const isLiked = await PostService.toggleLikePost(data);

      return res.status(200).json(isLiked);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }
}

export default PostController;
