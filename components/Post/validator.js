import Validator from "../../utils/validator.js";
import * as Yup from "yup";

export const postId = Yup.object({
  query: Yup.object({
    id: Yup.number()
      .required("Поле обязательно!")
      .typeError("Значение должно быть числом!"),
  }),
});

export const nick = Yup.object({
  query: Yup.object({
    nick: Yup.string().required("Поле обязательно!"),
  }),
});

const post = Yup.object({
  body: Yup.object({
    description: Yup.string()
      .required("Поле обязательно!")
      .typeError("Значение должно быть строкой!")
      .max(200, "Максимальная длина - 200 символов"),
    tags: Yup.array()
      .of(
        Yup.number()
          .min(1, "Минимальное значение - 1")
          .max(8, "Максимальное значение - 8")
          .typeError("Значение должно быть числом!")
      )
      .typeError("Значение должно быть массивом!"),
  }),
});

const postAndPostId = post.concat(postId);

const tag = Yup.object({
  query: Yup.object({
    tag: Yup.lazy((value) => {
      if (value === "") {
        return Yup.string();
      }

      return Yup.number()
        .min(1, "Минимальное значение - 1")
        .max(8, "Максимальное значение - 8")
        .typeError("Значение должно быть числом!");
    }),
  }),
});

class PostValidator {
  static getById(req, res, next) {
    return Validator.validateRequest(req, res, next, postId);
  }

  static getPosts(req, res, next) {
    return Validator.validateRequest(req, res, next, tag);
  }

  static create(req, res, next) {
    return Validator.validateRequest(req, res, next, post, true);
  }

  static updateById(req, res, next) {
    return Validator.validateRequest(req, res, next, postAndPostId, true);
  }

  static deleteById(req, res, next) {
    return Validator.validateRequest(req, res, next, postId, true);
  }

  static toggleLikeById(req, res, next) {
    return Validator.validateRequest(req, res, next, postId, true);
  }
}

export default PostValidator;
