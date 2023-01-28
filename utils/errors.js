class WebError {
  constructor(status, error) {
    this.status = status;
    this.error = error;
  }
}

export class UnauthorizedError extends WebError {
  constructor() {
    super(401, "Необходимо авторизоваться!");
  }
}

export class ForbiddenError extends WebError {
  constructor(error) {
    super(403, error);
  }
}

export class NotFoundError extends WebError {
  constructor(error) {
    super(404, error);
  }
}

export class UnprocessableEntityError extends WebError {
  constructor(error) {
    super(422, error.errors);
    this.value = error.path;
  }
}

class ErrorUtils {
  static catchError(res, err) {
    return res.status(err.status || 500).json(err);
  }
}

export default ErrorUtils;
