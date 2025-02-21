import { HttpException, HttpStatus } from "@nestjs/common";

export const GENERIC_EXCEPTION_TYPE = 'GENERIC_ERROR';

interface CustomExceptionOptions {
  message: string;
  statusCode?: number;
  type?: string;
}

export class CustomException extends HttpException {
  type: string;

	constructor(
		options: CustomExceptionOptions,
	) {
		super(options.message, options.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR);
		this.type = options.type ?? GENERIC_EXCEPTION_TYPE;
	}
}
