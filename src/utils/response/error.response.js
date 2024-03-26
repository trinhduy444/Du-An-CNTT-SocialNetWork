const { StatusCodes, ReasonPhrases } = require("http-status-codes");

class CustomErrorApi extends Error {
  constructor(message) {
    super(message);
  }
}

class NotFoundError extends CustomErrorApi {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.reasonStatusCode = ReasonPhrases.NOT_FOUND;
  }
}
class BadRequestError extends CustomErrorApi {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.reasonStatusCode = ReasonPhrases.BAD_REQUEST;
  }
}
class InvalidInputError extends CustomErrorApi
{
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.reasonStatusCode = ReasonPhrases.BAD_REQUEST;
  }
}

class UnauthenticatedError extends CustomErrorApi {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.reasonStatusCode = ReasonPhrases.UNAUTHORIZED;
  }
}
class ForbiddenError extends CustomErrorApi {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
    this.reasonStatusCode = ReasonPhrases.FORBIDDEN;
  }
}

module.exports = {
  CustomErrorApi,
  NotFoundError,
  BadRequestError,
   UnauthenticatedError,
  ForbiddenError,
  InvalidInputError,
};