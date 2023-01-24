export class NotFoundError extends Error {}
export class BadRequestError extends Error {}
export class ForbiddenError extends Error {}
export class UnprocessableEntityError extends Error {}
export class UnauthorizedError extends Error {}

class Utils {
  static catchError(res, err) {
    if (err instanceof BadRequestError) {
      return res.status(400).json({
        reason: err.message || "Ошибка БД",
      });
    }

    if (err instanceof UnauthorizedError) {
      return res.status(401).json({
        reason: err.message || "Необходимо авторизоваться",
      });
    }

    if (err instanceof ForbiddenError) {
      return res.status(403).json({
        reason: err.message || "Доступ запрещен",
      });
    }

    if (err instanceof NotFoundError) {
      return res.status(404).json({
        reason: err.message || "Ошибка БД",
      });
    }

    if (err instanceof UnprocessableEntityError) {
      return res.status(422).json({
        reason: err || "Необрабатываемый объект",
      });
    }

    return res.status(500).json({
      reason: err || "Внутренняя ошибка сервера",
    });
  }
}

export default Utils;
