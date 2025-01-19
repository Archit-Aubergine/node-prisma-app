import { NextFunction, Request, Response } from "express";

const errorHandleMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Explicitly ensure `err.statusCode` is a number
  err.statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
  err.message = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorHandleMiddleware;
