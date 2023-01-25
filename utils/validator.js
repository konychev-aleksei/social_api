import admin from "../config/firebaseAdmin.js";
import ErrorUtils, {
  ForbiddenError,
  UnprocessableEntityError,
  UnauthorizedError,
} from "./errors.js";
import CommonUtils from "./common.js";

class Validator {
  static async processRequestData(req, schema) {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
      });
    } catch (error) {
      throw new UnprocessableEntityError(error);
    }
  }

  static async validateToken(token) {
    if (!token) {
      throw new UnauthorizedError();
    }

    try {
      const decodedValue = await admin.auth().verifyIdToken(token);

      if (decodedValue) {
        await CommonUtils.createUserIfNotExists(token);
        return next();
      }
    } catch (error) {
      throw new ForbiddenError(error);
    }
  }

  static async validateRequest(req, res, next, schema, tokenRequired = false) {
    try {
      if (tokenRequired) {
        const token = req.headers.token;
        await Validator.validateToken(token);
      }

      if (schema) {
        await Validator.processRequestData(req, schema);
      }

      return next();
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

export default Validator;
