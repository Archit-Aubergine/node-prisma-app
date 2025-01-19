import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import AsyncErrorHandler from "../middleware/AsyncErrorHandler";
import { comparePassword, sendToken } from "../utils/jwtToken";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

//register user
export const registerUser = AsyncErrorHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    console.log("user : ", name, email, password);

    let user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      throw Error("User already exists");
    }

    let hadhedPassword = await bcrypt.hash(password, 10);

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hadhedPassword,
        avatarPublicId: "myCloud.public_id",
        avatarUrl: "myCloud.secure_url",
        // public_id: myCloud.public_id,
        // url: myCloud.secure_url,
      },
    });
    sendToken(user, 201, res);
  }
);

//login user
export const loginUser = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //check 1 : if both the email and password are provided or not
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter email and password", 400));
    }

    //it finds the user with this given email and also selects the password(as it was select:false)
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    //if no user found
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    //if user found with same email then match the given password with the found user's password
    const isPasswordMatched = await comparePassword(password, user.password);

    //if not matched
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    //if matched - login - send the token
    sendToken(user, 200, res);
  }
);

//Logout User
export const logoutUser = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
);

//Get User Details
export const getUserDetails = AsyncErrorHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const user = await prismaClient.user.findFirst({
      where: { id: req.user.id },
      omit: { password: true },
    });

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// //Update User Password
// exports.updatePassword = AsyncErrorHandler(async (req, res, next) => {
//   const user = await User.findById(req.user.id).select("+password");

//   const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

//   if (!isPasswordMatched) {
//     return next(new ErrorHandler("Incorrect old password", 400));
//   }

//   //can add one more field - confirm password

//   user.password = req.body.newPassword;

//   await user.save();

//   sendToken(user, 200, res);
// });

// // update User Profile
// exports.updateProfile = AsyncErrorHandler(async (req, res, next) => {
//   const newUserData = {
//     name: req.body.name,
//     email: req.body.email,
//   };

//   if (req.body.avatar !== "") {
//     const user = await User.findById(req.user.id);

//     const imageId = user.avatar.public_id;

//     await cloudinary.v2.uploader.destroy(imageId);

//     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//       folder: "avatars",
//       width: 150,
//       crop: "scale",
//     });

//     newUserData.avatar = {
//       public_id: myCloud.public_id,
//       url: myCloud.secure_url,
//     };
//   }

//   const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//   });
// });
