const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    const status =
      typeof err.statusCode === "number"
        ? err.statusCode
        : err.response?.status || 500;
    res.status(status).json({
      success: false,
      message: err.message
    });
  }
};
export { asyncHandler };
