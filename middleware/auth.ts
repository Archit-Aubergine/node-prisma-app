import { NextFunction, Request, Response } from "express";

import ErrorHandler from "../utils/ErrorHandler";
import AsyncErrorHandler from "./AsyncErrorHandler";
import jwt from "jsonwebtoken";
import { prismaClient } from "..";
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
export const AuthenticateUser = AsyncErrorHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) {
      return next(
        new ErrorHandler("Please Login to access this resource", 401)
      );
    }

    const decodedData: any = jwt.verify(token, String(process.env.JWT_SECRET));

    req.user = await prismaClient.user.findFirst({
      where: { id: decodedData.id },
    });
    next();
  }
);

export const AuthorizeRole =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.user && !roles.includes(req.user?.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
