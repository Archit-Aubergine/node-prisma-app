import express from "express";
import {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";
const router = express.Router();

import { AuthenticateUser, AuthorizeRole } from "../middleware/auth";

router.route("/order/new").post(AuthenticateUser, newOrder);

router.route("/order/:id").get(AuthenticateUser, getSingleOrder);

router.route("/orders/me").get(AuthenticateUser, myOrders);

router
  .route("/admin/orders")
  .get(AuthenticateUser, AuthorizeRole("ADMIN"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(AuthenticateUser, AuthorizeRole("ADMIN"), updateOrder)
  .delete(AuthenticateUser, AuthorizeRole("ADMIN"), deleteOrder);

export default router;
