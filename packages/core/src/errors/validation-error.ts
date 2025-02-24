import { ZodError } from "zod";
import { CustomError } from "./custom-error";

export class ValidationError extends CustomError {
  constructor(message: string) {
    super({ type: "ValidationError", message, statusCode: 400 });
  }

  static fromZodError(error: ZodError) {
    const message = error.issues.map((issue) => issue.message).join(". ");
    return new ValidationError(message);
  }
}
