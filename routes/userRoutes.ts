import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
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

export default router;
