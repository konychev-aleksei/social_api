import Validator from "../../utils/validator.js";
import * as Yup from "yup";

export const postId = Yup.object({
  query: Yup.object({
    id: Yup.number()
      .required("Поле обязательно!")
      .typeError("Значение должно быть числом!"),
  }),
});

const post = Yup.object({
  body: Yup.object({
    image: Yup.string()
      .required("Поле обязательно!")
      .typeError("Значение должно быть строкой!")
      .test(
        "maxSize",
        "Вес картинки не должен первышать 5 Мб!",
        (value) => (value.length * 0.75) / 1024 ** 2 < 5
      ),
    location: Yup.string()
      .required("Поле обязательно!")
      .typeError("Значение должно быть строкой!")
      .max(10, "Максимальная длина - 10 символов"),
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

const queryAndTag = Yup.object({
  query: Yup.object({
    query: Yup.string().max(200, "Максимальная длина - 200 символов"),
    tag: Yup.number()
      .min(1, "Минимальное значение - 1")
      .max(8, "Максимальное значение - 8")
      .typeError("Значение должно быть числом!"),
  }),
});

class PostValidator {
  static getById(req, res, next) {
    return Validator.validateRequest(req, res, next, postId);
  }

  static getByNick(req, res, next) {
    return Validator.validateRequest(req, res, next, null);
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

  static search(req, res, next) {
    return Validator.validateRequest(req, res, next, queryAndTag);
  }
}

export default PostValidator;
