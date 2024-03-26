const { StatusCodes, ReasonPhrases } = require("http-status-codes");

class CustomerSuccessApi {
  constructor({ message, statusCode, reasonStatusCode, metadata, options }) {
    this.message = message;
    this.statusCode = statusCode;
    this.reasonStatusCode = reasonStatusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends CustomerSuccessApi {
  constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata, options = {} }) {
    super({ message, statusCode, reasonStatusCode, metadata, options });
  }
}
class CREATED extends CustomerSuccessApi {
  constructor({ message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata, options = {} }) {
    super({ message, statusCode, reasonStatusCode, metadata, options });
  }
}

module.exports = {
  OK,
  CREATED,
};