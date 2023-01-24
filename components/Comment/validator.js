import Validator from "../../utils/validator.js";
import * as Yup from "yup";
import { postId } from "../Post/validator.js";

const comment = Yup.object({
  body: Yup.object({
    description: Yup.string()
      .required("Поле обязательно!")
      .typeError("Значение должно быть строкой!")
      .max(200, "Максимальная длина - 200 символов"),
  }),
});

class CommentValidator extends Validator {
  static getByPostId(req, res, next) {
    return Validator.validateRequest(req, res, next, postId);
  }

  static create(req, res, next) {
    return Validator.validateRequest(req, res, next, comment, true);
  }

  static deleteById(req, res, next) {
    return Validator.validateRequest(req, res, next, null, true);
  }
}

export default CommentValidator;
