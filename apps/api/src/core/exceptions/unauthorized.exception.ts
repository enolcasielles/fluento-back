import { CustomException } from "./custom.exception";

export class UnauthorizedException extends CustomException {
  constructor(message: string, type: string = "UNAUTHORIZED") {
    super({
      message,
      statusCode: 401,
      type,
    });
  }
}