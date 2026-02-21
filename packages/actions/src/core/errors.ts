/**
 * 自定义业务错误类，携带 HTTP 状态码
 */
export class ActionError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500
  ) {
    super(message);
    this.name = 'ActionError';
  }

  static badRequest(message: string): ActionError {
    return new ActionError(message, 400);
  }

  static unauthorized(message: string): ActionError {
    return new ActionError(message, 401);
  }

  static forbidden(message: string): ActionError {
    return new ActionError(message, 403);
  }

  static notFound(message: string): ActionError {
    return new ActionError(message, 404);
  }

  static conflict(message: string): ActionError {
    return new ActionError(message, 409);
  }

  static internal(message: string): ActionError {
    return new ActionError(message, 500);
  }
}
