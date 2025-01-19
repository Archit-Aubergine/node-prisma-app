import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  //  logoutUser, getUserDetails, updatePassword, updateProfile
} from "../controllers/usersController";
import { AuthenticateUser } from "../middleware/auth";

//register user
router.post("/register", registerUser);

//login user
router.post("/login", loginUser);

//logout user
router.get("/logout", logoutUser);

//get your profile data
router.get("/myprofile", AuthenticateUser, getUserDetails);

// //update profile
// router.put("/myprofile/update", AuthenticateUser, updateProfile);

// router.put("/change/password", AuthenticateUser, updatePassword);

export default router;
