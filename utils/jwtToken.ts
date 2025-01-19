// Create Token and saving in cookie

import { User } from "@prisma/client";
import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getJWTToken = (userId: number) => {
  return jwt.sign({ id: userId }, String(process.env.JWT_SECRET), {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const comparePassword = async (
  enteredPassword: string,
  userpassword: string
) => {
  return await bcrypt.compare(enteredPassword, userpassword);
};

export const sendToken = (user: User, statusCode: number, res: Response) => {
  const token = getJWTToken(user.id);

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
