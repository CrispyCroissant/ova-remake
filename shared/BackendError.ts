import { ErrorCodes } from "./enums";

class BackendError extends Error {
  errorCode: ErrorCodes;
  HTTPStatus: number;

  constructor(HTTPStatus: number, errorCode: ErrorCodes, message: string) {
    super(message);
    this.name = "BackendError";
    this.errorCode = errorCode;
    this.HTTPStatus = HTTPStatus;
  }
}

export { BackendError };
