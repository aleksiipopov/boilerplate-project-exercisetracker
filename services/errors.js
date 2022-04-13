class CustomError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
};

const handleError = (err, res) => {
  const { statusCode, message } = err;
  res.status(statusCode);
  res.json({
    status: "error",
    statusCode,
    message,
  });
};

module.exports = {
  CustomError,
  handleError,
}