
export class BadRequestError extends Error {
  constructor(message = "Yêu cầu không hợp lệ") {
    super(message);
    this.statusCode = 400;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Chưa xác thực hoặc không có quyền truy cập") {
    super(message);
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Bạn không có quyền truy cập") {
    super(message);
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  constructor(message = "Không tìm thấy dữ liệu") {
    super(message);
    this.statusCode = 404;
  }
}



const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Lỗi máy chủ nội bộ",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;
