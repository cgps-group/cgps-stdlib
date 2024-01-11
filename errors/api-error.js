class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }

  sendError(res) {
    res.statusCode = this.statusCode;
    res.statusMessage = this.message;
    res.end(this.message);
  }

  isApiError() {
    return true;
  }
}

export default ApiError;
