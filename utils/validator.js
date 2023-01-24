import createUserIfNotExists from "./createUser.js";
import admin from "../config/firebaseAdmin.js";
import {
  ForbiddenError,
  UnprocessableEntityError,
  UnauthorizedError,
} from "../utils.js";
import Utils from "../utils.js";

class Validator {
  static async validateRequest(req, res, next, schema, tokenRequired = false) {
    try {
      if (schema) {
        try {
          await schema.validate({
            body: req.body,
            query: req.query,
          });
        } catch (err) {
          const error = new UnprocessableEntityError();

          error.value = err.path;
          error.errors = err.errors;

          throw error;
        }
      }

      if (tokenRequired) {
        const token = req.headers.token;

        if (!token) {
          throw new UnauthorizedError("Вы неавторизованы!");
        }

        try {
          const decodedValue = await admin.auth().verifyIdToken(token);

          if (decodedValue) {
            await createUserIfNotExists(token);
            return next();
          }
        } catch (err) {
          const error = new ForbiddenError();
          error.message = err.message;

          throw error;
        }
      }

      return next();
    } catch (err) {
      return Utils.catchError(res, err);
    }
  }
}

export default Validator;
