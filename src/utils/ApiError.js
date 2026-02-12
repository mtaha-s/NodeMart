class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
    ){
      super(message)
      this.statusCode = statusCode
      this.data = null
      this.message = message
      this.success = false
      this.errors = errors
    // capture stack trace if provided, otherwise use default
    if (stack) {
        this.stack = stack;
    } else {
    Error.captureStackTrace(this, this.constructor);
    }
  }
}
// export the api error class
export { ApiError }